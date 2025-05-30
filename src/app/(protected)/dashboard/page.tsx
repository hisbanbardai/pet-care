import Branding from "@/components/Branding";
import ContentWrapper from "@/components/ContentWrapper";
import PetActionButton from "@/components/PetActionButton";
import PetDetails from "@/components/PetDetails";
import PetList from "@/components/PetList";
import SearchForm from "@/components/SearchForm";
import Stats from "@/components/Stats";

export default function DashboardPage() {
  return (
    <main>
      <div className="flex justify-between text-white/90 py-8 items-center">
        <Branding />
        <Stats />
      </div>

      <div className="grid md:grid-rows-[45px_1fr] grid-rows-[45px_300px_500px] grid-cols-1 md:grid-cols-[1fr_2fr] md:h-[600px] gap-4">
        <div className="md:col-start-1 md:col-span-1 md:row-start-1 md:row-span-1">
          <SearchForm />
        </div>

        <div className="relative md:col-start-1 md:col-span-1 md:row-start-2 md:row-span-1">
          <ContentWrapper>
            <PetList />
            <div className="absolute bottom-4 right-4">
              <PetActionButton actionType="add" />
            </div>
          </ContentWrapper>
        </div>

        <div className="md:col-start-2 md:col-span-1 md:row-start-1 md:row-span-full">
          <ContentWrapper>
            <PetDetails />
          </ContentWrapper>
        </div>
      </div>
    </main>
  );
}
