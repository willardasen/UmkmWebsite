import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "USER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Semua pinjaman milik UMKM user
  const loans = await prisma.loanApplication.findMany({
    where: { umkm: { userId: session.user.id } },
    include: { umkm: true },
  });
  return NextResponse.json(loans);
}
