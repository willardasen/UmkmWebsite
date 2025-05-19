// src/app/api/umkm/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../prisma/client";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  try {
    const umkm = await prisma.uMKM.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!umkm) {
      return NextResponse.json({ error: "UMKM not found" }, { status: 404 });
    }

    return NextResponse.json(umkm);
  } catch (error) {
    console.error("Failed to fetch UMKM detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "USER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Hanya owner yang boleh update
  const existing = await prisma.uMKM.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();
  try {
    const updated = await prisma.uMKM.update({
      where: { id: params.id },
      data: {
        name: data.name,
        alamat: data.alamat,
        rt_rw: data.rt_rw,
        desa_kel: data.desa_kel,
        kecamatan: data.kecamatan,
        kabupaten: data.kabupaten,
        provinsi: data.provinsi,
        tahunBerdiri: Number(data.tahunBerdiri),
        usahaUtama: data.usahaUtama,
        produkUtama: data.produkUtama,
        badanHukum: data.badanHukum,
        jumlahKaryawan: Number(data.jumlahKaryawan),
        sistemPenjualan: data.sistemPenjualan,
        persaingan: data.persaingan,
        totalAset: parseFloat(data.totalAset),
        penjualanPerTahun: parseFloat(data.penjualanPerTahun),
        proyeksiPenjualan: parseFloat(data.proyeksiPenjualan),
        nilaiAsetJaminan: parseFloat(data.nilaiAsetJaminan),
        jumlahDokumenKredit: parseFloat(data.jumlahDokumenKredit),
        description: data.description,
        noRekening: data.noRekening,
        noNPWP: data.noNPWP,
        noNIB: data.noNIB,
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "USER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.uMKM.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.uMKM.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "UMKM deleted" });
}
