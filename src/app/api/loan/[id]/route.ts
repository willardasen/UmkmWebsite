import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../prisma/client";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const role = session?.user.role;
  if (!session || (role !== "BANK" && role !== "SYSTEM" && role !== "USER")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const loan = await prisma.loanApplication.findUnique({
    where: { id: params.id },
    include: { umkm: true },
  });
  if (!loan) return NextResponse.json({ message: "Not found" }, { status: 404 });

  // Jika user, pastikan dia owner UMKM ini
  if (role === "USER" && loan.umkm.userId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(loan);
}
