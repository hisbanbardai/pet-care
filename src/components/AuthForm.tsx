import { logIn, signUp } from "@/actions/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type AuthFormProps = {
  type: "signin" | "signUp";
};

export default function AuthForm({ type }: AuthFormProps) {
  return (
    /*<form action={type === "signUp" ? signUp : logIn}>
    we could have done the above but typescript was giving a red squiggly line under action attribute because it expects whatever the server action reference signUp or logIn we put it should only return Promise<void> and we are returning string in some cases. See chatgpt chat for refresher
    */
    <form
      action={async (formData) => {
        "use server";
        if (type === "signUp") {
          await signUp(formData);
        } else {
          await logIn(formData);
        }
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          className="border-zinc-400"
          type="text"
          id="email"
          name="email"
        />
      </div>

      <div className="space-y-1 mb-4 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input
          className="border-zinc-400"
          type="password"
          id="password"
          name="password"
        />
      </div>

      <Button>{type === "signUp" ? "Sign up" : "Sign in"}</Button>
    </form>
  );
}
