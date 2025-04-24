-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'SYSTEM', 'BANK') NOT NULL DEFAULT 'BANK',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UMKMUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'SYSTEM', 'BANK') NOT NULL DEFAULT 'USER',
    `noTelepon` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UMKMUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UMKM` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `rt_rw` VARCHAR(191) NOT NULL,
    `desa_kel` VARCHAR(191) NOT NULL,
    `kecamatan` VARCHAR(191) NOT NULL,
    `kabupaten` VARCHAR(191) NOT NULL,
    `provinsi` VARCHAR(191) NOT NULL,
    `tahunBerdiri` INTEGER NOT NULL,
    `usahaUtama` ENUM('MAKANAN', 'PAKAIAN', 'KERAJINAN') NOT NULL,
    `produkUtama` VARCHAR(191) NOT NULL,
    `badanHukum` ENUM('PERSEORANGAN', 'CV') NOT NULL,
    `jumlahKaryawan` INTEGER NOT NULL,
    `sistemPenjualan` ENUM('RETAIL', 'DISTRIBUTOR', 'RETAILDANDISTRIBUTOR') NOT NULL,
    `persaingan` ENUM('RENDAH', 'SEDANG', 'TINGGI') NOT NULL,
    `totalAset` DOUBLE NOT NULL,
    `penjualanPerTahun` DOUBLE NOT NULL,
    `proyeksiPenjualan` DOUBLE NOT NULL,
    `nilaiAsetJaminan` DOUBLE NOT NULL,
    `jumlahDokumenKredit` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `noRekening` VARCHAR(191) NOT NULL,
    `noNPWP` VARCHAR(191) NOT NULL,
    `noBIP` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UMKM_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanApplication` (
    `id` VARCHAR(191) NOT NULL,
    `jumlahPinjaman` DOUBLE NOT NULL,
    `tujuan` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `umkmId` VARCHAR(191) NOT NULL,
    `mlDecision` ENUM('APPROVED', 'REJECTED') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SRLAssessment` (
    `id` VARCHAR(191) NOT NULL,
    `umkmId` VARCHAR(191) NOT NULL,
    `score` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SRLAssessment_umkmId_key`(`umkmId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UMKM` ADD CONSTRAINT `UMKM_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UMKMUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanApplication` ADD CONSTRAINT `LoanApplication_umkmId_fkey` FOREIGN KEY (`umkmId`) REFERENCES `UMKM`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SRLAssessment` ADD CONSTRAINT `SRLAssessment_umkmId_fkey` FOREIGN KEY (`umkmId`) REFERENCES `UMKM`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
