import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "USER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { jumlahPinjaman, tujuan } = await req.json();
  if (jumlahPinjaman == null || !tujuan) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  // Cari UMKM milik user
  const umkm = await prisma.uMKM.findUnique({
    where: { userId: session.user.id },
  });
  if (!umkm) {
    return NextResponse.json({ message: "UMKM profile not found" }, { status: 404 });
  }

  const loan = await prisma.loanApplication.create({
    data: {
      jumlahPinjaman: Number(jumlahPinjaman),
      tujuan,
      umkm: { connect: { id: umkm.id } },
      status: "PENDING",
    },
  });
  return NextResponse.json(loan, { status: 201 });
}

