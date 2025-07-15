import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      //runs on every login attempt
      authorize: async (credentials) => {
        const { email, password } = credentials;

        //fetch user from db
        const existingUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        //check if user exists
        if (!existingUser) {
          console.log("User not found");
          return null;
        }

        //match passwords
        const isPasswordSame = await bcrypt.compare(
          password,
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

      if (url.startsWith("/")) {
        return baseUrl + url;
      }

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
  },
});
