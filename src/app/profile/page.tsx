

// File: src/app/profile/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../prisma/client";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = session.user;

  const userData = await prisma.uMKMUser.findUnique({
    where: { id },
    select: {
      name: true,
      email: true,
      noTelepon: true,
      role: true,
      umkm: {
        select: {
          id: true,
          name: true,
          alamat: true,
          rt_rw: true,
          desa_kel: true,
          kecamatan: true,
          kabupaten: true,
          provinsi: true,
          tahunBerdiri: true,
          usahaUtama: true,
          produkUtama: true,
          badanHukum: true,
          jumlahKaryawan: true,
          sistemPenjualan: true,
          persaingan: true,
          totalAset: true,
          penjualanPerTahun: true,
          proyeksiPenjualan: true,
          nilaiAsetJaminan: true,
          jumlahDokumenKredit: true,
          description: true,
          noRekening: true,
          noBIP: true,
          noNPWP: true,
        },
      },
    },
  });

  if (!userData) return <p className="p-6">User not found.</p>;

  return <ProfileClient data={userData} />;
}

