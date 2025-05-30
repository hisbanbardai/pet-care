import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

type TPetActionButtonProps = {
  actionType: "add" | "edit" | "checkout";
};

export default function PetActionButton({ actionType }: TPetActionButtonProps) {
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
    return <Button variant={"secondary"}>Checkout</Button>;
  }
}
