"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import ErrorMessage from "@/components/ErrorMessage";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerError("");

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 shadow rounded bg-white"
    >
      <h2 className="text-center text-xl font-semibold mb-4">Create Account</h2>

      <label className="block mb-2">
        <span>Nama</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Masukan nama anda"
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
          placeholder="Masukkan email anda"
          className="w-full mt-1 px-3 py-2 border rounded"
        />
        <ErrorMessage message={errors.email} />
      </label>

      <label className="block mb-2">
        <span>No telepon</span>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Masukkan no telepon anda"
          className="w-full mt-1 px-3 py-2 border rounded"
        />
        <ErrorMessage message={errors.phone} />
      </label>

      <label className="block mb-2">
        <span>Password</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Masukan password anda"
            className="w-full mt-1 px-3 py-2 border rounded"
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
      </label>

      <label className="block mb-2">
        <span>Confirm Password</span>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Masukan confirm password anda"
            className="w-full mt-1 px-3 py-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <FaEyeSlash size={18} />
            ) : (
              <FaEye size={18} />
            )}
          </button>
        </div>

        <ErrorMessage message={errors.confirmPassword} />
      </label>

      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-2 rounded transition flex items-center justify-center gap-2 
        ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
      >
        {loading ? "Registering..." : "Sign up"}
        {loading && <FaSpinner className="animate-spin h-4 w-4" />}
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login sekarang
        </Link>
      </p>
    </form>
  );
}
