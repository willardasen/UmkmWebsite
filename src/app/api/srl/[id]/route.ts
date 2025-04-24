import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '../../../../../prisma/client';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !["USER","BANK","SYSTEM"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const srl = await prisma.sRLAssessment.findUnique({
    where: { umkmId: params.id }, // find by umkmId
    include: { umkm: true },
  });
  if (!srl) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(srl);
}
