// src/components/forms/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import ErrorMessage from "@/components/ErrorMessage";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setServerError("");
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as "user" | "admin");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setServerError("");

    try {
      loginSchema.parse(formData);
    } catch (err: any) {
      const fieldErrors: Partial<LoginFormData> = {};
      err.errors?.forEach((error: any) => {
        fieldErrors[error.path[0] as keyof LoginFormData] = error.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
      role,
    });

    if (result?.error) {
      setServerError(result.error);
      setLoading(false);
      return;
    }

    const session = await getSession();
    const actualRole = session?.user?.role;

    if (role === "user" && actualRole === "USER") {
      router.push("/umkm-list");
    } else if (role === "admin" && actualRole === "SYSTEM") {
      router.push("/umkm-list");
    } else if (role === "admin" && actualRole === "BANK") {
      router.push("/umkm-list");
    } else {
      setServerError("Terjadi kesalahan role tidak cocok.");
    }

    setLoading(false);
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
          placeholder="Masukkan email anda"
          className="w-full px-3 py-2 border rounded"
          required
        />
        <ErrorMessage message={errors.email} />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Masukan password anda"
            className="w-full px-3 py-2 border rounded pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        <ErrorMessage message={errors.password} />
      </div>

      {serverError && (
        <p className="text-red-600 text-sm mb-4">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-2 rounded transition flex items-center justify-center gap-2 
        ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
      >
        {loading
          ? "Signing in..."
          : `Sign in sebagai ${role === "admin" ? "Admin" : "User"}`}
        {loading && <FaSpinner className="animate-spin h-4 w-4" />}
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
