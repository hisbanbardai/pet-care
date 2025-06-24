"use server";

import prisma from "@/lib/prisma";
import { TPet } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function fetchPets() {
  return await prisma.pet.findMany();
}

export async function addPet(newPet: Omit<TPet, "id">) {
  try {
    await sleep(1000);

    await prisma.pet.create({
      data: newPet,
    });
  } catch (error) {
    return {
      error,
      message: "Could not add a pet",
    };
  }

  revalidatePath("/", "layout");
}

export async function editPet(petId: string, updatedPet: Omit<TPet, "id">) {
  try {
    await sleep(1000);

    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: updatedPet,
    });
  } catch (error) {
    return {
      error,
      message: "Could not edit the pet",
    };
  }

  revalidatePath("/", "layout");
}

export async function checkoutPet(petId: string) {
  try {
    await sleep(1000);

    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      error,
      message: "Could not delete the pet",
    };
  }

  revalidatePath("/", "layout");
}
