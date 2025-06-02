import { prisma } from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const umkms = await prisma.uMKM.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        user: {
          select: {
            name: true,
          },
        },
        srlAssessments: {
          select: {
            score: true,
          },
        },
        loanApplications: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            jumlahPinjaman: true,
            status: true,
          },
        },
      },
    });

    const summary = umkms.map((u) => ({
      id: u.id,
      name: u.name,
      user: { name: u.user?.name ?? "-" },
      srlScore: u.srlAssessments?.score ?? null,
      latestLoan: {
        jumlahPinjaman: u.loanApplications[0]?.jumlahPinjaman ?? null,
        status: u.loanApplications[0]?.status ?? null,
      },
    }));

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
