import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "../../../../../prisma/client"

export async function POST(req: NextRequest) {
  const { name, email, password, confirmPassword, phone } = await req.json()

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
