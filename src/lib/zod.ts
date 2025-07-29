import { z } from "zod";

export const petIdSchema = z.string().uuid();

export const petFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(100),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: "Owner name is required" })
      .max(100),
    imageUrl: z
      .string()
      .trim()
      .url({ message: "Image url must be a valid url" })
      .or(z.literal("")),
    age: z.coerce.number().positive().int().max(9999),
    notes: z.union([
      z.literal(""),
      z.string().trim().max(500, { message: "Maximum 500 characters allowed" }),
    ]),
  })
  .transform((data) => ({
    ...data,
    imageUrl:
      data.imageUrl ||
      "https://ik.imagekit.io/jcpg0deps/PetCare/pet-placeholder.png?updatedAt=1753811510470",
  }));

export type TPetFormSchema = z.infer<typeof petFormSchema>;

export const authFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export type TAuthFormSchema = z.infer<typeof authFormSchema>;
