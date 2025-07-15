"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

/*--------------- PET ACTIONS ------------------- */

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

/*--------------- USER ACTIONS ------------------- */

export async function logIn(formData: FormData) {
  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({
    redirectTo: "/",
  });
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  //check if a user with email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      message: "User with that email address already exisits",
    };
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //create new user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  //log in the new created user so that next auth will generate the cookie for us
  await signIn("credentials", formData);
}
