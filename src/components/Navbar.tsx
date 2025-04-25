// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { CgProfile } from "react-icons/cg";

type NavItem = { label: string; href: string };

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  let items: NavItem[] = [];

  if (role === "USER") {
    items = [
      { label: "List UMKM", href: "/umkm-list" },
      { label: "Request Fund", href: "/dashboard/loans" },
      { label: "SRL score", href: "/srl" },
    ];
  } else if (role === "BANK") {
    items = [
      { label: "Dashboard", href: "/admin/bank-dashboard" },
      { label: "List UMKM", href: "/umkm-list" },
    ];
  } else if (role === "SYSTEM") {
    items = [
      { label: "System Dashboard", href: "/admin/system-dashboard" },
      { label: "Manage Admins", href: "/admin/list-admins" },
    ];
  }

  const isAdmin = role === "BANK" || role === "SYSTEM";

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex space-x-4">
        <span className="font-bold">Welcome{session ? `, ${session.user.name}` : ""}</span>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1 rounded hover:bg-blue-500 ${
              pathname === item.href ? "bg-blue-500" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-3 py-1 border border-white rounded hover:bg-blue-500"
            >
              Sign Out
            </button>
            <Link href={isAdmin ? "/admin/profile" : "/profile"}>
              <CgProfile size={30} />
            </Link>
          </>
        ) : (
          <Link href="/login" className="px-3 py-1 border border-white rounded hover:bg-blue-500">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
