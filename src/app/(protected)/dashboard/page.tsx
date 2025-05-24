import Branding from "@/components/Branding";
import ContentWrapper from "@/components/ContentWrapper";
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

      <div className="grid grid-rows-[45px_1fr] grid-cols-[1fr_2fr] h-[500px] gap-4">
        <div className="col-start-1 col-span-1 row-start-1 row-span-1">
          <SearchForm />
        </div>

        <div className="col-start-1 col-span-1 row-start-2 row-span-1">
          <ContentWrapper>
            <PetList />
          </ContentWrapper>
        </div>

        <div className="col-start-2 col-span-1 row-start-1 row-span-full">
          <ContentWrapper>
            <PetDetails />
          </ContentWrapper>
        </div>
      </div>
    </main>
  );
}
