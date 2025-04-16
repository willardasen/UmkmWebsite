"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loanSchema, type LoanFormData } from "@/lib/validations/umkm";

export default function LoanApplication() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoanFormData>({
    amount: 0,
    purpose: "",
  });
  const [errors, setErrors] = useState<Partial<LoanFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof LoanFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      loanSchema.parse(formData);

      // TODO: Submit form data to API
      console.log("Form data:", formData);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        // Handle validation errors
        const validationErrors: Partial<LoanFormData> = {};
        JSON.parse(error.message).forEach((err: any) => {
          validationErrors[err.path[0] as keyof LoanFormData] = err.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Loan Application</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Loan Amount (IDR)</span>
          </label>
          <input
            type="number"
            name="amount"
            className="input input-bordered"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="1000000"
          />
          {errors.amount && (
            <span className="text-error text-sm">{errors.amount}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Purpose of Loan</span>
          </label>
          <textarea
            name="purpose"
            className="textarea textarea-bordered h-24"
            value={formData.purpose}
            onChange={handleChange}
          />
          {errors.purpose && (
            <span className="text-error text-sm">{errors.purpose}</span>
          )}
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}
