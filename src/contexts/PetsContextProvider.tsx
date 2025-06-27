"use client";

import { addPet, checkoutPet, editPet } from "@/actions/actions";
import { Pet } from "@prisma/client";
import { TPet, TPetPrisma } from "@/lib/types";
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
  handleCheckoutPet: (petId: Pet["id"]) => Promise<void>;
  handleAddPet: (pet: TPetPrisma) => Promise<void>;
  handleEditPet: (petId: Pet["id"], pet: TPetPrisma) => Promise<void>;
} | null;

export const PetsContext = createContext<TPetsContext>(null);

type optimisticAction =
  | { action: "add"; payload: TPet }
  | { action: "edit"; payload: { petId: Pet["id"]; pet: TPetPrisma } }
  | { action: "checkout"; payload: { petId: Pet["id"] } };

//update function of useOptimistic hook
const updateFunction = (
  currentState: TPet[],
  { action, payload }: optimisticAction
): TPet[] => {
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
};

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
    updateFunction
  );

  //derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  //event handler functions / actions
  function handleChangeSelectedPetId(id: Pet["id"]) {
    setSelectedPetId(id);
  }

  async function handleCheckoutPet(petId: Pet["id"]) {
    // setPets((prev) => prev.filter((pet) => pet.id !== selectedPetId));

    //Yes — the real reason why startTransition() is required for checkout (but not add or edit) in your case is: Because add and edit are triggered through a <form action={...}>, but checkout is triggered via a client-side event handler (like onClick).
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

  async function handleAddPet(pet: TPetPrisma) {
    // setPets((prev) => [...prev, { ...pet, id: Date.now().toString() }]);

    startTransition(() => {
      setOptimisticPets({
        action: "add",
        payload: { ...pet, id: Date.now().toString() },
      });
    });

    const error = await addPet(pet);

    //if there is an error while adding a pet in the database then optimisticUI will automatically revert the UI update
    if (error) {
      toast.error(error.message);
      return;
    }
  }

  async function handleEditPet(petId: Pet["id"], pet: TPetPrisma) {
    // setPets((prev) =>
    //   prev.map((p) => {
    //     if (p.id === petId) {
    //       return { id: petId, ...pet };
    //     }
    //     return p;
    //   })
    // );

    startTransition(() => {
      setOptimisticPets({ action: "edit", payload: { petId, pet } });
    });

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
