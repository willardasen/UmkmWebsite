"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";
import { adminProfileSchema, AdminProfileData } from "@/lib/validations/adminProfile";
import ErrorMessage from "@/components/ErrorMessage";

interface Props {
  initialData: { name: string; email: string };
  open: boolean;
  onClose: () => void;
  onSaveSuccess: (data: AdminProfileData) => void;
}

export default function AdminProfileEditDialog({ initialData, open, onClose, onSaveSuccess }: Props) {
  const [form, setForm] = useState<AdminProfileData>({ ...initialData, password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof AdminProfileData, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ ...initialData, password: "", confirmPassword: "" });
    setErrors({});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSave = async () => {
    try {
      adminProfileSchema.parse(form);
      setLoading(true);
      const res = await fetch("/api/admin/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        onSaveSuccess({ name: data.name, email: data.email, password: "", confirmPassword: "" });
        onClose();
      }
    } catch (err: any) {
      const fieldErrors: any = {};
      if (err?.errors) {
        err.errors.forEach((error: any) => {
          fieldErrors[error.path[0]] = error.message;
        });
      }
      setErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={onClose}>
            <IoCloseSharp size={20} />
          </button>
          <DialogTitle className="text-xl font-semibold mb-4">Edit Admin Profile</DialogTitle>
          <form className="grid grid-cols-1 gap-4">
            {[
              ["name", "Name", form.name],
              ["email", "Email", form.email],
              ["password", "New Password", form.password],
              ["confirmPassword", "Confirm Password", form.confirmPassword],
            ].map(([field, label, value]) => (
              <div key={field} className="flex flex-col">
                <label className="text-gray-700">{label}</label>
                <input
                  name={field}
                  type={(field ?? "").toLowerCase().includes("password") ? "password" : "text"}
                  value={value}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded"
                />
                <ErrorMessage message={errors[field as keyof AdminProfileData]} />
              </div>
            ))}
          </form>

          <div className="mt-6 flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center gap-2 min-w-[100px] hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
              {loading && <FaSpinner className="animate-spin h-4 w-4" />}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}