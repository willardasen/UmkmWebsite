// src/app/api/umkm/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../../prisma/client";

// const ANY_ROLE = ["USER","BANK","SYSTEM"] as const;

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // const session = await getServerSession(authOptions);
  const { id } = await context.params;
  // if (!session || !ANY_ROLE.includes(session.user.role as any)) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  const umkm = await prisma.uMKM.findUnique({ where: { userId: id } });
  if (!umkm) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(umkm);
}