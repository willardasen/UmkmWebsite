"use client";

import Link from "next/link";
import { useTransition, useState } from "react";

export default function AdminBankListPage({
  adminBanks,
}: {
  adminBanks: any[];
}) {
  const [admins, setAdmins] = useState(adminBanks);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAdmins((prev) => prev.filter((a) => a.id !== id));
      }
    });
  };

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

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full bg-white shadow rounded table-fixed">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="w-1/4 p-4">Name</th>
              <th className="w-1/4 p-4">Email</th>
              <th className="w-1/4 p-4">Tanggal dibuat</th>
              <th className="w-1/4 p-4 text-center">Hapus Admin</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t">
                <td className="w-1/4 p-4">{admin.name}</td>
                <td className="w-1/4 p-4">{admin.email}</td>
                <td className="w-1/4 p-4">
                  {new Date(admin.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="w-1/4 p-4 text-center">
                  <button
                    className="text-red-600 font-bold hover:text-red-800"
                    onClick={() => handleDelete(admin.id)}
                    disabled={isPending}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
