import { z } from "zod";

export const umkmSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  ownerName: z.string().min(3, "Owner name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  kategori: z.string().min(3, "Category must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

export const loanSchema = z.object({
  amount: z.number().positive("Loan amount must be positive"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
});

export type UMKMFormData = z.infer<typeof umkmSchema>;
export type LoanFormData = z.infer<typeof loanSchema>; 