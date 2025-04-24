import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin
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

  // UMKM Users
  const users = await Promise.all([
    prisma.uMKMUser.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        email: 'user1@example.com',
        name: 'User Satu',
        password: hashedPassword,
        noTelepon: '08123456789',
      },
    }),
    prisma.uMKMUser.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        email: 'user2@example.com',
        name: 'User Dua',
        password: hashedPassword,
        noTelepon: '08198765432',
      },
    }),
  ]);


  // UMKM Profiles
await Promise.all([
  prisma.uMKM.upsert({
    where: { userId: users[0].id },
    update: {},
    create: {
      userId: users[0].id,
      name: 'UMKM Satu',
      tahunBerdiri: 2015,
      usahaUtama: 'MAKANAN',
      produkUtama: 'Keripik Tempe',
      badanHukum: 'PERSEORANGAN',
      sistemPenjualan: 'RETAIL',
      jumlahKaryawan: 5,
      persaingan: 'SEDANG',
      proyeksiPenjualan: 100,
      nilaiAsetJaminan: 250,
      jumlahDokumenKredit: 3,
      totalAset: 400,
      penjualanPerTahun: 700,
      alamat: 'Jl. Cemara No. 1',
      rt_rw: '001/002',
      desa_kel: 'Sukamaju',
      kecamatan: 'Sukamakmur',
      kabupaten: 'Sukaindah',
      provinsi: 'Jawa Barat',
      description: 'UMKM produksi makanan ringan sehat.',
      noRekening: '1234567890',
      noNPWP: '987654321',
      noBIP: 'BIP001',
    },
  }),
  prisma.uMKM.upsert({
    where: { userId: users[1].id },
    update: {},
    create: {
      userId: users[1].id,
      name: 'UMKM Dua',
      tahunBerdiri: 2019,
      usahaUtama: 'KERAJINAN',
      produkUtama: 'Tas Anyaman',
      badanHukum: 'CV',
      sistemPenjualan: 'RETAILDANDISTRIBUTOR',
      jumlahKaryawan: 10,
      persaingan: 'TINGGI',
      proyeksiPenjualan: 200,
      nilaiAsetJaminan: 500,
      jumlahDokumenKredit: 5,
      totalAset: 800,
      penjualanPerTahun: 1200,
      alamat: 'Jl. Mawar No. 2',
      rt_rw: '003/004',
      desa_kel: 'Sukamulya',
      kecamatan: 'Sukajadi',
      kabupaten: 'Sukasari',
      provinsi: 'Jawa Tengah',
      description: 'UMKM kerajinan tas berbahan alami.',
      noRekening: '0987654321',
      noNPWP: '123456789',
      noBIP: 'BIP002',
    },
  }),
]);


  console.log('🚀 Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
