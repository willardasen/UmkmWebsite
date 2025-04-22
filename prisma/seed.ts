import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Seed data untuk Admin (role SYSTEM dan BANK)
  const admin1 = await prisma.admin.upsert({
    where: { email: 'system.admin@example.com' },
    update: {},
    create: {
      email: 'system.admin@example.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'SYSTEM',
    },
  });

  const admin2 = await prisma.admin.upsert({
    where: { email: 'bank.admin@example.com' },
    update: {},
    create: {
      email: 'bank.admin@example.com',
      name: 'Bank Admin',
      password: hashedPassword,
      role: 'BANK',
    },
  });

  // Seed data untuk UMKMUser (role USER)
  const user1 = await prisma.uMKMUser.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      name: 'User Satu',
      password: hashedPassword,
      noTelepon: '08123456789',
      // role tidak perlu diisi karena sudah default USER
    },
  });

  const user2 = await prisma.uMKMUser.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      name: 'User Dua',
      password: hashedPassword,
      noTelepon: '08198765432',
    },
  });

  console.log('Seeded data:', { admin1, admin2, user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });