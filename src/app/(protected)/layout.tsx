import { fetchPets } from "@/actions/actions";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import BackgroundPattern from "@/components/BackgroundPattern";
import { Toaster } from "@/components/ui/sonner";
import PetsContextProvider from "@/contexts/PetsContextProvider";
import SearchContextProvider from "@/contexts/SearchContextProvider";
import React from "react";

export default async function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const response = await fetch(
  //   "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  // );

  // if (!response.ok) {
  //   throw new Error("Could not fetch pets data");
  // }

  // const data: TPet[] = await response.json();

  //server action
  const pets = await fetchPets();

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
