// src/app/api/umkm/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../prisma/client";

const ANY_ROLE = ["USER","BANK","SYSTEM"] as const;

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !ANY_ROLE.includes(session.user.role as any)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const umkm = await prisma.uMKM.findUnique({ where: { userId: params.id } });
  if (!umkm) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(umkm);
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
        noBIP: data.noBIP,
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
