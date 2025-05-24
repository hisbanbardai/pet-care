import Image from "next/image";
import placeholderImage from "../../public/pet-placeholder.png";

export default function PetList() {
  return (
    <ul className="w-full bg-white border-b border-black/[0.08]">
      <li>
        <button className="flex w-full h-[70px] items-center cursor-pointer px-5 text-base gap-3 hover:bg-neutral-100 focus:bg-neutral-100 transition-all">
          <Image
            src={placeholderImage}
            alt="pet-placeholder-image"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <p className="font-semibold">Benjamin</p>
        </button>
      </li>

      <li>
        <button className="flex w-full h-[70px] items-center cursor-pointer px-5 text-base gap-3 hover:bg-neutral-100 focus:bg-neutral-100 transition-all">
          <Image
            src={placeholderImage}
            alt="pet-placeholder-image"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <p className="font-semibold">Benjamin</p>
        </button>
      </li>
    </ul>
  );
}
