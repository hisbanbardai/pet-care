"use client";

import usePetsContext from "@/hooks/usePetsContext";
import Image from "next/image";

export default function PetDetails() {
  const { selectedPet } = usePetsContext();

  return (
    <div className="w-full h-full bg-black/[0.03] flex flex-col">
      <div className="flex items-center bg-white px-8 py-5 border-b border-black/[0.08]">
        <Image
          src={selectedPet?.imageUrl}
          alt="Pet image"
          width={75}
          height={75}
          className="w-[75px] h-[75px] rounded-full object-cover"
        />

        <h2 className="font-semibold text-3xl ml-5">{selectedPet?.name}</h2>
      </div>

      <div className="flex justify-around py-10 px-5 text-center">
        <div>
          <h3 className="text-[13px] font-medium uppercase text-zinc-700">
            Owner name
          </h3>
          <p className="mt-1 text-lg text-zinc-800">{selectedPet?.ownerName}</p>
        </div>

        <div>
          <h3 className="text-[13px] font-medium uppercase text-zinc-700">
            Age
          </h3>
          <p className="mt-1 text-lg text-zinc-800">{selectedPet?.age}</p>
        </div>
      </div>

      <div className="bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-black[0.08] flex-1">
        {selectedPet?.notes}
      </div>
    </div>
  );
}
