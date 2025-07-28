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
      status: "APPROVED",
    },
    include: {
      umkm: true, 
    },
  });

  return NextResponse.json(loans);
}
