// src/app/profile/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../prisma/client"

export default async function ProfilePage() {
  // 1️⃣ Ambil session
  const session = await getServerSession(authOptions);
  if (!session) {
    // Jika belum login, kirim ke /login
    redirect("/login");
  }

  const { id, role } = session.user;

  // 2️⃣ Ambil data user dari database
  let userData:
    | { name: string; email: string; noTelepon?: string; createdAt: Date; role: string }
    | null = null;

  if (role === "USER") {
    userData = await prisma.uMKMUser.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        noTelepon: true,
        createdAt: true,
        role: true,
      },
    });
  } else {
    userData = await prisma.admin.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        createdAt: true,
        role: true,
      },
    });
  }

  if (!userData) {
    return <p className="p-6 text-center">User not found.</p>;
  }

  // 3️⃣ Render UI
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      <div className="space-y-3">
        <div>
          <span className="font-medium">Name:</span> {userData.name}
        </div>
        <div>
          <span className="font-medium">Email:</span> {userData.email}
        </div>
        {userData.noTelepon && (
          <div>
            <span className="font-medium">Phone:</span> {userData.noTelepon}
          </div>
        )}
        <div>
          <span className="font-medium">Role:</span> {userData.role}
        </div>
        <div>
          <span className="font-medium">Joined:</span>{" "}
          {userData.createdAt.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
