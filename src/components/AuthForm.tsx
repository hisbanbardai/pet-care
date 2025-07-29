"use client";

import { logIn, signUp } from "@/actions/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import AuthFormSubmitBtn from "./AuthFormSubmitBtn";
import { useActionState } from "react";

type AuthFormProps = {
  type: "signin" | "signUp";
  callbackUrl?: string;
};

export default function AuthForm({ type, callbackUrl }: AuthFormProps) {
  //useActionState is a Hook that allows you to update state based on the result of a form action. Whatever we return from the server actions can be accessed by below signUpState and signInState variables

  const initialState = {
    message: "",
  };

  const [signUpState, dispatchSignUp] = useActionState(signUp, initialState);
  const [signInState, dispatchSignIn] = useActionState(logIn, initialState);

  return (
    /*<form action={type === "signUp" ? signUp : logIn}>
    we could have done the above but typescript was giving a red squiggly line under action attribute because it expects whatever the server action reference signUp or logIn we put it should only return Promise<void> and we are returning string in some cases. See chatgpt chat for refresher
    */
    <form action={type === "signUp" ? dispatchSignUp : dispatchSignIn}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          className="border-zinc-400"
          type="text"
          id="email"
          name="email"
          required
        />
      </div>

      <div className="space-y-1 mb-4 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input
          className="border-zinc-400"
          type="password"
          id="password"
          name="password"
          required
        />
      </div>
      <input type="hidden" name="callbackUrl" value={callbackUrl || ""} />

      <AuthFormSubmitBtn type={type} />

      {signUpState?.message && (
        <p className="text-red-500 text-sm mt-2">{signUpState.message}</p>
      )}
      {signInState?.message && (
        <p className="text-red-500 text-sm mt-2">{signInState.message}</p>
      )}
    </form>
  );
}
