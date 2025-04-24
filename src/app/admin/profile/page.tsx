// src/app/(with-navbar)/admin/profile/page.tsx
"use client"; // to allow JSX interactivity if needed later

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../prisma/client";

export default async function AdminProfilePage() {
  // 1️⃣ Ambil session
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id, role } = session.user;

  // 2️⃣ Hanya ADMIN yang mengakses
  if (role !== "BANK" && role !== "SYSTEM") {
    redirect("/");
  }

  // 3️⃣ Ambil data admin dari DB
  const adminData = await prisma.admin.findUnique({
    where: { id },
    select: {
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });

  if (!adminData) {
    return <p className="p-6 text-center">Admin not found.</p>;
  }

  // 4️⃣ Render UI (sama seperti Profile user)
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <section className="bg-white p-6 shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Admin Profile</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-700">Name</label>
            <input
              type="text"
              value={adminData.name}
              disabled
              className="mt-1 p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Email</label>
            <input
              type="email"
              value={adminData.email}
              disabled
              className="mt-1 p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Role</label>
            <input
              type="text"
              value={adminData.role}
              disabled
              className="mt-1 p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Joined At</label>
            <input
              type="text"
              value={new Date(adminData.createdAt).toLocaleDateString()}
              disabled
              className="mt-1 p-2 border rounded bg-gray-100"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
