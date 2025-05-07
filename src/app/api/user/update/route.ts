// src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '../../../../../prisma/client';
import bcrypt from 'bcryptjs';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'USER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, noTelepon, password } = body;

  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
  }

  const dataToUpdate: any = { name, email, noTelepon };

  if (password && password.trim() !== '') {
    const hashed = await bcrypt.hash(password, 10);
    dataToUpdate.password = hashed;
  }

  try {
    const updated = await prisma.uMKMUser.update({
      where: { id: session.user.id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, noTelepon: true, role: true }
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
  }
}
