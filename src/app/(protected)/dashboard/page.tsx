import Branding from "@/components/Branding";
import SearchForm from "@/components/SearchForm";
import Stats from "@/components/Stats";

export default function DashboardPage() {
  return (
    <main>
      <div className="flex justify-between text-white/90 py-8 items-center">
        <Branding />
        <Stats />
      </div>

      <div>
        <SearchForm />
      </div>
    </main>
  );
}
