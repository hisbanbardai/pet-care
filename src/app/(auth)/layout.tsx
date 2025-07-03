import Logo from "@/components/Logo";

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center min-h-screen items-center flex-col">
      <Logo />
      {children}
    </div>
  );
}
