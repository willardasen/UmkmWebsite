"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loanSchema, type LoanFormData } from "@/lib/validations/loan";
import { toast } from "react-hot-toast";
import ErrorMessage from "@/components/ErrorMessage";

export default function LoanApplication() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoanFormData>({
    amount: 0,
    purpose: "",
  });
  const [errors, setErrors] = useState<Partial<LoanFormData>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));

    if (errors[name as keyof LoanFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      loanSchema.parse(formData);

      const res = await fetch("/api/loan/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jumlahPinjaman: formData.amount,
          tujuan: formData.purpose,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to apply for loan");
      }

      toast.success("Loan application submitted!");
      router.push("/loan-list");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10 border border-gray-200">
      <h1 className="text-3xl font-bold text-center mb-8">Apply untuk peminjaman</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-md font-medium">Jumlah peminjaman (IDR)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 10000000"
            // min="0"
            // step="1000000"
            required
          />
          {errors.amount && (
            <ErrorMessage message={errors.amount.toString()} />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-md font-medium">Tujuan Peminjaman</label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jelaskan tujuan peminjaman Anda..."
            rows={5}
            required
          />
          {errors.purpose && (
            <ErrorMessage message={errors.purpose} />
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}