"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SRLPage() {
  const { data: session } = useSession();
  const [umkm, setUmkm] = useState<any>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Ambil data UMKM & score SRL
  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) return;

      // Ambil data UMKM
      const resUmkm = await fetch(`/api/umkm/${session.user.id}`);
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

  // Submit form SRL
  async function handleSubmit() {
    setLoading(true);
    const res = await fetch("/api/srl/create", {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setScore(data.score); // update score setelah dihitung ulang
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-4">
        {score && (
          <div className="text-center text-xl font-bold text-green-700">
            🎉 Your SRL Score: {score}
          </div>
        )}
        <h1 className="text-center text-lg font-semibold">
          Welcome! Please Fill Out This SRL Form to Proceed!
        </h1>

        <div>
          <label>Company's Name</label>
          <input
            type="text"
            value={umkm?.name || ""}
            readOnly
            className="w-full bg-blue-300 p-2 rounded mt-1"
          />
        </div>

        <div>
          <label>Company's ID (NIB)</label>
          <input
            type="text"
            value={umkm?.noBIP || ""}
            readOnly
            className="w-full bg-blue-300 p-2 rounded mt-1"
          />
        </div>

        <div>
          <label>Years of Running</label>
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
          <label>Number of Employees</label>
          <input
            type="text"
            value={umkm?.jumlahKaryawan ?? ""}
            readOnly
            className="w-full bg-blue-300 p-2 rounded mt-1"
          />
        </div>

        <div>
          <label>Yearly Assets</label>
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
          {loading ? "Submitting..." : "Submit My SRL"}
        </button>
      </div>
    </div>
  );
}
