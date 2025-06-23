"use client";

import { addPet, checkoutPet, editPet } from "@/actions/actions";
import { TPet } from "@/lib/types";
import { createContext, startTransition, useOptimistic, useState } from "react";
import { toast } from "sonner";

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
  handleCheckoutPet: (petId: string) => Promise<void>;
  handleAddPet: (pet: Omit<TPet, "id">) => Promise<void>;
  handleEditPet: (petId: string, pet: Omit<TPet, "id">) => Promise<void>;
} | null;

export const PetsContext = createContext<TPetsContext>(null);

export default function PetsContextProvider({
  data,
  children,
}: TPetsContextProviderProps) {
  //state
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //we are removing the below state because previously we would fetch the data of the pets and set it as the initial data of the state (the state would only use this data as initial data the first time) and everytime we used to add a new pet we would just update the state using setPets but that is just updating on the client side. Now we are fetching the pets from the database and when we add a new pet we are creating it in the database too so we need to directly use the data that we are fetching from the database

  // const [pets, setPets] = useState(data);

  //we are using useOptimistic() hook below to optimistically update the UI and we use it in place of useState and also we will call the server actions inside the handler functions because it does not matter where we call the server actions
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (currentState, { action, payload }): TPet[] => {
      switch (action) {
        case "add":
          return [...currentState, payload];

        case "edit":
          return currentState.map((pet) => {
            if (pet.id === payload.petId) {
              return { ...pet, ...payload.pet };
            }
            return pet;
          });

        case "checkout":
          return currentState.filter((pet) => pet.id !== payload.petId);

        default:
          return currentState;
      }
    }
  );

  //derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  //event handler functions / actions
  function handleChangeSelectedPetId(id: string) {
    setSelectedPetId(id);
  }

  async function handleCheckoutPet(petId: string) {
    // setPets((prev) => prev.filter((pet) => pet.id !== selectedPetId));

    startTransition(() => {
      setOptimisticPets({ action: "checkout", payload: { petId } });
    });

    const error = await checkoutPet(petId);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSelectedPetId(null);
  }

  async function handleAddPet(pet: Omit<TPet, "id">) {
    // setPets((prev) => [...prev, { ...pet, id: Date.now().toString() }]);

    setOptimisticPets({
      action: "add",
      payload: { ...pet, id: Date.now().toString() },
    });

    const error = await addPet(pet);

    if (error) {
      toast.error(error.message);
      return;
    }
  }

  async function handleEditPet(petId: string, pet: Omit<TPet, "id">) {
    // setPets((prev) =>
    //   prev.map((p) => {
    //     if (p.id === petId) {
    //       return { id: petId, ...pet };
    //     }
    //     return p;
    //   })
    // );

    setOptimisticPets({ action: "edit", payload: { petId, pet } });

    const error = await editPet(petId, pet);

    if (error) {
      toast.error(error.message);
      return;
    }
  }

  return (
    <PetsContext
      value={{
        selectedPetId,
        pets: optimisticPets,
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
