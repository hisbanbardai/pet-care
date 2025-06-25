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
  const { handleAddPet, selectedPet, handleEditPet } = usePetsContext();

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
    trigger,
    formState: { errors },
  } = useForm<TPetPrisma>();

  async function handleFormAction(formData: FormData) {
    //because we are directly calling our server action in form's action, to trigger the react hook form we need to call the below trigger method
    const result = await trigger();
    //if result is not valid then we would just return and not the submit the data
    if (!result) return;

    onFormSubmission();

    const pet = {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl:
        (formData.get("imageUrl") as string) ||
        "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      age: parseInt(formData.get("age") as string),
      notes: formData.get("notes") as string,
    };

    if (actionType === "add") {
      //server action
      // const error = await addPet(formData);

      // if (error) {
      //   toast.error(error.message);
      //   return;
      // }

      //above we used the server action directly but below we are using the handler function from the context provider inside which we will call the server action. It does not really matter where we call the server action from
      await handleAddPet(pet);
    }

    if (actionType === "edit" && selectedPet) {
      //server action
      // const error = await editPet(selectedPet.id, formData);
      // if (error) {
      //   toast.error(error.message);
      //   return;
      // }

      //above we used the server action directly but below we are using the handler function from the context provider inside which we will call the server action. It does not really matter where we call the server action from
      await handleEditPet(selectedPet.id, pet);
    }
  }
  //when you pass a function reference to the form action, it receives the formData object

  return (
    <>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form action={handleFormAction}>
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
                // defaultValue={actionType === "edit" ? selectedPet?.name : ""}
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
              {errors.ownerName && <p>{errors.ownerName.message}</p>}
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
