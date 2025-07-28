"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkAuth } from "@/lib/server-utils";
import { stripe } from "@/lib/stripe";
import { sleep } from "@/lib/utils";
import { authFormSchema, petFormSchema, petIdSchema } from "@/lib/zod";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/*--------------- PET ACTIONS ------------------- */

export async function fetchPets(userId: string | undefined) {
  return await prisma.pet.findMany({
    where: {
      userId,
    },
  });
}

export async function addPet(newPet: unknown) {
  //we set newPet type as unknown because this is the data that we are getting from the client to the server action addPet so we don't really know what is the type of the data we are getting and that is why we are why using zod to validate it first before inserting it into the database

  //we can use the session directly in server action too as well as in server and client components/pages
  const session = await checkAuth();

  try {
    // await sleep(1000);

    const validatedPet = petFormSchema.safeParse(newPet);

    if (!validatedPet.success) {
      console.error(validatedPet.error);
      return {
        message: "Invalid inputs",
      };
    }

    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      error,
      message: "Could not add a pet",
    };
  }

  //to re-render a certain part of the app
  revalidatePath("/", "layout");
}

export async function editPet(petId: unknown, updatedPet: unknown) {
  //we set petId and updatedPet types as unknown because this is the data that we are getting from the client to the server action editPet so we don't really know what is the type of the data we are getting

  //we can use the session directly in server action too as well as in server and client components/pages
  //authentication check (check if user has the valid token and he is what he says he is)
  const session = await checkAuth();

  try {
    // await sleep(1000);

    //validation of data
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

    //authorization check (to check if the pet that user is trying to edit actually belongs to the user)
    const pet = await prisma.pet.findUnique({
      where: {
        id: validatePetId.data,
      },
      select: {
        userId: true,
      },
    });

    //additional check to see if pet exists
    if (!pet) {
      return {
        message: "Pet not found",
      };
    }

    if (pet?.userId !== session.user?.id) {
      return {
        message: "Not authorized",
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

  //we can use the session directly in server action too as well as in server and client components/pages
  //authentication check (check if user has the valid token and he is what he says he is)
  const session = await checkAuth();

  try {
    // await sleep(1000);

    //validation of data
    const validatePetId = petIdSchema.safeParse(petId);

    if (!validatePetId.success) {
      console.error(validatePetId.error);
      return {
        message: "Invalid pet data",
      };
    }

    //authorization check (to check if the pet that user is trying to check out actually belongs to the user)
    const pet = await prisma.pet.findUnique({
      where: {
        id: validatePetId.data,
      },
      select: {
        userId: true,
      },
    });

    //additional check to see if pet exists
    if (!pet) {
      return {
        message: "Pet not found",
      };
    }

    if (pet?.userId !== session.user?.id) {
      return {
        message: "Not authorized",
      };
    }

    //checkout the pet
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

export async function logIn(
  currentState: { message: string } | undefined,
  formData: unknown
) {
  //to mimic production like delay
  // await sleep(1000);

  //we set type unknown because we do not know what kind of data we are going to receive
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data",
    };
  }

  //for sign in, we did zod schema validation in the auth.ts file. It does not matter if we do it there or in the server action here

  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email as string,
      },
    });

    await signIn("credentials", {
      redirectTo: existingUser?.hasPaid ? "/app/dashboard" : "/payment",
      email,
      password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          message: "Invalid credentials",
        };
      }
    }

    //after signing in, nextJS automatically redirects and to make the redirect work nextJS throws an error so we have to make sure that we manually throw the error otherwise it will be stuck in the catch block
    throw error;
  }
}

export async function logOut() {
  //to mimic production like delay
  // await sleep(1000);

  await signOut({
    redirectTo: "/",
  });
}

export async function signUp(
  currentState: { message: string } | undefined,
  formData: unknown
) {
  //to mimic production like delay
  // await sleep(1000);

  //check if the data we received is of FormData
  if (!(formData instanceof FormData)) {
    throw new Error("Invalid form data");
  }

  //validate the data using zod schema

  //converting formData object to a javascript object because the zod schema expects a normal object
  const convertedFormData = Object.fromEntries(formData.entries());

  //validation
  const validatedFormData = authFormSchema.safeParse(convertedFormData);

  if (!validatedFormData.success) {
    throw new Error("Invalid form data");
  }

  const { email, password } = validatedFormData.data;

  try {
    //check if a user with email already exists (check not needed because we are checking prisma error code for already exisiting email in the catch block)
    // const existingUser = await prisma.user.findUnique({
    //   where: {
    //     email,
    //   },
    // });

    // if (existingUser) {
    //   throw new Error("A user with email address already exists");
    // }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists",
        };
      }
    }
    return {
      error,
      message: "Unable to create a user",
    };
  }

  //log in the new created user so that next auth will generate the cookie for us
  //sign in the user after successful creation of the account
  await signIn("credentials", { redirectTo: "/payment", email, password });
}

/*--------------- PAYMENT ACTIONS ------------------- */
//When user will click on buy access button on payment page on the client side, the server action below will run on the server and create a stripe checkout session using stripe library which in return will give us redirect url to the stripe platform payment page. After the payment is done user will come back to our client payment page

export const createCheckoutSession = async function () {
  //get the origin
  const headersList = await headers();
  const origin = headersList.get("origin");

  //authentication check
  const session = await checkAuth();

  //create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user?.email as string,
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/payment?success=true`,
    cancel_url: `${origin}/payment?canceled=true`,
  });

  //redirect user
  redirect(checkoutSession.url!);
};
