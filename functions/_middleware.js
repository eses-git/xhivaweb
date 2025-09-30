// functions/_middleware.js
/*
// The onRequest function is the entry point for Pages Functions Middleware
export async function onRequest(context) {
    
    // 1. Retrieve the username and password from the environment variables (Runtime Variables)
    const USERNAME = context.env.BASIC_AUTH_USERNAME;
    const PASSWORD = context.env.BASIC_AUTH_PASSWORD;

    // 2. Check for the Authorization header
    const authorization = context.request.headers.get('Authorization');

    // If no Authorization header is present, prompt the user (HTTP 401 Challenge)
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

    // Decode the Base64 string to "username:password" (e.g., "viewer:MySecret")
    const decodedCredentials = atob(encoded); 
    const [username, password] = decodedCredentials.split(':');

    // 4. Validate the credentials against the stored environment variables
    // This logic is working, as confirmed by your previous steps.
    const isAuthorized = (username === USERNAME && password === PASSWORD);

    if (isAuthorized) {
        // --- AUTHENTICATION SUCCESS LOGIC: SPA Fallback Rewrite ---
        
        // This logic fixes the 404 error by ensuring all traffic is served 
        // by the root index.html, allowing the React Router to handle the path.
        
        const url = new URL(context.request.url);
        
        // If the request is NOT for a static file (which would have a file extension)
        // AND the path is NOT already the root, rewrite the path.
        // We ensure we don't try to rewrite paths that should be static assets.
        if (url.pathname !== '/') {
            
            // Create a new Request object but force the path to '/' (the index.html location)
            // This preserves the original URL in the browser's address bar.
            const request = new Request(url.origin + '/', context.request);
            
            // Pass the rewritten request to the next handler to serve index.html
            return context.next(request);
        }
        
        // If it's the root path ('/'), allow it to proceed normally.
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
}*/