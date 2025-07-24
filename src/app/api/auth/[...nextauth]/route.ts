// NextAuth provides a React hook called useSession() to access session data on the client side.
// However, session tokens (JWTs) are typically stored in HttpOnly cookies for security reasons,
// meaning they cannot be directly accessed via JavaScript in the browser.
// Instead, when useSession() is called, it internally makes a request to /api/auth/session,
// which is handled by the NextAuth API route at /api/auth/[...nextauth].
// This route is a "catch-all" route that handles all auth-related actions like sign-in, sign-out, session retrieval, etc.
// We typically define and export the GET and POST handlers for this route using:
// export { GET, POST } from "@/lib/auth";
// These handlers are provided by NextAuth and are responsible for managing auth logic.

export { GET, POST } from "@/lib/auth";
