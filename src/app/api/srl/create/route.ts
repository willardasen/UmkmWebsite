import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../prisma/client";

function scoreLamaUsaha(years: number) {
  if (years < 2) return 1;
  if (years < 5) return 2;
  if (years < 10) return 3;
  return 4;
}
function scoreKaryawan(n: number) {
  if (n <= 5) return 1;
  if (n <= 10) return 2;
  if (n <= 15) return 3;
  if (n <= 20) return 4;
  return 5;
}
function scoreOmzet(v: number) {
  if (v < 50) return 1;
  if (v < 100) return 2;
  if (v < 200) return 3;
  if (v < 300) return 4;
  if (v < 400) return 5;
  if (v < 500) return 6;
  return 7;
}
function scoreAset(v: number) {
  if (v <= 50) return 1;
  if (v <= 100) return 2;
  if (v <= 200) return 3;
  if (v <= 300) return 4;
  if (v <= 400) return 5;
  if (v <= 500) return 6;
  return 7;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "USER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Cari UMKM milik user
  const umkm = await prisma.uMKM.findUnique({
    where: { userId: session.user.id },
  });
  if (!umkm) {
    return NextResponse.json({ message: "UMKM not found" }, { status: 404 });
  }

  // Hitung tahun berjalan
  const currentYear = new Date().getFullYear();
  const lamaUsaha = currentYear - umkm.tahunBerdiri;

  // Hitung total
  const total =
    1 + // punya NIB
    scoreLamaUsaha(lamaUsaha) +
    scoreKaryawan(umkm.jumlahKaryawan) +
    scoreOmzet(umkm.penjualanPerTahun) +
    scoreAset(umkm.totalAset);

  // Konversi ke SRL
  let srl: number;
  if (total >= 24) srl = 9;
  else if (total >= 20) srl = 8;
  else if (total >= 13) srl = 7;
  else if (total >= 9) srl = 6;
  else srl = 5;

  const created = await prisma.sRLAssessment.create({
    data: { umkmId: umkm.id, score: srl },
  });
  return NextResponse.json(created, { status: 201 });
}
