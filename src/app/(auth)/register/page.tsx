'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import ErrorMessage from "@/components/ErrorMessage";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      registerSchema.parse(formData);

      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setServerError(data.message || "Registration failed");
        return;
      }

      router.push("/login");
    } catch (error: any) {
      if (error.errors) {
        const validationErrors: Partial<RegisterFormData> = {};
        error.errors.forEach((err: any) => {
          validationErrors[err.path[0] as keyof RegisterFormData] = err.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 shadow rounded bg-white">
      <h2 className="text-center text-xl font-semibold mb-4">Create Account</h2>

      <label className="block mb-2">
        <span>Name</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 border rounded"
        />
        <ErrorMessage message={errors.name} />
      </label>

      <label className="block mb-2">
        <span>Email</span>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 border rounded"
        />
        <ErrorMessage message={errors.email} />
      </label>

      <label className="block mb-2">
        <span>Phone</span>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 border rounded"
        />
        <ErrorMessage message={errors.phone} />
      </label>

      <label className="block mb-2">
        <span>Password</span>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 border rounded"
        />
        <ErrorMessage message={errors.password} />
      </label>

      <label className="block mb-2">
        <span>Confirm Password</span>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 border rounded"
        />
        <ErrorMessage message={errors.confirmPassword} />
      </label>

      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

      <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Sign up
      </button>
    </form>
  );
}
