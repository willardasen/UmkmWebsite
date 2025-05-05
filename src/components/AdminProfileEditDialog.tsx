"use client";

import { Dialog } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";

interface AdminProfileData {
  name: string;
  email: string;
}

interface AdminProfileEditDialogProps {
  initialData: AdminProfileData;
  open: boolean;
  onClose: () => void;
  onSaveSuccess: (updatedData: AdminProfileData) => void;
}

export default function AdminProfileEditDialog({
  initialData,
  open,
  onClose,
  onSaveSuccess,
}: AdminProfileEditDialogProps) {
  const [form, setForm] = useState<AdminProfileData>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const updated = await res.json();
      onSaveSuccess(updated);
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <IoCloseSharp size={20} />
          </button>

          {/* Dialog Title */}
          <Dialog.Title className="text-xl font-semibold mb-4">Edit Admin Profile</Dialog.Title>

          {/* Form */}
          <form className="grid grid-cols-1 gap-4">
            {[
              ["name", "Name", form.name],
              ["email", "Email", form.email],
            ].map(([field, label, value]) => (
              <div key={field} className="flex flex-col">
                <label className="text-gray-700">{label}</label>
                <input
                  name={field as string}
                  type="text"
                  value={value as string}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded"
                />
              </div>
            ))}
          </form>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
