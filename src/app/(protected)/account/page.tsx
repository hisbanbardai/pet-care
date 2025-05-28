import ContentWrapper from "@/components/ContentWrapper";

export default function AccountPage() {
  return (
    <main>
      <div className="flex justify-between text-white/90 py-8 items-center">
        <h1 className="font-medium text-2xl">Your Account</h1>
      </div>

      <div className="h-[500px]">
        <ContentWrapper>
          <div className="flex justify-center items-center h-full">
            <p>Logged in as...</p>
          </div>
        </ContentWrapper>
      </div>
    </main>
  );
}
