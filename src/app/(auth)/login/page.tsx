'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import ErrorMessage from "@/components/ErrorMessage";
import Link from "next/link";

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
  const [role, setRole] = useState<"user" | "admin">("user"); // Logic: pilih role untuk menentukan endpoint
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1️⃣ Local validation dengan Zod
    try {
      loginSchema.parse(formData);
      setErrors({});
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Partial<LoginFormData> = {};
        err.errors.forEach((error: any) => {
          fieldErrors[error.path[0] as keyof LoginFormData] = error.message;
        });
        setErrors(fieldErrors);
      }
      return;
    }

    // 2️⃣ Pilih endpoint berdasarkan role
    const endpoint = role === "admin"
      ? "/api/admin/login"   // Logic: route untuk admin
      : "/api/user/login";   // Logic: route untuk UMKM user

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Login failed");
        return;
      }

      // 3️⃣ Simpan token dan redirect
      localStorage.setItem("token", data.token);
      router.push(role === "admin" ? "/tes/bank" : "/tes/umkm"); // ini nanti coba ganti ke dashboard masing-masing
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 shadow rounded bg-white">
      <h2 className="text-center text-xl font-semibold mb-4">Login</h2>

      {/* Role selector */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Login sebagai</label>
        <select
          name="role"
          value={role}
          onChange={e => setRole(e.target.value as "user"|"admin")}
          className="w-full mt-1 px-3 py-2 border rounded"
        >
          <option value="user">UMKM User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <label className="block mb-2">
        <span>Email</span>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 border rounded"
          required
        />
        <ErrorMessage message={errors.email} />
      </label>

      <label className="block mb-2">
        <span>Password</span>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mt-1 px-3 py-2 border rounded"
          required
        />
        <ErrorMessage message={errors.password} />
      </label>

      {serverError && <p className="text-red-600 text-sm mb-4">{serverError}</p>}

      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Sign in as {role === "admin" ? "Admin" : "User"}
      </button>

      <div className="text-center mt-4">
        <p>
          Tidak memiliki akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register sekarang
          </Link>
        </p>
      </div>
    </form>
  );
}
