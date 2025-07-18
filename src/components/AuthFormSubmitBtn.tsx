"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type AuthFormSubmitBtnProps = {
  type: "signin" | "signUp";
};

export default function AuthFormSubmitBtn({ type }: AuthFormSubmitBtnProps) {
  //below we used the useFormStatus hook to get the status of the last form submission like if it is in a pending state or whatever. To use that we needed to add a button component which should be the direct child of the form which AuthFormSubmitBtn is
  const { pending } = useFormStatus();

  return (
    <div className="mt-5">
      <Button disabled={pending} type="submit">
        {type === "signUp" ? "Sign up" : "Sign in"}
      </Button>
    </div>
  );
}
