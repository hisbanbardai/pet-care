"use client";

import { createCheckoutSession } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export default function PaymentPage() {
  const [isPending, startTransition] = useTransition();

  return (
    <main className="flex flex-col items-center gap-8">
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
    </main>
  );
}
