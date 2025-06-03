import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("email address tidak valid"),
  password: z.string().min(6, "Password harus minimal 6 karakter"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Nama harus minimal 3 karakter"),
  email: z.string().trim().toLowerCase().email("email address tidak valid"),
  phone: z.string().min(10, "Nomor telepon harus minimal 10 digit"),
  password: z.string()
    .min(6, "Password harus minimal 6 karakter")
    .regex(passwordRegex, "Password harus mengandung setidaknya satu huruf besar dan satu angka"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords tidak cocok",
  path: ["confirmPassword"],
  
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
