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

    prisma.uMKMUser.upsert({
    where: { email: 'user3@example.com' },
    update: {},
    create: {
      email: 'user3@example.com',
      name: 'User Tiga',
      password: hashedPassword,
      noTelepon: '08111222333',
    },
  }),
  prisma.uMKMUser.upsert({
    where: { email: 'user4@example.com' },
    update: {},
    create: {
      email: 'user4@example.com',
      name: 'User Empat',
      password: hashedPassword,
      noTelepon: '08223334444',
    },
  }),
  prisma.uMKMUser.upsert({
    where: { email: 'user5@example.com' },
    update: {},
    create: {
      email: 'user5@example.com',
      name: 'User Lima',
      password: hashedPassword,
      noTelepon: '08334445555',
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
      noNIB: '48293015',
    },
  }),
  prisma.uMKM.upsert({
    where: { userId: users[1].id },
    update: {},
    create: {
      userId: users[1].id,
      name: 'UMKM Dua',
      tahunBerdiri: 2010,
      usahaUtama: 'KERAJINAN',
      produkUtama: 'Tas Anyaman',
      badanHukum: 'CV',
      sistemPenjualan: 'RETAILDANDISTRIBUTOR',
      jumlahKaryawan: 10,
      persaingan: 'TINGGI',
      proyeksiPenjualan: 100,
      nilaiAsetJaminan: 500,
      jumlahDokumenKredit: 6,
      totalAset: 200,
      penjualanPerTahun: 400,
      alamat: 'Jl. Mawar No. 2',
      rt_rw: '003/004',
      desa_kel: 'Sukamulya',
      kecamatan: 'Sukajadi',
      kabupaten: 'Sukasari',
      provinsi: 'Jawa Tengah',
      description: 'UMKM kerajinan tas berbahan alami.',
      noRekening: '0987654321',
      noNPWP: '123456789',
      noNIB: '739201846',
    },
  }),
  prisma.uMKM.upsert({
    where: { userId: users[2].id },
    update: {},
    create: {
      userId: users[2].id,
      name: 'UMKM Tiga',
      tahunBerdiri: 2015,
      usahaUtama: 'KERAJINAN',
      produkUtama: 'Sepatu anyaman',
      badanHukum: 'PERSEORANGAN',
      sistemPenjualan: 'RETAIL',
      jumlahKaryawan: 5,
      persaingan: 'SEDANG',
      proyeksiPenjualan: 0,
      nilaiAsetJaminan: 500,
      jumlahDokumenKredit: 2,
      totalAset: 450,
      penjualanPerTahun: 280,
      alamat: 'Jl. Anggrek No. 3',
      rt_rw: '005/006',
      desa_kel: 'Mekarsari',
      kecamatan: 'Mekarmulya',
      kabupaten: 'Suburmakmur',
      provinsi: 'Jawa Barat',
      description: 'UMKM bidang umum.',
      noRekening: '1111222233',
      noNPWP: '1122334455',
      noNIB: '65738291',
    },
  }),
  prisma.uMKM.upsert({
    where: { userId: users[3].id },
    update: {},
    create: {
      userId: users[3].id,
      name: 'UMKM Empat',
      tahunBerdiri: 2010,
      usahaUtama: 'MAKANAN',
      produkUtama: 'Tempe Mendoan',
      badanHukum: 'CV',
      sistemPenjualan: 'RETAILDANDISTRIBUTOR',
      jumlahKaryawan: 45,
      persaingan: 'SEDANG',
      proyeksiPenjualan: 32,
      nilaiAsetJaminan: 950,
      jumlahDokumenKredit: 10,
      totalAset: 1000,
      penjualanPerTahun: 3700,
      alamat: 'Jl. Melati No. 4',
      rt_rw: '007/008',
      desa_kel: 'Sukasejahtera',
      kecamatan: 'Mekarbakti',
      kabupaten: 'Sukasentosa',
      provinsi: 'Jawa Tengah',
      description: 'UMKM sektor unggulan.',
      noRekening: '4444555566',
      noNPWP: '6677889900',
      noNIB: '1029384756',
    },
  }),
  prisma.uMKM.upsert({
    where: { userId: users[4].id },
    update: {},
    create: {
      userId: users[4].id,
      name: 'UMKM Lima',
      tahunBerdiri: 2015,
      usahaUtama: 'MAKANAN',
      produkUtama: 'Daging Ikan',
      badanHukum: 'PERSEORANGAN',
      sistemPenjualan: 'RETAIL',
      jumlahKaryawan: 4,
      persaingan: 'SEDANG',
      proyeksiPenjualan: 1,
      nilaiAsetJaminan: 4900,
      jumlahDokumenKredit: 1,
      totalAset: 500,
      penjualanPerTahun: 250,
      alamat: 'Jl. Flamboyan No. 5',
      rt_rw: '009/010',
      desa_kel: 'Suburjaya',
      kecamatan: 'Sukajaya',
      kabupaten: 'Makmursentosa',
      provinsi: 'Jawa Barat',
      description: 'UMKM sektor tradisional.',
      noRekening: '7777888899',
      noNPWP: '9988776655',
      noNIB: '928173645',
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
