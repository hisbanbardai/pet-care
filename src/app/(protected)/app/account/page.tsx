import ContentWrapper from "@/components/ContentWrapper";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  //gives us the current info of the session i.e. whatever we returned after the user is successfully logged in
  const session = await auth();

  //even though we are using middleware in our project to protect pages, we should still do the below check in every server component that needs to be protected or shown only when user is authenticated.
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <main>
      <div className="flex justify-between text-white/90 py-8 items-center">
        <h1 className="font-medium text-2xl">Your Account</h1>
      </div>

      <div className="h-[500px]">
        <ContentWrapper>
          <div className="flex justify-center items-center h-full">
            <p>Logged in as {session.user.email}</p>
          </div>
        </ContentWrapper>
      </div>
    </main>
  );
}
