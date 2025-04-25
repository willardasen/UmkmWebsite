import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
  // 1️⃣ Only USERs can create their UMKM
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "USER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2️⃣ Parse body
  const {
    name,
    alamat,
    rt_rw,
    desa_kel,
    kecamatan,
    kabupaten,
    provinsi,
    tahunBerdiri,
    usahaUtama,
    produkUtama,
    badanHukum,
    jumlahKaryawan,
    sistemPenjualan,
    persaingan,
    totalAset,
    penjualanPerTahun,
    proyeksiPenjualan,
    nilaiAsetJaminan,
    jumlahDokumenKredit,
    description,
    noRekening,
    noNPWP,
    noBIP,
  } = await req.json();

  // 3️⃣ Basic validation
  if (
    !name ||
    !alamat ||
    tahunBerdiri == null ||
    jumlahKaryawan == null
  ) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // 4️⃣ Create UMKM
    const newUmkm = await prisma.uMKM.create({
      data: {
        name,
        alamat,
        rt_rw,
        desa_kel,
        kecamatan,
        kabupaten,
        provinsi,
        tahunBerdiri:     Number(tahunBerdiri),
        usahaUtama,
        produkUtama,
        badanHukum,
        jumlahKaryawan:   Number(jumlahKaryawan),
        sistemPenjualan,
        persaingan,
        totalAset:        parseFloat(totalAset),
        penjualanPerTahun: parseFloat(penjualanPerTahun),
        proyeksiPenjualan: parseFloat(proyeksiPenjualan),
        nilaiAsetJaminan:  parseFloat(nilaiAsetJaminan),
        jumlahDokumenKredit: parseFloat(jumlahDokumenKredit),
        description,
        noRekening,
        noNPWP,
        noBIP,
        user: { connect: { id: session.user.id } },
      },
    });
    console.log("SESSION", session.user);

    return NextResponse.json(newUmkm, { status: 201 });
    
  } catch (err: any) {
    console.error("UMKM CREATE ERROR", err);
    return NextResponse.json(
      { message: "Failed to create UMKM", error: err.message },
      { status: 500 }
    );
  }
}
