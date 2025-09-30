// functions/_middleware.js

// The onRequest function is the entry point for Pages Functions Middleware
export async function onRequest(context) {
  // 1. Retrieve the username and password from the environment variables
  const USERNAME = context.env.BASIC_AUTH_USERNAME;
  const PASSWORD = context.env.BASIC_AUTH_PASSWORD;

  // 2. Check for the Authorization header
  const authorization = context.request.headers.get('Authorization');

  // If no Authorization header is present, prompt the user
  if (!authorization) {
    return new Response('Access denied. Authentication required.', {
      status: 401,
      headers: {
        // This header triggers the browser's native password pop-up
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  // 3. Decode the credentials from the header
  const [scheme, encoded] = authorization.split(' ');

  if (!encoded || scheme !== 'Basic') {
    return new Response('Invalid authentication scheme.', { status: 400 });
  }

  // Decode the Base64 string to "username:password"
  const decodedCredentials = atob(encoded); 
  const [username, password] = decodedCredentials.split(':');

  // 4. Validate the credentials
  // Note: Using a simple string comparison here. For production, you 
  // might use a cryptographic comparison to protect against timing attacks.
  const isAuthorized = (username === USERNAME && password === PASSWORD);

  if (isAuthorized) {
    // Credentials are valid, allow the request to proceed to the page content
    return context.next();
  } else {
    // Credentials are invalid, deny access and prompt again
    return new Response('Invalid secret password.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }
}