"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { ProfileData } from "./ProfileClient";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { profileSchema, ProfileFormData } from "@/lib/validations/profile";
import ErrorMessage from "@/components/ErrorMessage";

interface ProfileEditDialogProps {
  initialData: { name: string; email: string; noTelepon: string };
  open: boolean;
  onClose: () => void;
  onSaveSuccess: (updatedData: ProfileData) => void;
}

export default function ProfileEditDialog({
  initialData,
  open,
  onClose,
  onSaveSuccess,
}: ProfileEditDialogProps) {
  const [form, setForm] = useState<ProfileFormData>({
    ...initialData,
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState<
    Record<string, boolean>
  >({
    password: false,
    confirmPassword: false,
  });

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
      profileSchema.parse(form);
      setLoading(true);
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        onSaveSuccess({ ...data });
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
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <IoCloseSharp size={20} />
          </button>
          <DialogTitle className="text-xl font-semibold mb-4">
            Edit Profile
          </DialogTitle>
          <form className="grid grid-cols-1 gap-4">
            {[
              ["name", "Name", form.name],
              ["email", "Email", form.email],
              ["noTelepon", "Contact Number", form.noTelepon || ""],
              ["password", "New Password", form.password],
              ["confirmPassword", "Confirm Password", form.confirmPassword],
            ].map(([field, label, value]) => {
              const isPasswordField = (field ?? "")
                .toLowerCase()
                .includes("password");
              const show = showPasswordFields[field as string];

              return (
                <div key={field} className="flex flex-col relative">
                  <label className="text-gray-700">{label}</label>
                  <input
                    name={field}
                    type={isPasswordField && !show ? "password" : "text"}
                    placeholder= {isPasswordField && !show ? "Tidak perlu diisi jika tidak ingin menganti" : ""}
                    value={value}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded pr-10"
                  />
                  
                  {isPasswordField && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordFields((prev) => ({
                          ...prev,
                          [field as string]: !prev[field as string],
                        }))
                      }
                      className="absolute right-3 bottom-3 text-gray-600 hover:text-gray-900"
                      tabIndex={-1}
                    >
                      {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  )}
                  <ErrorMessage
                    message={errors[field as keyof ProfileFormData]}
                  />
                </div>
              );
            })}
          </form>
          <div className="mt-6 flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center gap-2 min-w-[100px] hover:bg-blue-700"
              disabled={loading}
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
