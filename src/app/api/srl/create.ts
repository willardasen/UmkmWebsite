// File: /pages/api/srl/create.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../../prisma/client';
import { requireRole } from "../utils/authMiddleware";

// Fungsi sample untuk menghitung skor.
// Silakan sesuaikan logika scoring-nya sesuai gambar scoring yang kamu miliki.
function calculateScore(
  lamaUsahaBerjalan: number,
  jumlahKaryawan: number,
  omzetPerTahun: number,
  jumlahAset: number
): number {
  // Contoh: Skor = (lama usaha * 2) + (jumlah karyawan * 1) 
  //         + (omzetPerTahun dibagi 1.000.000 dibulatkan) 
  //         + (jumlahAset dibagi 500.000 dibulatkan)
  return (
    lamaUsahaBerjalan * 2 +
    jumlahKaryawan +
    Math.floor(omzetPerTahun / 1000000) +
    Math.floor(jumlahAset / 500000)
  );
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Pastikan menerima semua field yang diperlukan
  const { lamaUsahaBerjalan, jumlahKaryawan, omzetPerTahun, jumlahAset } =
    req.body;

  if (
    lamaUsahaBerjalan == null ||
    jumlahKaryawan == null ||
    omzetPerTahun == null ||
    jumlahAset == null
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Hitung skor berdasarkan input
    const score = calculateScore(
      Number(lamaUsahaBerjalan),
      Number(jumlahKaryawan),
      Number(omzetPerTahun),
      Number(jumlahAset)
    );

    // Ambil user id dari middleware, misalnya req.body.user sudah di-set oleh requireRole
    const userId = req.body.user.id;

    // Buat SRLAssessment baru di database
    const srl = await prisma.sRLAssessment.create({
      data: {
        userId,
        lamaUsahaBerjalan: Number(lamaUsahaBerjalan),
        jumlahKaryawan: Number(jumlahKaryawan),
        omzetPerTahun: Number(omzetPerTahun),
        jumlahAset: Number(jumlahAset),
        score,
      },
    });

    return res.status(201).json(srl);
  } catch (error) {
    return res.status(500).json({ message: "Error creating SRL assessment", error });
  }
};

// Hanya user dengan role "USER" yang dapat membuat SRLAssessment
export default requireRole(["USER"], handler);
