import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../prisma/client";

function scoreLamaUsaha(years: number): number {
  if (years <= 2) return 1;
  if (years <= 5) return 2;
  if (years <= 10) return 3;
  if (years <= 15) return 4;
  return 5;
}

function scoreKaryawan(n: number): number {
  if (n <= 5) return 1;
  if (n <= 10) return 2;
  if (n <= 15) return 3;
  if (n <= 20) return 4;
  return 5;
}

function scoreOmzet(v: number): number {
  if (v <= 50) return 1;
  if (v <= 150) return 2;
  if (v <= 300) return 3;
  if (v <= 500) return 4;
  return 5;
}

function scoreAset(v: number): number {
  if (v <= 50) return 1;
  if (v <= 150) return 2;
  if (v <= 300) return 3;
  if (v <= 500) return 4;
  return 5;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "USER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const umkm = await prisma.uMKM.findUnique({
    where: { userId: session.user.id },
  });

  if (!umkm) {
    return NextResponse.json({ message: "UMKM not found" }, { status: 404 });
  }

  const currentYear = new Date().getFullYear();
  const lamaUsaha = currentYear - umkm.tahunBerdiri;

  const totalScore =
    5 +
    scoreLamaUsaha(lamaUsaha) +
    scoreKaryawan(umkm.jumlahKaryawan) +
    scoreOmzet(umkm.penjualanPerTahun) +
    scoreAset(umkm.totalAset);

  let srl: number;
  if (totalScore === 25) srl = 9;
  else if (totalScore >= 21) srl = 8;
  else if (totalScore >= 15) srl = 7;
  else srl = 6;

  const result = await prisma.sRLAssessment.upsert({
    where: { umkmId: umkm.id },
    update: { score: srl },
    create: { umkmId: umkm.id, score: srl },
  });

  return NextResponse.json(result, { status: 201 });
}
