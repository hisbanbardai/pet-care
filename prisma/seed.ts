import { Prisma } from "@prisma/client";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";

const userData: Prisma.UserCreateInput = {
  email: "example@gmail.com",
  password: "",
  //below, because user has 1 to many relation with pets, we can directly add pets data when creating the user and prisma will automatically assign the user id to each of the below pets.
  pets: {
    create: [
      {
        name: "Benjamin",
        ownerName: "John Doe",
        imageUrl: "https://bytegrad.com/course-assets/images/rn-image-4.png",
        age: 2,
        notes:
          "Doesn't like to be touched on the belly. Plays well with other dogs.",
      },
      {
        name: "Richard",
        ownerName: "Josephine Dane",
        imageUrl: "https://bytegrad.com/course-assets/images/rn-image-5.png",
        age: 5,
        notes: "Needs medication twice a day.",
      },
      {
        name: "Anna",
        ownerName: "Frank Doe",
        imageUrl: "https://bytegrad.com/course-assets/images/rn-image-6.png",
        age: 4,
        notes: "Allergic to chicken.",
      },
    ],
  },
};

async function main() {
  console.log(`Start seeding ...`);

  const hashedPassword = await bcrypt.hash("example", 10);
  userData.password = hashedPassword;

  await prisma.user.create({
    data: userData,
  });

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
