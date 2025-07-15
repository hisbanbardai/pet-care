"use client";

import { logOut } from "@/actions/actions";
import { Button } from "./ui/button";

export default function SignoutBtn() {
  // here we are calling a server action 'logOut' because we can call a server action inside a client component and also because we have to remove the cookie on the server side that means the code must run on the server side
  return <Button onClick={async () => await logOut()}>Sign out</Button>;
}
