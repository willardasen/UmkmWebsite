// src/components/forms/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import ErrorMessage from "@/components/ErrorMessage";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [role, setRole] = useState<"user" | "admin">("user");
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [serverError, setServerError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    setServerError("");
  };

  const handleRoleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRole(e.target.value as "user" | "admin");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Validasi lokal dengan Zod
    try {
      loginSchema.parse(formData);
      setErrors({});
    } catch (err: any) {
      const fieldErrors: Partial<LoginFormData> = {};
      err.errors?.forEach((error: any) => {
        fieldErrors[error.path[0] as keyof LoginFormData] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // 2) Sign in via NextAuth Credentials
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
      role,                         // dibaca oleh authorize()
    });

    if (result?.error) {
      setServerError(result.error);
      return;
    }

    // 3) Redirect
    if (role === "user") {
      router.push("/umkm-list"); //ganti
      return;
    }

    // 4) Untuk admin, cek actual role dari session
    const session = await getSession();
    const actualRole = session?.user?.role;
    if (actualRole === "SYSTEM") {
      router.push("/tes/system"); //ganti
    } else {
      router.push("/tes/bank"); //ganti
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Login sebagai</label>
        <select
          name="role"
          value={role}
          onChange={handleRoleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="user">UMKM User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className="w-full px-3 py-2 border rounded"
          required
        />
        <ErrorMessage message={errors.email} />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          className="w-full px-3 py-2 border rounded"
          required
        />
        <ErrorMessage message={errors.password} />
      </div>

      {serverError && (
        <p className="text-red-600 text-sm mb-4">{serverError}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Sign in as {role === "admin" ? "Admin" : "User"}
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Belum punya akun?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register sekarang
        </Link>
      </p>
    </form>
  );
}
