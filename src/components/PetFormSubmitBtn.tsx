import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function PetFormSubmitBtn({ buttonLabel }) {
  const { pending } = useFormStatus();

  return (
    <div className="mt-5">
      <Button type="submit" disabled={pending}>
        {buttonLabel}
      </Button>
    </div>
  );
}
