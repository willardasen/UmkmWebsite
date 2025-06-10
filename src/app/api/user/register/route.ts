// src/app/api/user/register/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "../../../../../prisma/client"

export async function POST(req: NextRequest) {
  const { name, email, password, confirmPassword, phone } = await req.json()

  // if (!name || !email || !password || !confirmPassword || !phone) {
  //   return NextResponse.json({ message: "Field kosong" }, { status: 400 })
  // }
  // if (password !== confirmPassword) {
  //   return NextResponse.json({ message: "Password tidak sama" }, { status: 400 })
  // }

  const exists = await prisma.uMKMUser.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json({ message: "Email ini sudah terdaftar" }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.uMKMUser.create({
    data: { name, email, password: hashed, noTelepon: phone },
    select: { id: true, email: true, name: true, role: true, noTelepon: true },
  })

  return NextResponse.json(user, { status: 201 })
}
