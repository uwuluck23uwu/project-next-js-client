import { Header } from "@/components";
import React from "react";

export default function ShirtStyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
