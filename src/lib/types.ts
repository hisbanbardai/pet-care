import { Pet } from "@prisma/client";

export type TPet = {
  id: string;
  name: string;
  ownerName: string;
  imageUrl: string;
  age: number;
  notes: string;
};

export type TPetPrisma = Omit<Pet, "id" | "createdAt" | "updatedAt" | "userId">;

export type actionType = "add" | "edit" | "checkout";
