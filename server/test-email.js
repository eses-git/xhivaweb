// server/test-email.js
require('dotenv').config();
const { Resend } = require('resend');

// Initialize Resend with the API key from your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  console.log('Attempting to send a test email using the Resend SDK...');

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Resend's special test address
      to: ['xhiva.estera@proton.me'], // IMPORTANT: Change this to your own email
      subject: 'Test from Resend SDK',
      html: '<strong>If you are seeing this, your Resend API key is working!</strong>',
    });

    if (error) {
      console.error('❌ Failed to send email:', error);
      return;
    }

    console.log('✅ Email sent successfully!', data);
  } catch (error) {
    console.error('❌ An unexpected error occurred:', error);
  }
}

sendTestEmail();