"use client";

import { TPet } from "@/lib/types";
import { createContext, useState } from "react";

type TPetsContextProviderProps = {
  data: TPet[];
  children: React.ReactNode;
};

type TPetsContext = {
  selectedPetId: string | null;
  pets: TPet[];
  handleChangeSelectedPetId: (id: string) => void;
  selectedPet: TPet | undefined;
  numberOfPets: number;
} | null;

export const PetsContext = createContext<TPetsContext>(null);

export default function PetsContextProvider({
  data,
  children,
}: TPetsContextProviderProps) {
  //state
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [pets, setPets] = useState(data);

  //derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  //event handler functions / actions
  function handleChangeSelectedPetId(id: string) {
    setSelectedPetId(id);
  }

  return (
    <PetsContext
      value={{
        selectedPetId,
        pets,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
      }}
    >
      {children}
    </PetsContext>
  );
}
