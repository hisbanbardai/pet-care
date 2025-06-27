"use server";

import prisma from "@/lib/prisma";
import { TPet } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";

export async function fetchPets() {
  return await prisma.pet.findMany();
}

export async function addPet(newPet: unknown) {
  //we set newPet type as unknown because this is the data that we are getting from the client to the server action addPet so we don't really know what is the type of the data we are getting and that is why we are why using zod to validate it first before inserting it into the database
  try {
    await sleep(1000);

    const validatedPet = petFormSchema.safeParse(newPet);

    if (!validatedPet.success) {
      console.error(validatedPet.error);
      return {
        message: "Invalid inputs",
      };
    }

    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      error,
      message: "Could not add a pet",
    };
  }

  revalidatePath("/", "layout");
}

export async function editPet(petId: unknown, updatedPet: unknown) {
  //we set petId and updatedPet types as unknown because this is the data that we are getting from the client to the server action editPet so we don't really know what is the type of the data we are getting
  try {
    await sleep(1000);

    const validatedPet = petFormSchema.safeParse(updatedPet);
    const validatePetId = petIdSchema.safeParse(petId);

    if (!validatedPet.success || !validatePetId.success) {
      console.error(
        validatedPet.error
          ? validatedPet.error
          : "No error in validated pet data"
      );
      console.error(
        validatePetId.error
          ? validatePetId.error
          : "No error in validated pet id"
      );
      return {
        message: "Invalid pet data",
      };
    }

    await prisma.pet.update({
      where: {
        id: validatePetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    console.error(error);
    return {
      error,
      message: "Could not edit the pet",
    };
  }

  revalidatePath("/", "layout");
}

export async function checkoutPet(petId: unknown) {
  //we set petId type as unknown because this is the data that we are getting from the client to the server action checkoutPet so we don't really know what is the type of the data we are getting
  try {
    await sleep(1000);

    const validatePetId = petIdSchema.safeParse(petId);

    if (!validatePetId.success) {
      console.error(validatePetId.error);
      return {
        message: "Invalid pet data",
      };
    }

    await prisma.pet.delete({
      where: {
        id: validatePetId.data,
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
