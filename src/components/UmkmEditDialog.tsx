"use client";

import { Dialog } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import React, { useState, useEffect } from "react";

import { FaSpinner } from "react-icons/fa";

interface UmkmEditDialogProps {
  initialData: Record<string, any>;
  open: boolean;
  onClose: () => void;
  onSaveSuccess: (updated: Record<string, any>) => void;
}

const defaultFields: Record<string, string> = {
  name: "",
  alamat: "",
  rt_rw: "",
  desa_kel: "",
  kecamatan: "",
  kabupaten: "",
  provinsi: "",
  tahunBerdiri: "",
  usahaUtama: "",
  produkUtama: "",
  badanHukum: "",
  jumlahKaryawan: "",
  sistemPenjualan: "",
  persaingan: "",
  totalAset: "",
  penjualanPerTahun: "",
  proyeksiPenjualan: "",
  nilaiAsetJaminan: "",
  jumlahDokumenKredit: "",
  description: "",
};

// Field enum dan opsinya
const enumFields: Record<string, string[]> = {
  badanHukum: ["CV", "PERSEORANGAN"],
  sistemPenjualan: ["RETAIL", "DISTRIBUTOR", "RETAILDANDISTRIBUTOR"],
  persaingan: ["RENDAH", "SEDANG", "TINGGI"],
  usahaUtama: ["MAKANAN", "KERAJINAN", "PAKAIAN"],
};

export default function UmkmEditDialog({
  initialData,
  open,
  onClose,
  onSaveSuccess,
}: UmkmEditDialogProps) {
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    setForm({ ...defaultFields, ...initialData });
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    const isNew = !initialData?.id;
    const url = isNew ? "/api/umkm/create" : `/api/umkm/${initialData.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const updated = await res.json();
      onSaveSuccess(updated);
      onClose();
    }
    setLoading(false);

  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-auto">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-2xl w-full relative shadow-lg">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <IoCloseSharp />
          </button>
          <Dialog.Title className="text-xl font-semibold mb-4">
            {initialData?.id ? "Edit UMKM Details" : "Buat UMKM Baru"}
          </Dialog.Title>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-auto">
            {Object.entries(form)
              .filter(([key]) => key !== "id")
              .map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>

                  {enumFields[key] ? (
                    <select
                      name={key}
                      value={val || ""}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded"
                    >
                      <option value="">-- Pilih --</option>
                      {enumFields[key].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={key}
                      type="text"
                      value={val || ""}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded"
                    />
                  )}
                </div>
              ))}
          </form>

          <div className="mt-6 flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center gap-2 min-w-[100px]"
              disabled={loading}
            >
              {loading && <FaSpinner className="animate-spin h-4 w-4" />}
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
