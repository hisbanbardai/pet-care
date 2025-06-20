"use server";

import prisma from "@/lib/prisma";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function fetchPets() {
  return await prisma.pet.findMany();
}

export async function addPet(formData: FormData) {
  try {
    await sleep(3000);

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
    await sleep(300);

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

export async function checkoutPet(petId: string) {
  try {
    await sleep(3000);

    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete the pet",
    };
  }

  revalidatePath("/", "layout");
}
