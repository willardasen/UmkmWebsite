import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";

export async function GET() {
  const umkms = await prisma.uMKM.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      user: { select: { name: true } },
      usahaUtama: true,
      produkUtama: true,
      totalAset: true,
      penjualanPerTahun: true,
      jumlahKaryawan: true,
      tahunBerdiri: true,
    },
  });

  return NextResponse.json(umkms);
}
