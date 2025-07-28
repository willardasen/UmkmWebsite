import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/client";


export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const umkm = await prisma.uMKM.findUnique({ where: { userId: id } });
  if (!umkm) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(umkm);
}