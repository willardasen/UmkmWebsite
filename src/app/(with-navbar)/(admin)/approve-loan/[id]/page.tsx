"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function LoanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loan, setLoan] = useState<any>(null);
  const [srlScore, setSrlScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [mlResult, setMlResult] = useState<{
    status: string;
  } | null>(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loanRes = await fetch(`/api/loan/${params.id}`);
        if (!loanRes.ok) throw new Error("Gagal fetch loan");

        const loanData = await loanRes.json();
        setLoan(loanData);

        const srlRes = await fetch(`/api/srl/${loanData.umkmId}`);
        if (srlRes.ok) {
          const srlData = await srlRes.json();
          setSrlScore(srlData.score ?? null);
        } else {
          setSrlScore(null);
        }
      } catch (err) {
        console.error(err);
        setLoan(null);
        setSrlScore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    const handleEvaluate = async () => {
      try {
        setPredicting(true);
        const res = await fetch(`/api/loan/${params.id}/predict`, {
          method: "POST",
        });
        const data = await res.json();
        setMlResult(data);
      } catch (err) {
        console.error("Prediction failed:", err);
        setMlResult(null);
      } finally {
        setPredicting(false);
      }
    };

    if (loan) {
      handleEvaluate();
    }
  }, [loan]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!loan)
    return <p className="p-6 text-center text-red-500">Loan not found.</p>;

  const handleDecision = async (decision: "accept" | "reject") => {
    try {
      const res = await fetch(`/api/loan/${loan.id}/${decision}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Failed to update loan status");
      }

      router.push("/all-loan-list-pending");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memproses permintaan.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold text-center mb-4">
        Click <span className="text-green-600">Accept Request</span> to Menerima
        OR <span className="text-red-600">Reject Request</span> to Menolak
      </h1>

      {predicting ? (
        <div className="mt-2 p-2 bg-yellow-100 text-sm rounded">
          <p>Evaluating with AI...</p>
        </div>
      ) : mlResult ? (
        <div
          className={`mt-2 p-2 text-sm rounded ${
            mlResult.status === "APPROVED"
              ? "bg-green-100 text-green-800"
              : mlResult.status === "REJECTED"
              ? "bg-red-100 text-red-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          <p>
            <strong>Hasil Prediksi:</strong> {mlResult.status}
          </p>
        </div>
      ) : null}

      <div className="space-y-4 mt-4">
        <div className="bg-blue-200 p-4 rounded-md">
          <p>
            <strong>Nama UMKM:</strong> {loan.umkm?.name}
          </p>
        </div>
        <div className="bg-blue-200 p-4 rounded-md">
          <p>
            <strong>UMKM Id (ID):</strong> {loan.umkm?.id}
          </p>
        </div>
        <div className="bg-blue-200 p-4 rounded-md">
          <p>
            <strong>Jumlah Permintaan:</strong> Rp{" "}
            {loan.jumlahPinjaman.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-blue-200 p-4 rounded-md">
          <p>
            <strong>Nomor Rekening:</strong> {loan.umkm?.noRekening}
          </p>
        </div>
        <div className="bg-blue-200 p-4 rounded-md">
          <p>
            <strong>Tujuan:</strong> {loan.tujuan}
          </p>
        </div>

        {srlScore !== null && (
          <div className="bg-green-200 p-4 rounded-md">
            <p>
              <strong>SRL Score:</strong> {srlScore}
            </p>
          </div>
        )}

        <div className="bg-blue-100 p-4 rounded-md space-y-2">
          <p>
            <strong>Alamat:</strong> {loan.umkm?.alamat}
          </p>
          <p>
            <strong>RT/RW:</strong> {loan.umkm?.rt_rw}
          </p>
          <p>
            <strong>Desa/Kelurahan:</strong> {loan.umkm?.desa_kel}
          </p>
          <p>
            <strong>Kecamatan:</strong> {loan.umkm?.kecamatan}
          </p>
          <p>
            <strong>Kabupaten:</strong> {loan.umkm?.kabupaten}
          </p>
          <p>
            <strong>Provinsi:</strong> {loan.umkm?.provinsi}
          </p>
          <p>
            <strong>Tahun Berdiri:</strong> {loan.umkm?.tahunBerdiri}
          </p>
          <p>
            <strong>Usaha Utama:</strong> {loan.umkm?.usahaUtama}
          </p>
          <p>
            <strong>Produk Utama:</strong> {loan.umkm?.produkUtama}
          </p>
          <p>
            <strong>Badan Hukum:</strong> {loan.umkm?.badanHukum}
          </p>
          <p>
            <strong>Jumlah Karyawan:</strong> {loan.umkm?.jumlahKaryawan}
          </p>
          <p>
            <strong>Sistem Penjualan:</strong> {loan.umkm?.sistemPenjualan}
          </p>
          <p>
            <strong>Persaingan:</strong> {loan.umkm?.persaingan}
          </p>
          <p>
            <strong>Total Aset:</strong> Rp{" "}
            {loan.umkm?.totalAset.toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Penjualan Per Tahun:</strong> Rp{" "}
            {loan.umkm?.penjualanPerTahun.toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Proyeksi Penjualan:</strong> Rp{" "}
            {loan.umkm?.proyeksiPenjualan.toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Nilai Aset Jaminan:</strong> Rp{" "}
            {loan.umkm?.nilaiAsetJaminan.toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Jumlah Dokumen Kredit:</strong>{" "}
            {loan.umkm?.jumlahDokumenKredit}
          </p>
          <p>
            <strong>Deskripsi:</strong> {loan.umkm?.description}
          </p>
          <p>
            <strong>No NPWP:</strong> {loan.umkm?.noNPWP}
          </p>
          <p>
            <strong>No NIB:</strong> {loan.umkm?.noNIB}
          </p>
        </div>

        <div className="flex justify-center gap-8 mt-6">
          <button
            onClick={() => handleDecision("accept")}
            className="bg-blue-700 text-green-400 font-bold px-6 py-2 rounded-full transition duration-300 ease-in-out hover:bg-green-500 hover:text-white hover:shadow-lg"
          >
            Accept Request
          </button>
          <button
            onClick={() => handleDecision("reject")}
            className="bg-blue-700 text-red-500 font-bold px-6 py-2 rounded-full transition duration-300 ease-in-out hover:bg-red-600 hover:text-white hover:shadow-lg"
          >
            Reject Request
          </button>
        </div>
      </div>
    </div>
  );
}
