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

  async function handleFormAction(formData: FormData) {
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
                name="name"
                type="text"
                required
                defaultValue={actionType === "edit" ? selectedPet?.name : ""}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                name="ownerName"
                type="text"
                required
                defaultValue={
                  actionType === "edit" ? selectedPet?.ownerName : ""
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="imageUrl">Image Url</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="text"
                defaultValue={
                  actionType === "edit" ? selectedPet?.imageUrl : ""
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                required
                defaultValue={actionType === "edit" ? selectedPet?.age : ""}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                required
                defaultValue={actionType === "edit" ? selectedPet?.notes : ""}
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
