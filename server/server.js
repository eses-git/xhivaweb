// server/server.js

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Resend } = require('resend'); // 1. Import Resend
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 2. Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware (no changes here)
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// The API Endpoint (rewritten for Resend)
app.post(
  '/api/career-application',
  upload.array('attachments', 5),
  async (req, res) => {
    try {
      const { fullName, email, position, coverLetter } = req.body;
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
      }

      // 3. Format attachments for the Resend SDK
      const attachments = files.map(file => ({
        filename: file.originalname,
        content: file.buffer, // Use the file buffer directly
      }));

      // 4. Send the email using resend.emails.send()
      const { data, error } = await resend.emails.send({
        from: 'xhiva-careers@xhiva.org', // MUST be an email from your verified domain
        to: 'anishkothari10@gmail.com', // Where you want to receive applications
        subject: `XHIVA.org -Career Application: ${position} from ${fullName}`,
        reply_to: email, // Use 'reply_to' for the applicant's email
        html: `
          <h2>New Career Application</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Position Applied For:</strong> ${position}</p>
          <hr />
          <p><strong>Cover Letter:</strong></p>
          <p>${coverLetter.replace(/\n/g, '<br>')}</p>
        `,
        attachments: attachments,
      });

      // 5. Check for errors from the Resend API
      if (error) {
        console.error('Resend API Error:', error);
        return res.status(400).json({ message: error.message });
      }

      res.status(200).json({ message: 'Application sent successfully!' });

    } catch (error) {
      console.error('Server Error:', error);
      if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'One of the files is too large. The limit is 10MB.' });
      }
      res.status(500).json({ message: 'Failed to send the application.' });
    }
  }

);

// --- *** NEW API ENDPOINT FOR CONTACT FORM *** ---
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    const { data, error } = await resend.emails.send({
      from: 'xhiva-contact@xhiva.org', // MUST be an email from your verified domain
      to: 'anishkothari10@gmail.com', // Where you want to receive contact messages
      subject: `XHIVA.org - New Contact Form Submission from ${name}`,
      reply_to: email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});
// --- *** END OF NEW ENDPOINT *** ---

// Start the Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// Start the Server (no changes here)
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});