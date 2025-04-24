// src/app/(with-navbar)/layout.tsx
import Navbar from "@/components/Navbar";

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-4">{children}</main>
    </>
  );
}
