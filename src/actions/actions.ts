"use server";

import prisma from "@/lib/prisma";
import { TPet } from "@/lib/types";

export async function addPet(pet: Omit<TPet, "id">) {
  await prisma.pet.create({
    data: pet,
  });
}

// export async function fetchPets() {
//   return await prisma.pet.findMany();
// }
