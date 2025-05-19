// File: src/components/ProfileClient.tsx
"use client";

import React, { useState } from "react";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import UmkmEditDialog from "@/components/UmkmEditDialog";

export interface ProfileData {
  name: string;
  email: string;
  noTelepon: string;
  role: string;
  umkm?: Record<string, any> | null;
}

export default function ProfileClient({ data }: { data: ProfileData }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [openUmkm, setOpenUmkm] = useState(false);

  const [profileData, setProfileData] = useState(data);
  const [umkmData, setUmkmData] = useState(data.umkm || {});

  const umkmFields = [
    "name",
    "alamat",
    "rt_rw",
    "desa_kel",
    "kecamatan",
    "kabupaten",
    "provinsi",
    "tahunBerdiri",
    "usahaUtama",
    "produkUtama",
    "badanHukum",
    "jumlahKaryawan",
    "sistemPenjualan",
    "persaingan",
    "totalAset",
    "penjualanPerTahun",
    "proyeksiPenjualan",
    "nilaiAsetJaminan",
    "jumlahDokumenKredit",
    "description",
    "noRekening",
    "noNPWP",
    "noNIB",
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Profile Section */}
      <section className="bg-white p-6 shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile Details</h2>
          <button
            onClick={() => setOpenProfile(true)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["Name", profileData.name],
            ["Email", profileData.email],
            ["No telepon", profileData.noTelepon],
            ["Role", profileData.role],
          ].map(([label, val]) => (
            <div key={label} className="flex flex-col">
              <label className="text-gray-700">{label}</label>
              <input
                type="text"
                value={String(val)}
                disabled
                className="mt-1 p-2 border rounded bg-gray-100"
              />
            </div>
          ))}
        </div>
      </section>

      {/* UMKM Section */}
      <section className="bg-white p-6 shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">UMKM Details</h2>
          <button
            onClick={() => setOpenUmkm(true)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {umkmFields.map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-700 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                name={field}
                value={String(umkmData?.[field] ?? "")}
                disabled
                className="mt-1 p-2 border rounded bg-gray-100"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Dialogs */}
      <ProfileEditDialog
        initialData={profileData}
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        onSaveSuccess={(updated) => {
          setProfileData(updated);
          setOpenProfile(false);
        }}
      />

      <UmkmEditDialog
        initialData={umkmData}
        open={openUmkm}
        onClose={() => setOpenUmkm(false)}
        onSaveSuccess={(updated) => {
          setUmkmData(updated);
          setOpenUmkm(false);
        }}
      />
    </div>
  );
}
