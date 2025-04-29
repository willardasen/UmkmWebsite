import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../prisma/client";
import AdminProfileClient from "@/components/AdminProfileClient";

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id, role } = session.user;

  if (role !== "BANK" && role !== "SYSTEM") {
    redirect("/");
  }

  const adminData = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });

  if (!adminData) {
    return <p className="p-6 text-center">Admin not found.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <AdminProfileClient adminData={adminData} />
    </div>
  );
}
