// File: app/api/loan/[id]/predict/route.ts

import { prisma } from "../../../../../../prisma/client";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const loan = await prisma.loanApplication.findUnique({
      where: { id },
      include: { umkm: true }
    });

    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    const payload = {
      'Total Aset': loan.umkm.totalAset,
      'Penjualan Rata2 per Tahun': loan.umkm.penjualanPerTahun,
      'Proyeksi Pertumbuhan Penjualan': loan.umkm.proyeksiPenjualan,
      'Kebutuhan Pembiayaan Kredit': loan.jumlahPinjaman,
      'Nilai Aset yang dapat menjadi jaminan kredit': loan.umkm.nilaiAsetJaminan,
      'Jumlah Tenaga Kerja': loan.umkm.jumlahKaryawan,
      'Jumlah Dokumen Persyaratan Kredit': loan.umkm.jumlahDokumenKredit,
      'Umur Usaha': new Date().getFullYear() - loan.umkm.tahunBerdiri,
      'Tingkat Persaingan Usaha': loan.umkm.persaingan === 'TINGGI' ? 3 : loan.umkm.persaingan === 'SEDANG' ? 2 : 1,
      'Startup Readiness Level': (
        await prisma.sRLAssessment.findUnique({ where: { umkmId: loan.umkm.id } })
      )?.score ?? 5
    };

    const flaskRes = await fetch(process.env.ML_API_URL || 'http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await flaskRes.json();

    if (!flaskRes.ok) {
      return NextResponse.json({ error: result.error || 'Prediction failed' }, { status: 500 });
    }

    await prisma.loanApplication.update({
      where: { id: loan.id },
      data: { mlDecision: result.eligible === 'APPROVED' ? 'APPROVED' : 'REJECTED' }
    });

    return NextResponse.json({
      status: result.eligible,
      cluster: result.predicted_cluster
    });

  } catch (error) {
    console.error('[LOAN_PREDICT_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
