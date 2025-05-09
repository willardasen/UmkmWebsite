"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Loan {
  id: string;
  jumlahPinjaman: number;
  tujuan: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function LoanListPage() {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch("/api/loan/status");
        const data = await res.json();
        setLoans(data);
      } catch (error) {
        console.error("Failed to fetch loans:", error);
      }
    };

    fetchLoans();
  }, []);

  

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pendaftaran peminjaman dana</h1>
        <button className="btn btn-primary">
          <Link
          href="/loan-list/loan-application"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-full font-semibold"
        >
          Tambah Peminjaman +
        </Link>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Tanggal</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Jumlah (IDR)</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Tujuan</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.length > 0 ? (
              loans.map((loan) => (
                <tr key={loan.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loan.createdAt
                      ? new Date(loan.createdAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loan.jumlahPinjaman
                      ? loan.jumlahPinjaman.toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loan.tujuan || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        loan.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : loan.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No loans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
