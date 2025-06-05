import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import PetForm from "./PetForm";

type TPetActionButtonProps = {
  actionType: "add" | "edit" | "checkout";
  onClick?: () => void;
};

export default function PetActionButton({
  actionType,
  onClick,
}: TPetActionButtonProps) {
  if (actionType === "add") {
    return (
      <Dialog>
        <PetForm title={"Add a new pet"} buttonLabel={"Add a new pet"}>
          <Button size={"icon"}>
            <PlusIcon className="size-6" />
          </Button>
        </PetForm>
      </Dialog>
    );
  }

  if (actionType === "edit") {
    return (
      <Dialog>
        <PetForm title={"Edit pet"} buttonLabel={"Edit a pet"}>
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
