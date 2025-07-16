import { redirect } from "next/navigation";
import { auth } from "./auth";

export const checkAuth = async function () {
  const session = await auth();

  //even though we are using middleware in our project to protect pages, we should still do the below check in every server component that needs to be protected or shown only when user is authenticated.
  if (!session?.user) {
    redirect("/signin");
  }

  return session;
};
