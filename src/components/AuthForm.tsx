import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function AuthForm({ type }: { type: string }) {
  return (
    <form>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          className="border-zinc-400"
          type="text"
          id="email"
          name="email"
        />
      </div>

      <div className="space-y-1 mb-4 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input
          className="border-zinc-400"
          type="password"
          id="password"
          name="password"
        />
      </div>

      <Button>{type === "signup" ? "Sign up" : "Sign in"}</Button>
    </form>
  );
}
