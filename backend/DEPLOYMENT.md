- Before deploying,
  - remove all the console.log statements from the codebase.
  - ensure that all sensitive information (like API keys) is stored in environment variables and not hardcoded in the codebase.
  - ensure that the application is running in production mode and not in development mode.
  - remove any unused dependencies and files from the codebase.
  - quick security checks:

When client makes a request to the server, the server should validate the request and ensure that it is coming from a trusted source. This can be done by checking the request headers, validating the request body, and implementing authentication and authorization mechanisms.
Server then processes the request and sends a response back to the client. The response should be properly formatted and contain the necessary information for the client to handle it. The response includes content, & also includes instructions for the client on how to handle the response, which is called security headers. Security headers are HTTP response headers that provide additional security measures to protect the client and server from various types of attacks. Some common security headers include:

- Content-Security-Policy (CSP, to block malicious content): This header helps prevent cross-site scripting (XSS) attacks by specifying which sources of content are allowed to be loaded by the client.
- Strict-Transport-Security (HSTS, to enforce HTTPS): This header tells the client to only communicate with the server over HTTPS, which helps prevent man-in-the-middle attacks
- X-Content-Type-Options (to prevent MIME type sniffing): This header tells the client to only interpret the content as the specified MIME type, which helps prevent attacks that rely on content type sniffing.
- X-Frame-Options (to prevent clickjacking): This header tells the client whether or not to allow the page to be displayed in a frame or iframe, which helps prevent clickjacking attacks.

**Web APP needs Security Headers to be set in the server response.** These headers can be set in the server code or in the web server configuration (like Nginx or Apache). The specific headers and their values will depend on the security requirements of the application, but some common security headers include:

- Content-Security-Policy (CSP, to block malicious content)
- Strict-Transport-Security (HSTS, to enforce HTTPS)
- X-Content-Type-Options (to prevent MIME type sniffing)
- X-Frame-Options (to prevent clickjacking)

## Helmet.js

- a Node.js middleware that helps secure Express apps by setting various HTTP headers. It can be used to set security headers like Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, and X-Frame-Options. It can also help prevent other types of attacks like cross-site scripting (XSS) and clickjacking.

**We need our code to run everywhere, so we will use Helmet.js to set security headers in our Express app.**
This will help protect our app from various types of attacks and ensure that it is secure for our users.

## NODE_ENV

NODE_ENV is a convention. It's not built-in to node.

when deploying the app, our code should live in two environments:

- Development Environment: This is where we write and test our code. It is usually a local environment on our own machines or a staging environment on a server. In this environment, we can use tools like nodemon to automatically restart the server when we make changes to the code. We can also use debugging tools to help us find and fix issues in our code.
- Production Environment: This is where our code runs in a live environment and is accessible to users. In this environment, we need to ensure that our code is optimized for performance and security. We should also ensure that our code is running in production mode, which can be done by setting the NODE_ENV environment variable to "production". This will enable certain optimizations and disable certain features that are only needed in development mode.

```js
process.env.NODE_ENV = "production";
```
