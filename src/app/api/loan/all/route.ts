import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = session?.user.role;

  if (!session || (role !== "BANK" && role !== "SYSTEM")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const loans = await prisma.loanApplication.findMany({
    where: {
      status: "PENDING", // Kalau mau semua loan hapus condition ini
    },
    include: {
      umkm: true, // supaya bisa ambil nama UMKM, no rekening, dll
    },
  });

  return NextResponse.json(loans);
}
