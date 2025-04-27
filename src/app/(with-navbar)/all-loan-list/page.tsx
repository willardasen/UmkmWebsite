"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UMKMRequest {
  id: string;
  nama: string;
  jumlahPinjaman: number;
  noRekening: string;
}

export default function UMKMRequestListPage() {
  const [requests, setRequests] = useState<UMKMRequest[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Ganti ini nanti fetch dari API kamu
    const dummyData: UMKMRequest[] = [
      { id: "1", nama: "UMKM No. 1", jumlahPinjaman: 5000000, noRekening: "1234567890" },
      { id: "2", nama: "UMKM No. 2", jumlahPinjaman: 10000000, noRekening: "9876543210" },
      { id: "3", nama: "UMKM No. 3", jumlahPinjaman: 7500000, noRekening: "9876541230" },
    ];
    setRequests(dummyData);
  }, []);

  const handleView = (id: string) => {
    router.push(`/(with-navbar)/umkm/${id}`);
  };

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <span className="font-bold text-lg">Welcome, Admin Bank</span>
          <div className="flex space-x-6">
            <button className="hover:underline">List UMKM</button>
            <button className="hover:underline">Request List</button>
            <div className="w-8 h-8 bg-white rounded-full" />
          </div>
        </div>

        <div className="bg-green-100 px-6 py-8 rounded-b-lg shadow-md">
          <h2 className="text-center text-lg font-bold mb-8">
            Click <span className="text-blue-600">View</span> Button for Checking Request List
          </h2>

          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between bg-blue-400 rounded-md px-6 py-4 text-white"
              >
                <div>
                  <p className="font-semibold">{req.nama}</p>
                  <p className="text-sm">Jumlah Pinjaman: Rp {req.jumlahPinjaman.toLocaleString("id-ID")}</p>
                  <p className="text-sm">No Rekening: {req.noRekening}</p>
                </div>
                <button
                  onClick={() => handleView(req.id)}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-md"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
