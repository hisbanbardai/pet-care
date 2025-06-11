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
  handleCheckoutPet: () => void;
  handleAddPet: (pet: Omit<TPet, "id">) => void;
  handleEditPet: (petId: string, pet: Omit<TPet, "id">) => void;
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

  function handleCheckoutPet() {
    setPets((prev) => prev.filter((pet) => pet.id !== selectedPetId));
    setSelectedPetId(null);
  }

  function handleAddPet(pet: Omit<TPet, "id">) {
    setPets((prev) => [...prev, { ...pet, id: Date.now().toString() }]);
  }

  function handleEditPet(petId: string, pet: Omit<TPet, "id">) {
    setPets((prev) =>
      prev.map((p) => {
        if (p.id === petId) {
          return { id: petId, ...pet };
        }
        return p;
      })
    );
  }

  return (
    <PetsContext
      value={{
        selectedPetId,
        pets,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetsContext>
  );
}
