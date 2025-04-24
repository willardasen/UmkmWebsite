'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { IoCloseSharp } from "react-icons/io5";


export interface UMKMListItem {
  id: string;
  name: string;
  produkUtama: string;
  totalAset: number;
  penjualanPerTahun: number;
  jumlahKaryawan: number;
  tahunBerdiri: number;
  user: { name: string };
}

export interface UMKMDetail extends UMKMListItem {
  alamat: string;
  user: { name: string; email: string; noTelepon: string };
}

export default function UmkmListClient({ umkms }: { umkms: UMKMListItem[] }) {
  const [selected, setSelected] = useState<UMKMDetail | null>(null);

  const handleSelect = async (id: string) => {
    // fetch full detail from API
    const res = await fetch(`/api/umkm/${id}`);
    if (res.ok) {
      const data: UMKMDetail = await res.json();
      setSelected(data);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Daftar UMKM</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">No.</th>
              <th className="px-4 py-2 text-left">Nama / Pengusaha</th>
              <th className="px-4 py-2 text-left">Produk Utama</th>
              <th className="px-4 py-2 text-right">Total Aset</th>
              <th className="px-4 py-2 text-right">Penjualan/Thn</th>
              <th className="px-4 py-2 text-right">Karyawan</th>
              <th className="px-4 py-2 text-right">Tahun Berdiri</th>
            </tr>
          </thead>
          <tbody>
            {umkms.map((u, i) => (
              <tr
                key={u.id}
                className={`cursor-pointer ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                onClick={() => handleSelect(u.id)}
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{u.name} / {u.user.name}</td>
                <td className="px-4 py-2">{u.produkUtama}</td>
                <td className="px-4 py-2 text-right">{u.totalAset}</td>
                <td className="px-4 py-2 text-right">{u.penjualanPerTahun}</td>
                <td className="px-4 py-2 text-right">{u.jumlahKaryawan}</td>
                <td className="px-4 py-2 text-right">{u.tahunBerdiri}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onClose={() => setSelected(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelected(null)}
            >
              <IoCloseSharp />
            </button>
            {selected && (
              <>
                <h2 className="text-2xl font-semibold mb-2">Profil UMKM</h2>
                <p className="mb-4 text-gray-600">Detail usaha mikro, kecil, dan menengah</p>
                <dl className="space-y-3">
                  <div>
                    <dt className="font-medium">Nama Perusahaan</dt>
                    <dd>{selected.name}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Pengusaha</dt>
                    <dd>{selected.user.name}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Email</dt>
                    <dd>{selected.user.email}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Telepon</dt>
                    <dd>{selected.user.noTelepon || '-'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Alamat</dt>
                    <dd>{selected.alamat}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Produk Utama</dt>
                    <dd>{selected.produkUtama}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Total Aset</dt>
                    <dd>{selected.totalAset} juta</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Penjualan/Thn</dt>
                    <dd>{selected.penjualanPerTahun} juta</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Jumlah Karyawan</dt>
                    <dd>{selected.jumlahKaryawan}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Tahun Berdiri</dt>
                    <dd>{selected.tahunBerdiri}</dd>
                  </div>
                </dl>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
