import { notFound } from "next/navigation";
import Link from "next/link";

interface LoanDetail {
  id: string;
  tujuan: string;
  jumlahPinjaman: number;
  umkm: {
    id: string;
    name: string;
    noRekening: string;
    alamat: string;
    rt_rw: string;
    desa_kel: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    tahunBerdiri: number;
    usahaUtama: string;
    produkUtama: string;
    badanHukum: string;
    jumlahKaryawan: number;
    sistemPenjualan: string;
    persaingan: string;
    totalAset: number;
    penjualanPerTahun: number;
    proyeksiPenjualan: number;
    nilaiAsetJaminan: number;
    jumlahDokumenKredit: number;
    description: string;
    noNPWP: string;
    noBIP: string;
  };
}

export default async function LoanDetailPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/loan/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const loan: LoanDetail = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold text-center mb-4">
        Click <span className="text-green-600">Accept Request</span> to Accept OR <span className="text-red-600">Reject Request</span> to Reject Request
      </h1>

      <div className="space-y-4">
        <div className="bg-blue-200 p-4 rounded-md">
          <p><strong>UMKM Name:</strong> {loan.umkm.name}</p>
        </div>
        <div className="bg-blue-200 p-4 rounded-md">
          <p><strong>UMKM NIB (ID):</strong> {loan.umkm.id}</p>
        </div>
        <div className="bg-blue-200 p-4 rounded-md">
          <p><strong>Amount of Request:</strong> Rp {loan.jumlahPinjaman.toLocaleString()}</p>
        </div>
        <div className="bg-blue-200 p-4 rounded-md">
          <p><strong>Nomor Rekening:</strong> {loan.umkm.noRekening}</p>
        </div>
        <div className="bg-blue-200 p-4 rounded-md">
          <p><strong>Tujuan:</strong> {loan.tujuan}</p>
        </div>

        {/* Semua data UMKM lainnya */}
        <div className="bg-blue-100 p-4 rounded-md space-y-2">
          <p><strong>Alamat:</strong> {loan.umkm.alamat}</p>
          <p><strong>RT/RW:</strong> {loan.umkm.rt_rw}</p>
          <p><strong>Desa/Kelurahan:</strong> {loan.umkm.desa_kel}</p>
          <p><strong>Kecamatan:</strong> {loan.umkm.kecamatan}</p>
          <p><strong>Kabupaten:</strong> {loan.umkm.kabupaten}</p>
          <p><strong>Provinsi:</strong> {loan.umkm.provinsi}</p>
          <p><strong>Tahun Berdiri:</strong> {loan.umkm.tahunBerdiri}</p>
          <p><strong>Usaha Utama:</strong> {loan.umkm.usahaUtama}</p>
          <p><strong>Produk Utama:</strong> {loan.umkm.produkUtama}</p>
          <p><strong>Badan Hukum:</strong> {loan.umkm.badanHukum}</p>
          <p><strong>Jumlah Karyawan:</strong> {loan.umkm.jumlahKaryawan}</p>
          <p><strong>Sistem Penjualan:</strong> {loan.umkm.sistemPenjualan}</p>
          <p><strong>Persaingan:</strong> {loan.umkm.persaingan}</p>
          <p><strong>Total Aset:</strong> Rp {loan.umkm.totalAset.toLocaleString()}</p>
          <p><strong>Penjualan Per Tahun:</strong> Rp {loan.umkm.penjualanPerTahun.toLocaleString()}</p>
          <p><strong>Proyeksi Penjualan:</strong> Rp {loan.umkm.proyeksiPenjualan.toLocaleString()}</p>
          <p><strong>Nilai Aset Jaminan:</strong> Rp {loan.umkm.nilaiAsetJaminan.toLocaleString()}</p>
          <p><strong>Jumlah Dokumen Kredit:</strong> {loan.umkm.jumlahDokumenKredit}</p>
          <p><strong>Deskripsi:</strong> {loan.umkm.description}</p>
          <p><strong>No NPWP:</strong> {loan.umkm.noNPWP}</p>
          <p><strong>No BIP:</strong> {loan.umkm.noBIP}</p>
        </div>

        {/* Tombol Action */}
        <div className="flex justify-center gap-8 mt-6">
          <form action={`/api/loan/${params.id}/accept`} method="POST">
            <button type="submit" className="btn bg-blue-700 text-green-400 font-bold px-6 py-2 rounded-full">
              Accept Request
            </button>
          </form>
          <form action={`/api/loan/${params.id}/reject`} method="POST">
            <button type="submit" className="btn bg-blue-700 text-red-500 font-bold px-6 py-2 rounded-full">
              Reject Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
