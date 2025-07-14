"use client";

// import { FormEvent } from "react";
// import { Button } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import usePetsContext from "@/hooks/usePetsContext";
import PetFormSubmitBtn from "./PetFormSubmitBtn";
import { useForm } from "react-hook-form";
import { TPetPrisma } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { petFormSchema, TPetFormSchema } from "@/lib/zod";
import { useEffect } from "react";
// import { addPet, editPet } from "@/actions/actions";
// import { toast } from "sonner";

type TPetFormProps = {
  children: React.ReactNode;
  title: string;
  buttonLabel: string;
  onFormSubmission: () => void;
  actionType: "add" | "edit" | "checkout";
};

export default function PetForm({
  children,
  title,
  buttonLabel,
  actionType,
  onFormSubmission,
}: TPetFormProps) {
  // console.log("Pet form component rendering");

  const { handleAddPet, selectedPet, handleEditPet } = usePetsContext();
  // console.log(selectedPet);

  // const handleFormSubmit = function (e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const newPet = {
  //     name: formData.get("name") as string,
  //     ownerName: formData.get("ownerName") as string,
  //     imageUrl:
  //       (formData.get("imageUrl") as string) ||
  //       "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
  //     age: +(formData.get("age") as string),
  //     notes: formData.get("notes") as string,
  //   };

  //   if (actionType === "add") {
  //     //we should not add the id here because we are only getting the form data. We should id in the PetContextProvider
  //     handleAddPet(newPet);
  //   }

  //   if (actionType === "edit") {
  //     if (selectedPet) {
  //       handleEditPet(selectedPet.id, newPet);
  //     }
  //   }
  //   //this function below will determine what to do after the form has been submitted
  //   onFormSubmission();
  // };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<TPetFormSchema>({
    resolver: zodResolver(petFormSchema),
    defaultValues:
      actionType === "edit"
        ? {
            name: selectedPet?.name,
            ownerName: selectedPet?.ownerName,
            imageUrl: selectedPet?.imageUrl,
            age: selectedPet?.age,
            notes: selectedPet?.notes,
          }
        : undefined,
  });

  //used reset in useEffect to update the default values in the case of edit
  useEffect(() => {
    if (selectedPet && actionType === "edit") {
      reset(selectedPet);
    }
  }, [reset, selectedPet, actionType]);

  async function handleFormAction(formData: TPetPrisma) {
    //because we are directly calling our server action in form's action, to trigger the react hook form we need to call the below trigger method

    // const result = await trigger();
    //if result is not valid then we would just return and not the submit the data
    // if (!result) return;

    //Ignore the above because eventually we decided to not call server action in the action attribute of form and we went with the traditional way i.e. using the handleSubmit method provided by the RHF and calling onSubmit event from the form like this <form onSubmit={handleSubmit(handleFormAction)}>. handleFormAction will get the validated formData object

    //const petData = getValues();
    //if we were calling the server action in the action attribute of the form, eventually to get the zod validated data we would have to call getValues() method from RHF but the issue with this approach is that the form data we would get from the getValues() will be validated on the basis of zod schema but if we have applied any transformations in the zod schema like coercing string to number or using transform() method, those transformations would not be applied to the formData.
    //NOTE: the above mentioned issue with zod transformation will only happen on client side, if we send the formData that we will get from getValues() as it is to the server and then use the same schema on the server side, the transformations will get applied there

    const petData = formData;

    onFormSubmission();

    // const pet = {
    //   name: formData.get("name") as string,
    //   ownerName: formData.get("ownerName") as string,
    //   imageUrl:
    //     (formData.get("imageUrl") as string) ||
    //     "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
    //   age: parseInt(formData.get("age") as string),
    //   notes: formData.get("notes") as string,
    // };

    if (actionType === "add") {
      //server action
      // const error = await addPet(formData);

      // if (error) {
      //   toast.error(error.message);
      //   return;
      // }

      //above we used the server action directly but below we are using the handler function from the context provider inside which we will call the server action. It does not really matter where we call the server action from
      await handleAddPet(petData);
    }

    if (actionType === "edit" && selectedPet) {
      //server action
      // const error = await editPet(selectedPet.id, formData);
      // if (error) {
      //   toast.error(error.message);
      //   return;
      // }

      //above we used the server action directly but below we are using the handler function from the context provider inside which we will call the server action. It does not really matter where we call the server action from
      await handleEditPet(selectedPet.id, petData);
    }
  }
  //when you pass a function reference to the form action, it receives the formData object

  return (
    <>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormAction)}>
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">{title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                type="text"
                name="name"
                // required
                defaultValue={actionType === "edit" ? selectedPet?.name : ""}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                {...register("ownerName")}
                name="ownerName"
                type="text"
                // required
                // defaultValue={
                //   actionType === "edit" ? selectedPet?.ownerName : ""
                // }
              />
              {errors.ownerName && (
                <p className="text-red-500">{errors.ownerName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="imageUrl">Image Url</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                name="imageUrl"
                // type="text"
                // defaultValue={
                //   actionType === "edit" ? selectedPet?.imageUrl : ""
                // }
              />
              {errors.imageUrl && (
                <p className="text-red-500">{errors.imageUrl.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                {...register("age")}
                name="age"
                // type="number"
                // required
                // defaultValue={actionType === "edit" ? selectedPet?.age : ""}
              />
              {errors.age && (
                <p className="text-red-500">{errors.age.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                name="notes"
                rows={3}
                // required
                // defaultValue={actionType === "edit" ? selectedPet?.notes : ""}
              />
              {errors.notes && (
                <p className="text-red-500">{errors.notes.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <PetFormSubmitBtn buttonLabel={buttonLabel} />
          </DialogFooter>
        </form>
      </DialogContent>
    </>
  );
}
