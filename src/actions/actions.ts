"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addPet(formData: FormData) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await prisma.pet.create({
      data: {
        name: formData.get("name") as string,
        ownerName: formData.get("ownerName") as string,
        imageUrl:
          (formData.get("imageUrl") as string) ||
          "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
        age: parseInt(formData.get("age") as string),
        notes: formData.get("notes") as string,
      },
    });
  } catch (error) {
    return {
      message: "Could not add a pet",
    };
  }

  revalidatePath("/", "layout");
}

export async function editPet(petId: string, formData: FormData) {
  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        name: formData.get("name") as string,
        ownerName: formData.get("ownerName") as string,
        imageUrl:
          (formData.get("imageUrl") as string) ||
          "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
        age: parseInt(formData.get("age") as string),
        notes: formData.get("notes") as string,
      },
    });
  } catch (error) {
    return {
      message: "Could not edit the pet",
    };
  }

  revalidatePath("/", "layout");
}

export async function fetchPets() {
  return await prisma.pet.findMany();
}
