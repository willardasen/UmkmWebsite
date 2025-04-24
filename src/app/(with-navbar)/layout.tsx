"use client";
// src/app/(with-navbar)/layout.tsx
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Navbar />
      <main className="pt-4">{children}</main>
    </SessionProvider>
  );
}
