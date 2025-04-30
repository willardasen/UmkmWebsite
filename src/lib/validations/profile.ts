import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(), // optional saat edit
  noTelepon: z
    .string()
    .min(8, "Nomor telepon terlalu pendek")
    .max(15, "Nomor telepon terlalu panjang")
    .regex(/^[0-9]+$/, "Hanya angka yang diperbolehkan"),
});
