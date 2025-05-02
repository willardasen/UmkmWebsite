"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UMKMRequest {
  id: string;
  nama: string;
  jumlahPinjaman: number;
  noRekening: string;
  status: string;
}

export default function UMKMRequestListPage() {
  const [requests, setRequests] = useState<UMKMRequest[]>([]);

  useEffect(() => {
    async function fetchLoans() {
      try {
        const res = await fetch("/api/loan/all");
        const data = await res.json();

        const mappedRequests = data.map((loan: any) => ({
          id: loan.id,
          nama: loan.umkm?.name || "Nama tidak tersedia",
          jumlahPinjaman: loan.jumlahPinjaman,
          noRekening: loan.umkm?.noRekening || "No Rekening tidak tersedia",
          status: loan.status,
        }));

        setRequests(mappedRequests);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLoans();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Click <span className="text-blue-600">View</span> Button for Checking
        Request List
      </h1>

      <div className="space-y-4">
        {requests.map((req, index) => (
          <div
            key={req.id}
            className="flex items-center justify-between bg-blue-200 p-4 rounded-lg shadow-md"
          >
            <div>
              <p className="font-bold">{req.nama}</p>
              <p className="text-sm">
                Jumlah Pinjaman: Rp {req.jumlahPinjaman.toLocaleString()}
              </p>
              <p className="text-sm">No Rekening: {req.noRekening}</p>
              <p className="text-sm">
                Status: <span className="text-white">{req.status}</span>
              </p>
            </div>

            <button 
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center gap-2 min-w-[100px]"
            >
              <Link
                href={`/approve-loan/${req.id}`}
                className="btn btn-primary rounded-full"
              >
                View
              </Link>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
