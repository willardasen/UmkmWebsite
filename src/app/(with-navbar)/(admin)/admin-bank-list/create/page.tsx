"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreateAdminBankForm,
  createAdminBankSchema,
} from "@/lib/validations/createAdmin";
import { ZodError } from "zod";
import ErrorMessage from "@/components/ErrorMessage";

export default function CreateAdminBankPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateAdminBankForm>({
    name: "",
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateAdminBankForm, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    try {
      createAdminBankSchema.parse(form);
      setErrors({});

      const res = await fetch("/api/admin/register-admin-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Terjadi kesalahan");
        return;
      }

      router.push("/admin-bank-list");
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof CreateAdminBankForm, string>> =
          {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof CreateAdminBankForm;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error(error);
        alert("Error creating admin bank");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold">Create Admin Bank</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded space-y-4"
      >
        <div className="flex flex-col">
          <label className="text-gray-700">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            className="mt-1 p-2 border rounded"
            required
          />
          {errors.name && <ErrorMessage message={errors.name} />}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="mt-1 p-2 border rounded"
            required
          />
          {errors.email && <ErrorMessage message={errors.email} />}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="text"
            className="mt-1 p-2 border rounded"
            required
          />
          {errors.password && <ErrorMessage message={errors.password} />}
        </div>

        {serverError && <ErrorMessage message={serverError} />}


        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin-bank-list")} //ini nanti blh di hapus
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
