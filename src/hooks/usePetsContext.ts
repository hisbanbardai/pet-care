"use client";

import { PetsContext } from "@/contexts/PetsContextProvider";
import { useContext } from "react";

export default function usePetsContext() {
  const context = useContext(PetsContext);

  if (!context) {
    throw new Error(
      "You are trying to use PetsContext inside a component that is not wrapped under PetsContextProvider component"
    );
  }

  return context;
}
