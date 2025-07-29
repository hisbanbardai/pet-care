import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { authFormSchema } from "./zod";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      //runs on every login attempt
      authorize: async (credentials) => {
        //validation
        const validatedCredentials = authFormSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        const { email, password } = validatedCredentials.data;

        //fetch user from db
        const existingUser = await prisma.user.findUnique({
          where: {
            email: email as string,
          },
        });

        //check if user exists
        if (!existingUser) {
          console.log("User not found");
          return null;
        }

        //match passwords
        const isPasswordSame = await bcrypt.compare(
          password as string,
          existingUser.password
        );

        if (!isPasswordSame) {
          console.log("Invalid credentials");
          return null;
        }

        // console.log("existing user", existingUser);

        return existingUser;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  //Callbacks are asynchronous functions you can use to control what happens when an action is performed.
  callbacks: {
    //The callbacks.authorized is executed when you use auth as middleware to protect private pages. It will run on every request meaning whenever we enter a url in the browser and it will run for every url path except the ones mentioned in middleware.ts file
    authorized: ({ request, auth }) => {
      const isAccessingApp = request.nextUrl.pathname.includes("/app");

      //In auth object, we will receive whatever we return from the authorize function of credentials provider
      const isLoggedIn = Boolean(auth?.user);

      if (!isLoggedIn && isAccessingApp) {
        return false;
      }

      if (isLoggedIn && isAccessingApp && !auth?.user.hasPaid) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }

      if (isLoggedIn && isAccessingApp && auth?.user.hasPaid) {
        return true;
      }

      if (
        isLoggedIn &&
        !isAccessingApp &&
        auth?.user.hasPaid &&
        (request.nextUrl.pathname === "/" ||
          request.nextUrl.pathname.includes("/signin") ||
          request.nextUrl.pathname.includes("/signup") ||
          request.nextUrl.pathname.includes("/payment"))
      ) {
        return Response.redirect(new URL("/app/dashboard", request.url));
      }

      if (isLoggedIn && !isAccessingApp) {
        if (
          (request.nextUrl.pathname.includes("/signin") ||
            request.nextUrl.pathname.includes("/signup") ||
            request.nextUrl.pathname === "/") &&
          !auth?.user.hasPaid
        ) {
          return Response.redirect(new URL("/payment", request.url));
        }

        return true;
      }

      if (
        !isLoggedIn &&
        !isAccessingApp &&
        request.nextUrl.pathname.includes("payment")
      ) {
        return Response.redirect(new URL("/signin", request.url));
      }

      if (!isLoggedIn && !isAccessingApp) {
        return true;
      }

      return false;
    },

    // redirect: async ({ url, baseUrl }) => {
    //   // console.log("URL", url);
    //   // console.log("BASEURL", baseUrl);

    //   //in the case of sign out action where we are redirecting user to home page
    //   // if (url.startsWith("/")) {
    //   //   return baseUrl + url;
    //   // }

    //   //check if there is a callbackurl parameter in the url
    //   // const urlObj = new URL(url);
    //   // const callbackUrlParam = urlObj.searchParams.get("callbackUrl");
    //   // console.log("CALLBACKURL", callbackUrlParam);

    //   // if (callbackUrlParam) {
    //   //   return callbackUrlParam; // Return the specific callbackUrl from the query
    //   // }

    //   // if (url.includes("signin") || url.includes("signup")) {
    //   //   return baseUrl + "/payment";
    //   // }

    //   // Fallback to default behavior if no specific callbackUrl is found
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },

    //Auth.js libraries only expose a subset of the user’s information by default in a session to not accidentally expose sensitive user information. This is name, email, and image. To resolve this issue we attach the user id in jwt callback.
    // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client). The returned value will be encrypted, and it is stored in a cookie.
    //The JWT callback runs twice when user signs in, first it will create the token where we will also have access to the user (we can attach whatever we want to the token object from user), and second it will run to create the session but this time we will not have access to the user object, it will be undefined
    /*
    [Sign in]
        ↓
    [JWT callback] — with user → create token
        ↓
    [JWT callback] — no user → read token
        ↓
    [Session callback] — uses token → build session
    */
    //NOTE: We do not have to explicitly attach the user id to token object in jwt callback because it already is present inside the object but with an unusual key name "sub" that is why for our convenience, below we added userId to the token object

    //NOTE: JWT token contains user information that we want to store and lives on the client side in a browser. So if we change anything in the database of that user info, the token on the client side will not get updated automatically with that info. We would need to tell the server that we need to update the token and session, then server would go to database get the updated info of that user, attach it to the token, generate a new jwt token and will give it back to the client
    jwt: async ({ token, user, trigger }) => {
      // console.log("jwt callback");
      if (user) {
        token.userId = user.id;
        token.hasPaid = user.hasPaid;
      }

      //when we call update from useSession() on the client side, it will call this trigger and here we would update the token manually and give it back to the client
      if (trigger === "update") {
        const existingUser = await prisma.user.findUnique({
          where: {
            id: token.userId,
          },
        });

        if (existingUser) {
          token.hasPaid = existingUser.hasPaid;
        }
      }

      return token;
    },

    //Below session callback will run everytime we try to access a session on client or server side and as we discovered that by default auth js does not put sensitive information like user id in the session object, we have to do it ourselves like we are doing it below. We take the userId from the token object that we put in the jwt callback and add it to the session object
    session: async ({ session, token }) => {
      // console.log("session callback");

      session.user.id = token.userId;
      session.user.hasPaid = token.hasPaid;

      return session;
    },
  },
} satisfies NextAuthConfig);
