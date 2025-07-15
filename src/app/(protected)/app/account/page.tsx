import ContentWrapper from "@/components/ContentWrapper";
import SignoutBtn from "@/components/SignoutBtn";
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
          <div className="flex justify-center items-center h-full flex-col gap-3">
            <p>Logged in as {session.user.email}</p>

            {/* We created a separate signout button component because we wanted to do an onClick on the button and if we did that in this page component then we would have to make the whole page a client component that is why it is better to refactor it into a separate component  */}
            <SignoutBtn />
          </div>
        </ContentWrapper>
      </div>
    </main>
  );
}
