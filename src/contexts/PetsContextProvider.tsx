"use client";

import { createContext, useState } from "react";

export const PetsContext = createContext(null);

export default function PetsContextProvider({ data, children }) {
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [pets, setPets] = useState(data);

  return (
    <PetsContext
      value={{
        selectedPetId,
        pets,
      }}
    >
      {children}
    </PetsContext>
  );
}
