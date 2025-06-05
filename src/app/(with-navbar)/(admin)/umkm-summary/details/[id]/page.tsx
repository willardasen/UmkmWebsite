"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UmkmDetailPage() {
  const params = useParams();
  const [umkm, setUmkm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUmkm = async () => {
      try {
        const res = await fetch(`/api/umkm/summary/${params.id}`);
        if (!res.ok) throw new Error("UMKM tidak ditemukan");
        const data = await res.json();
        setUmkm(data);
      } catch (error) {
        console.error("Gagal fetch UMKM:", error);
        setUmkm(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUmkm();
  }, [params.id]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!umkm)
    return <p className="p-6 text-red-500 text-center">UMKM not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-semibold mb-2">Profil UMKM</h1>
      <p className="mb-6 text-gray-700">
        Profil usaha mikro, kecil, dan menengah yang potensial dibiayai oleh
        bank
      </p>

      <dl className="space-y-4">
        <div>
          <dt className="font-medium text-gray-600">Nama Perusahaan</dt>
          <dd className="text-lg">{umkm.name}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Nama Pengusaha</dt>
          <dd className="text-lg">{umkm.user?.name}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Contact Person</dt>
          <dd className="text-lg">{umkm.user?.name}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Nomor Telepon</dt>
          <dd className="text-lg">{umkm.user?.noTelepon || "-"}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Email</dt>
          <dd className="text-lg">{umkm.user?.email || "-"}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Alamat</dt>
          <dd className="text-lg">{umkm.alamat}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Usaha Utama</dt>
          <dd className="text-lg">{umkm.usahaUtama}</dd>
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
            Penjualan per Tahun (Rp. Juta)
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
        <div>
          <dt className="font-medium text-gray-600">Skor SRL</dt>
          <dd className="text-lg">{umkm.srlAssessments?.score ?? "-"}</dd>
        </div>
      </dl>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Daftar Peminjaman</h2>
        {umkm.loanApplications?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 table-fixed">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 w-10">No</th>
                  <th className="px-4 py-2 w-32">Jumlah Pinjaman</th>
                  <th className="px-4 py-2 w-40">Tujuan</th>
                  <th className="px-4 py-2 w-32">Status</th>
                  <th className="px-4 py-2 w-40">Tanggal Peminjaman</th>
                  <th className="px-4 py-2 w-40">Tanggal Keputusan</th>
                </tr>
              </thead>
              <tbody>
                {umkm.loanApplications.map((loan: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2 text-center">{i + 1}</td>
                    <td className="px-4 py-2 text-center">
                      {loan.jumlahPinjaman.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {loan.tujuan || "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-3 py-1 rounded-full font-medium text-sm ${
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
                    <td className="px-4 py-2 text-center">
                      {new Date(loan.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {loan.tanggalKeputusan
                        ? new Date(loan.tanggalKeputusan).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Belum ada data peminjaman.</p>
        )}
      </div>
    </div>
  );
}
