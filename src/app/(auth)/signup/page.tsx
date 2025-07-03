import AuthBottomMessage from "@/components/AuthBottomMessage";
import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main>
      <h1 className="font-medium text-2xl text-center mb-5">Sign up</h1>
      <AuthForm type="signup" />
      <AuthBottomMessage
        text="Already have an account?"
        linkTo="/signin"
        linkText="Sign in"
      />
    </main>
  );
}
