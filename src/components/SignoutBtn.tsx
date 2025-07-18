"use client";

import { logOut } from "@/actions/actions";
import { Button } from "./ui/button";
import { useTransition } from "react";

export default function SignoutBtn() {
  //useTransition is a React Hook that lets you render a part of the UI in the background
  //We can use the useTransition hook to get the loading state of a server action outside a form
  const [isPending, startTransition] = useTransition();

  // here we are calling a server action 'logOut' because we can call a server action inside a client component and also because we have to remove the cookie on the server side that means the code must run on the server side
  return (
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => await logOut());
      }}
    >
      Sign out
    </Button>
  );
}
