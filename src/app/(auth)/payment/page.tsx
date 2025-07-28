"use client";

import { createCheckoutSession } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ success: string; canceled: string }>;
}) {
  //In the page component we by default get searchParams prop. Using it we can get the params from the url

  const { success, canceled } = React.use(searchParams);
  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center gap-8">
      {!success && (
        <>
          <h1 className="font-medium text-2xl text-center mb-5">
            PetCare access requires payment
          </h1>
          <Button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await createCheckoutSession();
              })
            }
          >
            Buy lifetimte access for $99
          </Button>
        </>
      )}

      {success && (
        <>
          <h1 className="text-green-700 font-semibold text-lg mt-3">
            Payment successful! You now have lifetime access to PetCare <br />
            <p className="text-center">&#x2713;</p>
          </h1>
          <Button
            onClick={async () => {
              //we are using update from useSession to tell the server to get the updated user data from db, update the token and session and give it back to the client
              //NOTE: JWT token contains user information that we want to store and lives on the client side in a browser. So if we change anything in the database of that user info, the token on the client side will not get updated automatically with that info. We would need to tell the server that we need to update the token and session, then server would go to database get the updated info of that user, attach it to the token, generate a new jwt token and will give it back to the client
              //In our case we need to update the hasPaid field to true in the database and add that field in the token and from token to session object

              await update(true);
              router.push("/app/dashboard");
            }}
            //disable the button when the request to update the jwt token is still in progress i.e. "loading" or when user already has paid which means he already has access to the app
            disabled={status === "loading" || session?.user.hasPaid}
          >
            Access PetCare
          </Button>
        </>
      )}

      {canceled && (
        <>
          <p className="text-red-600">Payment canceled. Please try again</p>
        </>
      )}
    </main>
  );
}
