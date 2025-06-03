import { z } from "zod";

export const loanSchema = z.object({
  amount: z.number().positive("Jumlah pinjaman harus positif"),
  purpose: z.string().min(10, "Tujuan harus minimal 10 karakter"),
});
export type LoanFormData = z.infer<typeof loanSchema>;