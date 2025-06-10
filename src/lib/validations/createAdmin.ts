// lib/validations/admin.ts
import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

export const createAdminBankSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string()
  .min(6, "Password minimal 6 karakter")
  .regex(passwordRegex, "Password harus mengandung setidaknya satu huruf besar dan satu angka"),
});

export type CreateAdminBankForm = z.infer<typeof createAdminBankSchema>;
