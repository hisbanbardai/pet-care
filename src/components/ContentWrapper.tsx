import React from "react";

export default function ContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white w-full h-full rounded overflow-hidden">
      {children}
    </div>
  );
}
