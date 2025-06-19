"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addPet(formData: FormData) {
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

  revalidatePath("/", "layout");
}

// export async function fetchPets() {
//   return await prisma.pet.findMany();
// }
