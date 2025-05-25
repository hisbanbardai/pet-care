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
} | null;

export const PetsContext = createContext<TPetsContext>(null);

export default function PetsContextProvider({
  data,
  children,
}: TPetsContextProviderProps) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [pets, setPets] = useState(data);

  function handleChangeSelectedPetId(id: string) {
    setSelectedPetId(id);
  }

  return (
    <PetsContext
      value={{
        selectedPetId,
        pets,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetsContext>
  );
}
