import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "../../../../../prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SYSTEM") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { email, password, name } = await req.json();
  if (!email || !password || !name) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Email ini sudah terdaftar" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { email, password: hashed, name, role: "BANK" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Error registering admin bank", error: err.message },
      { status: 500 }
    );
  }
}
