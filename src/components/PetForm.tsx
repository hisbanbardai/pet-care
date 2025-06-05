"use client";

import { FormEvent } from "react";
import { Button } from "./ui/button";
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

type TPetFormProps = {
  children: React.ReactNode;
  title: string;
  buttonLabel: string;
};

export default function PetForm({
  children,
  title,
  buttonLabel,
}: TPetFormProps) {
  const { handleAddPet } = usePetsContext();

  const handleFormSubmit = function (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPet = {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl:
        (formData.get("imageUrl") as string) ||
        "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      age: +(formData.get("age") as string),
      notes: formData.get("notes") as string,
    };

    //we should not add the id here because we are only getting the form data. We should id in the PetContextProvider
    handleAddPet(newPet);
  };

  return (
    <>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">{title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input id="ownerName" name="ownerName" type="text" required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="imageUrl">Image Url</Label>
              <Input id="imageUrl" name="imageUrl" type="text" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} required />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">{buttonLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </>
  );
}
