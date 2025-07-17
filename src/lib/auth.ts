import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

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
        const { email, password } = credentials;

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
        const isPasswordSame = bcrypt.compare(
          password as string,
          existingUser.password
        );

        if (!isPasswordSame) {
          console.log("Invalid credentials");
          return null;
        }

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

      if (isLoggedIn && !isAccessingApp) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if ((isAccessingApp && isLoggedIn) || !isAccessingApp) {
        return true;
      }

      return false;
    },

    redirect: async ({ url, baseUrl }) => {
      // console.log("URL", url);
      // console.log("BASEURL", baseUrl);

      //in the case of sign out action where we are redirecting user to home page
      if (url.startsWith("/")) {
        return baseUrl + url;
      }

      //check if there is a callbackurl parameter in the url
      const urlObj = new URL(url);
      const callbackUrlParam = urlObj.searchParams.get("callbackUrl");
      // console.log("CALLBACKURL", callbackUrlParam);

      if (callbackUrlParam) {
        return callbackUrlParam; // Return the specific callbackUrl from the query
      }

      if (url.includes("signin")) {
        return baseUrl + "/app/dashboard";
      }

      // Fallback to default behavior if no specific callbackUrl is found
      return url.startsWith(baseUrl) ? url : baseUrl;
    },

    //Auth.js libraries only expose a subset of the user’s information by default in a session to not accidentally expose sensitive user information. This is name, email, and image. To resolve this issue we attach the user id in jwt callback.
    //NOTE: We do not have to explicitly attach the user id to token object in jwt callback because it already is present inside the object but with an unusual key name "sub" that is why for our convenience, below we added userId to the token object
    jwt: async ({ token }) => {
      // console.log("jwt token", token);
      token.userId = token.sub;
      return token;
    },

    //Below session callback will run everytime we try to access a session on client or server side and as we discovered that by default auth js does not put sensitive information like user id in the session object, we have to do it ourselves like we are doing it below. We take the userId from the token object that we put in the jwt callback and add it to the session object
    session: async ({ session, token }) => {
      // console.log("auth ke andar", session);
      session.user.id = token.userId as string;

      return session;
    },
  },
} satisfies NextAuthConfig);
