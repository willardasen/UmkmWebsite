import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    // Cari user berdasarkan email
    const user = await prisma.uMKMUser.findUnique({ where: { email } });

    // Cek apakah user ada dan password cocok
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Buat JWT
    const token = jwt.sign(
      { id: user.id, role: "USER" },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error logging in",
        error: err instanceof Error ? err.message : err,
      },
      { status: 500 }
    );
  }
}
