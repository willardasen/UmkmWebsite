// src/app/api/admin/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '../../../../../prisma/client';

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

  const { name, email } = body;

  // 3. Validate
  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
  }

  try {
    // 4. Update in DB
    const updated = await prisma.admin.update({
      where: { id: session.user.id },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true }
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: 'Error updating admin profile' }, { status: 500 });
  }
}
