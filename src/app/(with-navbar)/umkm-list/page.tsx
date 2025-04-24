// src/app/(with-navbar)/umkm-list/page.tsx
import Link from "next/link";
import { prisma } from "../../../../prisma/client";

export default async function UmkmListPage() {
  const umkms = await prisma.uMKM.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      user: { select: { name: true } },
      usahaUtama: true,
      produkUtama: true,
      totalAset: true,
      penjualanPerTahun: true,
      jumlahKaryawan: true,
      tahunBerdiri: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Daftar UMKM</h1>
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
            {umkms.map((u, i) => (
              <tr
                key={u.id}
                className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/umkm/${u.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {u.name} / {u.user.name}
                  </Link>
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
