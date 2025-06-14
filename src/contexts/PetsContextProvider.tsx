"use client";

import { addPet } from "@/actions/actions";
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
  data: pets,
  children,
}: TPetsContextProviderProps) {
  //state
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //we are removing the below state because previously we would fetch the data of the pets and set it as the initial data of the state (the state would only use this data as initial data the first time) and everytime we used to add a new pet we would just update the state using setPets but that is just updating on the client side. Now we are fetching the pets from the database and when we add a new pet we are creating it in the database too so we need to directly use the data that we are fetching from the database
  // const [pets, setPets] = useState(data);

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

  async function handleAddPet(pet: Omit<TPet, "id">) {
    // setPets((prev) => [...prev, { ...pet, id: Date.now().toString() }]);
    // await addPet(pet);
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
