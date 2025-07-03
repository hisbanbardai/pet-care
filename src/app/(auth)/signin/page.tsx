import AuthBottomMessage from "@/components/AuthBottomMessage";
import AuthForm from "@/components/AuthForm";

export default function SigninPage() {
  return (
    <main>
      <h1 className="font-medium text-2xl text-center mb-5">Sign in</h1>
      <AuthForm type="signin" />
      <AuthBottomMessage
        text="No account yet?"
        linkTo="/signup"
        linkText="Sign up"
      />
    </main>
  );
}
