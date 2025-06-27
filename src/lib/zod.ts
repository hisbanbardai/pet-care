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
      "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
  }));

export type TPetFormSchema = z.infer<typeof petFormSchema>;
