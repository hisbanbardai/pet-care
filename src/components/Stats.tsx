"use client";

import usePetsContext from "@/hooks/usePetsContext";

export default function Stats() {
  const { numberOfPets } = usePetsContext();

  return (
    <section className="text-center">
      <p className="text-2xl font-bold">{numberOfPets}</p>
      <p className="opacity-80">current guests</p>
    </section>
  );
}
