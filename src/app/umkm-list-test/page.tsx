"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UMKM {
  id: string;
  name: string;
  ownerName: string;
  category: string;
  description: string;
}

export default function UMKMList() {
  const [umkms, setUMKMs] = useState<UMKM[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch UMKM data from API
    const fetchUMKMs = async () => {
      try {
        // Simulated data for now
        const mockData: UMKM[] = [
          {
            id: "1",
            name: "Batik Jaya",
            ownerName: "John Doe",
            category: "Fashion",
            description: "Traditional batik clothing manufacturer",
          },
          {
            id: "2",
            name: "Kerajinan Bambu",
            ownerName: "Jane Smith",
            category: "Craft",
            description: "Handmade bamboo crafts and furniture",
          },
        ];
        setUMKMs(mockData);
      } catch (error) {
        console.error("Error fetching UMKM data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUMKMs();
  }, []);

  const filteredUMKMs = umkms.filter((umkm) =>
    umkm.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">UMKM List</h1>
        <Link href="/umkm/new" className="btn btn-primary">
          Register New UMKM
        </Link>
      </div>

      <div className="form-control">
        <input
          type="text"
          placeholder="Search by category..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUMKMs.map((umkm) => (
          <div key={umkm.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{umkm.name}</h2>
              <p className="text-sm text-gray-500">Owner: {umkm.ownerName}</p>
              <p className="text-sm text-gray-500">Category: {umkm.category}</p>
              <p>{umkm.description}</p>
              <div className="card-actions justify-end">
                <Link href={`/umkm/${umkm.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 