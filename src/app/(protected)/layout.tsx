import React from "react";

export default function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>Header</header>
      {children}
    </>
  );
}
