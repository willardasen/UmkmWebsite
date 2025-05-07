// validationSchema.ts
import { z } from 'zod';

export const profileSchema = z
  .object({
    name: z.string().min(1, { message: 'Nama wajib diisi' }),
    email: z.string().email({ message: 'Email tidak valid' }),
    noTelepon: z.string().min(10, { message: 'Nomor telepon minimal 10 digit' }),
    password: z.string().min(6, { message: 'Password minimal 6 karakter' }).optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type ProfileFormData = z.infer<typeof profileSchema>;
