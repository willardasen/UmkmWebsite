// src/app/api/admin/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '../../../../../prisma/client';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest) {
  // 1. Authenticate
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'BANK' && session.user.role !== 'SYSTEM')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse body
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, password } = body;

  
  if (!name || !email) {
    return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
  }
  // Tambahan bcrypt jika password diisi
  let updateData: any = { name, email };

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    updateData.password = hashed;
  }

  try {
    // 4. Update in DB
    const updated = await prisma.admin.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: 'Error updating admin profile' }, { status: 500 });
  }
}
