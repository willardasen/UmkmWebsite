
// src/app/(with-navbar)/umkm/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "../../../../../prisma/client";

export default async function UmkmDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const umkm = await prisma.uMKM.findUnique({
    where: { id: params.id },
    include: { user: true },
  });
  if (!umkm) return notFound();

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-semibold mb-2">Profil UMKM</h1>
      <p className="mb-6 text-gray-700">
        Profil usaha mikro, kecil, dan menengah yang potensial dibiayai oleh bank
      </p>

      <dl className="space-y-4">
        <div>
          <dt className="font-medium text-gray-600">Nama Perusahaan</dt>
          <dd className="text-lg">{umkm.name}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">Nama Pengusaha</dt>
          <dd className="text-lg">{umkm.user.name}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">Contact Person</dt>
          <dd className="text-lg">{umkm.user.name}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">Nomor Telepon</dt>
          <dd className="text-lg">{umkm.user.noTelepon || "-"}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">Email</dt>
          <dd className="text-lg">{umkm.user.email || "-"}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">Alamat</dt>
          <dd className="text-lg">{umkm.alamat}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">Produk Utama</dt>
          <dd className="text-lg">{umkm.produkUtama}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">Total Aset (Rp. Juta)</dt>
          <dd className="text-lg">{umkm.totalAset}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">
            Penjualan Rata-rata per Tahun (Rp. Juta)
          </dt>
          <dd className="text-lg">{umkm.penjualanPerTahun}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">Jumlah Tenaga Kerja</dt>
          <dd className="text-lg">{umkm.jumlahKaryawan}</dd>
        </div>

        <div>
          <dt className="font-medium text-gray-600">Tahun Berdiri</dt>
          <dd className="text-lg">{umkm.tahunBerdiri}</dd>
        </div>
      </dl>
    </div>
  );
}
