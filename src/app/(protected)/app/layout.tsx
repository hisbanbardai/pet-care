import { fetchPets } from "@/actions/actions";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import BackgroundPattern from "@/components/BackgroundPattern";
import { Toaster } from "@/components/ui/sonner";
import PetsContextProvider from "@/contexts/PetsContextProvider";
import SearchContextProvider from "@/contexts/SearchContextProvider";
import { checkAuth } from "@/lib/server-utils";
import React from "react";

export default async function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const response = await fetch(
  //   "https://bg.com/course-assets/projects/petsoft/api/pets"
  // );

  // if (!response.ok) {
  //   throw new Error("Could not fetch pets data");
  // }

  // const data: TPet[] = await response.json();

  const session = await checkAuth();
  // console.log("Layout ke andar", session.user);

  //server action
  const pets = await fetchPets(session.user?.id);

  return (
    <>
      <BackgroundPattern />
      <div className="max-w-[1050px] mx-auto px-4 flex flex-col min-h-screen">
        <AppHeader />
        <SearchContextProvider>
          <PetsContextProvider data={pets}>{children}</PetsContextProvider>
        </SearchContextProvider>
        <AppFooter />
      </div>

      <Toaster position="top-right" />
    </>
  );
}
