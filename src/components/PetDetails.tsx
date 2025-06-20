"use client";

import usePetsContext from "@/hooks/usePetsContext";
import { TPet } from "@/lib/types";
import Image from "next/image";
import PetActionButton from "./PetActionButton";
import { checkoutPet } from "@/actions/actions";
import { useTransition } from "react";

export default function PetDetails() {
  const { selectedPet } = usePetsContext();

  return (
    <div className="w-full h-full bg-black/[0.03] flex flex-col">
      {selectedPet ? (
        <>
          <TopBar selectedPet={selectedPet} />
          <OtherInfo selectedPet={selectedPet} />
          <Notes selectedPet={selectedPet} />
        </>
      ) : (
        <EmptyView />
      )}
    </div>
  );
}

function EmptyView() {
  return (
    <p className="text-2xl font-medium flex justify-center items-center h-full">
      No pet selected
    </p>
  );
}

function TopBar({ selectedPet }: { selectedPet: TPet }) {
  const { handleCheckoutPet } = usePetsContext();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-light">
      <Image
        src={selectedPet?.imageUrl}
        alt="Pet image"
        width={75}
        height={75}
        className="w-[75px] h-[75px] rounded-full object-cover"
      />

      <h2 className="font-semibold text-3xl ml-5">{selectedPet?.name}</h2>

      <div className="space-x-2 ml-auto flex">
        <PetActionButton actionType="edit" />
        <PetActionButton
          onClick={() => {
            startTransition(async function () {
              await checkoutPet(selectedPet.id);
            });
          }}
          actionType="checkout"
          disabled={isPending}
        />
      </div>
    </div>
  );
}

function OtherInfo({ selectedPet }: { selectedPet: TPet }) {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{selectedPet?.ownerName}</p>
      </div>

      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800">{selectedPet?.age}</p>
      </div>
    </div>
  );
}

function Notes({ selectedPet }: { selectedPet: TPet }) {
  return (
    <div className="bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-light flex-1">
      {selectedPet?.notes}
    </div>
  );
}
