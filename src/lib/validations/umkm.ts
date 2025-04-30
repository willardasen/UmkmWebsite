import { z } from "zod";

export const umkmSchema = z.object({
  name: z.string().min(1, "Nama UMKM wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  rt_rw: z.string().min(1, "RT/RW wajib diisi"),
  desa_kel: z.string().min(1, "Desa/Kelurahan wajib diisi"),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
  kabupaten: z.string().min(1, "Kabupaten wajib diisi"),
  provinsi: z.string().min(1, "Provinsi wajib diisi"),
  tahunBerdiri: z
    .number({ invalid_type_error: "Tahun berdiri harus berupa angka" })
    .int()
    .gte(1900)
    .lte(new Date().getFullYear()),

  usahaUtama: z.enum(["MAKANAN", "PAKAIAN", "KERAJINAN"]),
  produkUtama: z.string().min(1, "Produk utama wajib diisi"),
  badanHukum: z.enum(["PERSEORANGAN", "CV"]),
  jumlahKaryawan: z.number().int().min(1, "Minimal 1 karyawan"),

  sistemPenjualan: z.enum([
    "RETAIL",
    "DISTRIBUTOR",
    "RETAILDANDISTRIBUTOR",
  ]),
  persaingan: z.enum(["RENDAH", "SEDANG", "TINGGI"]),

  totalAset: z.number().nonnegative(),
  penjualanPerTahun: z.number().nonnegative(),
  proyeksiPenjualan: z.number().nonnegative(),
  nilaiAsetJaminan: z.number().nonnegative(),
  jumlahDokumenKredit: z.number().nonnegative(),

  description: z.string().min(1, "Deskripsi wajib diisi"),
  noRekening: z
    .string()
    .regex(/^[0-9]{8,20}$/, "Nomor rekening harus berupa angka 8-20 digit"),
  noNPWP: z
    .string()
    .regex(/^[0-9]{15}$/, "Nomor NPWP harus 15 digit angka"),
  noBIP: z
    .string()
    .min(1, "Nomor BIP wajib diisi"),
});


export type UmkmSchema = z.infer<typeof umkmSchema>;




export type UMKMFormData = z.infer<typeof umkmSchema>;

 