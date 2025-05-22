import Image from "next/image";
import image from "../../../public/petsoft-preview.png";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-green-200 min-h-screen flex items-center justify-center gap-10 xl:flex-row flex-col">
      <Image src={image} alt="Preview of home page image" />

      <div>
        <Logo />
        <h1 className="text-5xl font-semibold my-6 max-w-[500px]">
          Manage your <span className="font-extrabold">pet daycare</span> with
          ease
        </h1>
        <p className="max-w-[600px] text-2xl font-medium">
          Use PetCare to easily keep track of pets under your care. Get lifetime
          access for $299.
        </p>
        <div className="mt-10 space-x-3">
          <Button asChild>
            <Link href={"/signup"}> Get started</Link>
          </Button>
          <Button asChild variant={"secondary"}>
            <Link href={"/signin"}> Log in</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
