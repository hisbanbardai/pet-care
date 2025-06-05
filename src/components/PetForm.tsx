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
  return (
    <form>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input id="ownerName" type="text" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="imageUrl">Image Url</Label>
            <Input id="imageUrl" type="text" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">{buttonLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </form>
  );
}
