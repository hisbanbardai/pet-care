"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import PetForm from "./PetForm";
import { useState } from "react";

type TPetActionButtonProps = {
  actionType: "add" | "edit" | "checkout";
  onClick?: () => void;
};

export default function PetActionButton({
  actionType,
  onClick,
}: TPetActionButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (actionType === "add") {
    return (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <PetForm
          title={"Add a new pet"}
          buttonLabel={"Add a new pet"}
          onFormSubmission={() => setIsFormOpen(false)}
          actionType={actionType}
        >
          <Button size={"icon"}>
            <PlusIcon className="size-6" />
          </Button>
        </PetForm>
      </Dialog>
    );
  }

  if (actionType === "edit") {
    return (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <PetForm
          title={"Edit pet"}
          buttonLabel={"Edit a pet"}
          onFormSubmission={() => setIsFormOpen(false)}
          actionType={actionType}
        >
          <Button variant={"secondary"}>Edit</Button>
        </PetForm>
      </Dialog>
    );
  }

  if (actionType === "checkout") {
    return (
      <Button onClick={onClick} variant={"secondary"}>
        Checkout
      </Button>
    );
  }
}
