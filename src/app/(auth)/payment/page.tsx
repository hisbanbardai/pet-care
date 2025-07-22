"use client";

import { createCheckoutSession } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";

export default function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ success: string; canceled: string }>;
}) {
  //In the page component we by default get searchParams prop. Using it we can get the params from the url

  const { success, canceled } = React.use(searchParams);
  const [isPending, startTransition] = useTransition();

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
        <h1 className="text-green-500 font-semibold text-lg mt-3">
          Payment successful! You now have lifetime access to PetCare <br />
          <p className="text-center">&#x2713;</p>
        </h1>
      )}

      {canceled && (
        <>
          <p className="text-red-600">Payment canceled. Please try again</p>
        </>
      )}
    </main>
  );
}
