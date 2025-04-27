"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Umkm = {
  id: string;
  name: string;
  user: { name: string };
  usahaUtama: string;
  produkUtama: string;
  totalAset: number;
  penjualanPerTahun: number;
  jumlahKaryawan: number;
  tahunBerdiri: number;
};

export default function UmkmListPage() {
  const [umkms, setUmkms] = useState<Umkm[]>([]);
  const [filtered, setFiltered] = useState<Umkm[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/umkm/all");
      const data = await res.json();
      setUmkms(data);
      setFiltered(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...umkms];

    // Filter by search text
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.user.name.toLowerCase().includes(q) ||
          u.usahaUtama.toLowerCase().includes(q) ||
          u.produkUtama.toLowerCase().includes(q)
      );
    }

    // Filter by tahun berdiri
    if (filterYear) {
      data = data.filter((u) => u.tahunBerdiri === filterYear);
    }

    // Sort
    data.sort((a, b) =>
      sort === "asc"
        ? a.tahunBerdiri - b.tahunBerdiri
        : b.tahunBerdiri - a.tahunBerdiri
    );

    setFiltered(data);
  }, [search, sort, filterYear, umkms]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Daftar UMKM</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Cari UMKM..."
          className="flex-1 p-2 border border-gray-300 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value as "asc" | "desc")}
        >
          <option value="desc">⬇️ Tahun Paling Baru</option>
          <option value="asc">⬆️ Tahun Paling Lama</option>
        </select>
        <input
          type="number"
          placeholder="🎯 Filter Tahun"
          className="p-2 border border-gray-300 rounded w-36"
          value={filterYear ?? ""}
          onChange={(e) => setFilterYear(e.target.value ? +e.target.value : null)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">No.</th>
              <th className="px-4 py-2 text-left">Nama Perusahaan / Pengusaha</th>
              <th className="px-4 py-2 text-left">Produk Utama</th>
              <th className="px-4 py-2 text-left">Usaha Utama</th>
              <th className="px-4 py-2 text-right">Total Aset (Rp. Juta)</th>
              <th className="px-4 py-2 text-right">Penj. per Thn (Rp. Juta)</th>
              <th className="px-4 py-2 text-right">Jml. Tenaga Kerja</th>
              <th className="px-4 py-2 text-right">Tahun Berdiri</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-2">{i + 1}</td>
                <td
                  className="px-4 py-2 text-blue-600 hover:underline cursor-pointer"
                  onClick={() => router.push(`/umkm/${u.id}`)}
                >
                  {u.name} / {u.user.name}
                </td>
                <td className="px-4 py-2">{u.produkUtama}</td>
                <td className="px-4 py-2">{u.usahaUtama}</td>
                <td className="px-4 py-2 text-right">{u.totalAset}</td>
                <td className="px-4 py-2 text-right">{u.penjualanPerTahun}</td>
                <td className="px-4 py-2 text-right">{u.jumlahKaryawan}</td>
                <td className="px-4 py-2 text-right">{u.tahunBerdiri}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
