"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { umkmSchema, type UMKMFormData } from "@/lib/validations/umkm";

export default function NewUMKM() {
  const router = useRouter();
  const [formData, setFormData] = useState<UMKMFormData>({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    kategori: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<UMKMFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof UMKMFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      umkmSchema.parse(formData);

      // TODO: Submit form data to API
      console.log("Form data:", formData);

      // Redirect to UMKM list page
      router.push("/umkm-list");
    } catch (error) {
      if (error instanceof Error) {
        // Handle validation errors
        const validationErrors: Partial<UMKMFormData> = {};
        JSON.parse(error.message).forEach((err: any) => {
          validationErrors[err.path[0] as keyof UMKMFormData] = err.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register New UMKM</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">UMKM Name</span>
          </label>
          <input
            type="text"
            name="name"
            className="input input-bordered"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span className="text-error text-sm">{errors.name}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Owner Name</span>
          </label>
          <input
            type="text"
            name="ownerName"
            className="input input-bordered"
            value={formData.ownerName}
            onChange={handleChange}
          />
          {errors.ownerName && (
            <span className="text-error text-sm">{errors.ownerName}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            className="input input-bordered"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="text-error text-sm">{errors.email}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number</span>
          </label>
          <input
            type="tel"
            name="phone"
            className="input input-bordered"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <span className="text-error text-sm">{errors.phone}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input
            type="text"
            name="address"
            className="input input-bordered"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && (
            <span className="text-error text-sm">{errors.address}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <input
            type="text"
            name="category"
            className="input input-bordered"
            value={formData.kategori}
            onChange={handleChange}
          />
          {errors.kategori && (
            <span className="text-error text-sm">{errors.kategori}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            className="textarea textarea-bordered h-24"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <span className="text-error text-sm">{errors.description}</span>
          )}
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary">
            Register UMKM
          </button>
        </div>
      </form>
    </div>
  );
}
