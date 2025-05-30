import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

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
      <Button size={"icon"}>
        <PlusIcon className="size-6" />
      </Button>
    );
  }

  if (actionType === "edit") {
    return <Button variant={"secondary"}>Edit</Button>;
  }

  if (actionType === "checkout") {
    return (
      <Button onClick={onClick} variant={"secondary"}>
        Checkout
      </Button>
    );
  }
}
