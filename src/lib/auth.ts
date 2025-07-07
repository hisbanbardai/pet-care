import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
  pages: {
    signIn: "/signin",
  },
  //Callbacks are asynchronous functions you can use to control what happens when an action is performed.
  callbacks: {
    //The callbacks.authorized is executed when you use auth as middleware to protect private pages
    authorized: ({ request }) => {
      const isAccessingApp = request.nextUrl.pathname.includes("/app");

      if (isAccessingApp) {
        return false;
      }

      return true;
    },
  },
});
