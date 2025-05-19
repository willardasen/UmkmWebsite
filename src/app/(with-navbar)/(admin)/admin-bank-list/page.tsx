import Link from "next/link";
import { prisma } from "../../../../../prisma/client";

export default async function AdminBankListPage() {
  const adminBanks = await prisma.admin.findMany({
    where: { role: "BANK" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Admin Bank List</h2>
        <Link href="/admin-bank-list/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Tambahkan Admin
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto shadow rounded bg-white">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Tanggal dibuat</th>
            </tr>
          </thead>
          <tbody>
            {adminBanks.map((admin) => (
              <tr key={admin.id} className="border-t">
                <td className="p-4">{admin.name}</td>
                <td className="p-4">{admin.email}</td>
                <td className="p-4">{new Date(admin.createdAt).toLocaleDateString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
