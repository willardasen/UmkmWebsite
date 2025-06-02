import { NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/client";

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  try {
    const umkm = await prisma.uMKM.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            noTelepon: true,
          },
        },
        srlAssessments: {
          select: { score: true },
        },
        loanApplications: {
          select: {
            id: true,
            jumlahPinjaman: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!umkm) {
      return NextResponse.json({ error: "UMKM tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(umkm);
  } catch (error) {
    console.error("Gagal fetch UMKM summary:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
