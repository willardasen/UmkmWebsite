import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UMKM GO",
  description: "UMKMGO - Aplikasi Peminjaman untuk UMKM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
