import { TPet } from "@/lib/types";
import Image from "next/image";

type TPetListProps = {
  pets: TPet[];
};

export default function PetList({ pets }: TPetListProps) {
  return (
    <ul className="w-full bg-white border-b border-black/[0.08]">
      {pets.map((pet) => (
        <li key={pet.id}>
          <button className="flex w-full h-[70px] items-center cursor-pointer px-5 text-base gap-3 hover:bg-neutral-100 focus:bg-neutral-100 transition-all">
            <Image
              src={pet.imageUrl}
              alt="pet-placeholder-image"
              width={45}
              height={45}
              className="rounded-full object-cover w-[45px] h-[45px]"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
