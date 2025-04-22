import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from '../../../../../prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { name, email, password, confirmPassword, phone } = req.body;

  // Validasi sederhana untuk memastikan semua field ada dan password sama
  if (!name || !email || !password || !confirmPassword || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Periksa apakah user dengan email tersebut sudah terdaftar
    const existing = await prisma.uMKMUser.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await prisma.uMKMUser.create({
      data: {
        name,
        email,
        password: hashedPassword,
        noTelepon: phone,
      },
    });

    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({
      message: "Error registering",
      error: err instanceof Error ? err.message : err,
    });
  }
}
