"use client";

import { useState } from "react";
import AdminProfileEditDialog from "@/components/AdminProfileEditDialog";

interface AdminProfileClientProps {
  adminData: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    role: string;
  };
}

export default function AdminProfileClient({ adminData }: AdminProfileClientProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(adminData.name);
  const [email, setEmail] = useState(adminData.email);

  return (
    <div>
      {/* Profile Section */}
      <section className="bg-white p-6 shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Admin Profile</h2>
          <button
            onClick={() => setOpen(true)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              disabled
              className="mt-1 p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="mt-1 p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Role</label>
            <input
              type="text"
              value={adminData.role}
              disabled
              className="mt-1 p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Joined At</label>
            <input
              type="text"
              value={new Date(adminData.createdAt).toLocaleDateString("id-ID")}
              disabled
              className="mt-1 p-2 border rounded bg-gray-100"
            />
          </div>
        </div>
      </section>

      {/* Edit Dialog */}
      <AdminProfileEditDialog
        open={open}
        onClose={() => setOpen(false)}
        initialData={{ name, email }}
        onSaveSuccess={(updated) => {
          setName(updated.name);
          setEmail(updated.email);
          setOpen(false);
        }}
      />
    </div>
  );
}
