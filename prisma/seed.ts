// File: prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminSystemEmail = 'adminsystem@example.com'
  const adminSystem = await prisma.admin.upsert({
    where: { email: adminSystemEmail },
    update: {},
    create: {
      email: adminSystemEmail,
      name: 'Admin System',
      password: await bcrypt.hash('password123', 10),
      role: 'SYSTEM'
    }
  })
  console.log('Seeded admin system:', adminSystem)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
