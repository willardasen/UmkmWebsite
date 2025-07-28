"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";

export default function SRLPage() {
  const { data: session } = useSession();
  const [umkm, setUmkm] = useState<any>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) return;

      // Ambil data UMKM
      const resUmkm = await fetch(`/api/srl/details/${session.user.id}`);
      if (resUmkm.ok) {
        const data = await resUmkm.json();
        setUmkm(data);

        // Setelah dapat UMKM, fetch SRL berdasarkan ID UMKM
        const resSRL = await fetch(`/api/srl/${data.id}`);
        if (resSRL.ok) {
          const srlData = await resSRL.json();
          setScore(srlData.score);
        }
      }
    }

    fetchData();
  }, [session]);

  async function handleSubmit() {
    setLoading(true);
    setShowError(null);

    if (!umkm) {
      setShowError(
        "Harap lengkapi data UMKM terlebih dahulu sebelum menghitung SRL."
      );
      setLoading(false);
      return;
    }

    const res = await fetch("/api/srl/create", {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setScore(data.score); 
      if (data.score < 7) {
        setShowError("Maaf, SRL Anda tidak eligible sehingga tidak mendapat sertifikat.");
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-4">
        <div className="border border-gray-300 px-4 py-3 rounded bg-gray-100">
          <p className="text-center text-gray-700 font-semibold mb-2">
            SRL (Startup Readiness Level) merupakan penilaian tingkat kesiapan
            bisnis.
          </p>
          <p className="text-center text-gray-700 font-semibold mb-2">
            Keterangan:
          </p>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-y-1.5 justify-center w-fit mx-auto text-sm text-gray-700">
            <div className="flex gap-1.5">
              <span>SRL 6:</span>
              <span className="font-bold text-red-600">bad</span>
            </div>
            <div className="flex gap-1.5">
              <span>SRL 8:</span>
              <span className="font-bold text-blue-600">very good</span>
            </div>
            <div className="flex gap-1.5">
              <span>SRL 7:</span>
              <span className="font-bold text-yellow-600">good</span>
            </div>
            <div className="flex gap-1.5">
              <span>SRL 9:</span>
              <span className="font-bold text-green-600">excellent</span>
            </div>
          </div>
        </div>

        {score && (
          <div className="text-center">
            <div className="text-xl font-bold mb-1">
              🎉 SRL Score Anda: {score}
            </div>
          </div>
        )}

        <h1 className="text-center text-lg font-semibold">
          Selamat datang! Isi data UMKM terlebih dahulu!
        </h1>

        <div>
          <label>Nama UMKM</label>
          <input
            type="text"
            value={umkm?.name || ""}
            readOnly
            className="w-full bg-blue-300 p-2 rounded mt-1"
          />
        </div>

        <div>
          <label>Nomor Induk Berusaha(NIB)</label>
          <input
            type="text"
            value={umkm?.noNIB || ""}
            readOnly
            className="w-full bg-blue-300 p-2 rounded mt-1"
          />
        </div>

        <div>
          <label>Lama usaha berdiri</label>
          <input
            type="text"
            value={
              umkm?.tahunBerdiri
                ? new Date().getFullYear() - umkm.tahunBerdiri
                : ""
            }
            readOnly
            className="w-full bg-blue-300 p-2 rounded mt-1"
          />
        </div>

        <div>
          <label>Jumlah karyawan</label>
          <input
            type="text"
            value={umkm?.jumlahKaryawan ?? ""}
            readOnly
            className="w-full bg-blue-300 p-2 rounded mt-1"
          />
        </div>

        <div>
          <label>Total Aset</label>
          <input
            type="text"
            value={umkm?.totalAset ?? ""}
            readOnly
            className="w-full bg-blue-300 p-2 rounded mt-1"
          />
        </div>

        <div>
          <label>Omset per tahun</label>
          <input
            type="text"
            value={umkm?.penjualanPerTahun ?? ""}
            readOnly
            className="w-full bg-blue-300 p-2 rounded mt-1"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {showError && <ErrorMessage message={showError} />}


        {score && score >= 7 && (
          <button
            onClick={() => window.open(`/api/srl/pdf/${umkm?.id}`, "_blank")}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Save as PDF
          </button>
        )}
      </div>
    </div>
  );
}
