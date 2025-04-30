import { z } from "zod";

export const loanSchema = z.object({
  amount: z.number().positive("Loan amount must be positive"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
});
export type LoanFormData = z.infer<typeof loanSchema>;