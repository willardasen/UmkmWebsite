"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type UMKMWithLoanAndSRL = {
  id: string;
  name: string;
  user: { name: string };
  srlScore: number | null;
  latestLoan: {
    jumlahPinjaman: number;
    status: string;
  } | null;
};

export default function UmkmLoanSummaryPage() {
  const [data, setData] = useState<UMKMWithLoanAndSRL[]>([]);
  const [filtered, setFiltered] = useState<UMKMWithLoanAndSRL[]>([]);
  const [search, setSearch] = useState("");
  const [srlFilter, setSrlFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/umkm/summary");
      const json = await res.json();
      setData(json);
      setFiltered(json);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.user.name.toLowerCase().includes(q)
      );
    }
    if (srlFilter) {
      result = result.filter(
        (d) => (d.srlScore?.toString() ?? "-") === srlFilter
      );
    }
    if (statusFilter) {
      result = result.filter((d) => d.latestLoan?.status === statusFilter);
    }
    setFiltered(result);
  }, [search, srlFilter, statusFilter, data]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Ringkasan SRL & Peminjaman UMKM
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder=" Cari nama UMKM atau pemilik..."
          className="flex-1 p-2 border border-gray-300 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300 rounded"
          value={srlFilter}
          onChange={(e) => setSrlFilter(e.target.value)}
        >
          <option value=""> Semua SRL</option>
          {["6", "7", "8", "9"].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        <select
          className="p-2 border border-gray-300 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value=""> Semua Status</option>
          {["PENDING", "APPROVED", "REJECTED"].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">No.</th>
              <th className="px-4 py-2 text-left">
                Nama Perusahaan / UMKM
              </th>
              <th className="px-4 py-2 text-center">SRL</th>
              <th className="px-4 py-2 text-right">Pinjaman Terakhir (Rp)</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr
                key={item.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/umkm-summary/details/${item.id}`)}
              >
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2 text-blue-600 underline">
                  {item.name ?? "-"} / {item.user?.name ?? "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  {item.srlScore ?? "-"}
                </td>
                <td className="px-4 py-2 text-right">
                  {item.latestLoan?.jumlahPinjaman?.toLocaleString("id-ID") ??
                    "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  {item.latestLoan?.status ? (
                    <span
                      className={`px-3 py-1 rounded-full font-medium text-sm ${
                        item.latestLoan.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : item.latestLoan.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {item.latestLoan.status}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
