import { Button } from "./ui/button";

export default function PetFormSubmitBtn({
  buttonLabel,
}: {
  buttonLabel: string;
}) {
  //below we used the useFormStatus hook to get the status of the last form submission like if it is in a pending state or whatever. To use that we needed to add a button component which should be the direct child of the form which PetFormSubmitBtn is
  // const { pending } = useFormStatus();

  return (
    <div className="mt-5">
      <Button type="submit">{buttonLabel}</Button>
    </div>
  );
}
