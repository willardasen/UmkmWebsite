import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

export const adminProfileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter").regex(passwordRegex, "Password must contain at least one uppercase letter and one number").optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
})
.refine((data) => !data.password || data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type AdminProfileData = z.infer<typeof adminProfileSchema>;
