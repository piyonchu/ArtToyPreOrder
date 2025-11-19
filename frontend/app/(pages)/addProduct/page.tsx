"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Adjusted path assuming standard alias

interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  arrivalDate: string;
  availableQuota: number;
  posterPicture: string;
  price: number;
  discountPercentage: number;
  rating: number;
  images: string[];
  tags: string[];
}

const AddProductPage = () => {
  const router = useRouter();
  
  // 1. Consolidated State
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    sku: "",
    name: "",
    description: "",
    arrivalDate: "",
    availableQuota: 0,
    posterPicture: "",
    price: 0,
    discountPercentage: 0,
    rating: 0,
    images: [],
    tags: [],
  });

  // 2. Check Admin Role
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      // Optional: Redirect if not admin
      // router.push("/"); 
    }
  }, []);

  // 3. Generic Input Handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // 4. Poster Image Handler
  const handlePosterPicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, posterPicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 5. Array Handlers (Images & Tags)
  const handleArrayChange = (
    field: "images" | "tags",
    index: number,
    value: string
  ) => {
    const arr = [...formData[field]];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const handleArrayAdd = (field: "images" | "tags") => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const handleArrayRemove = (field: "images" | "tags", index: number) => {
    const arr = [...formData[field]];
    arr.splice(index, 1);
    setFormData({ ...formData, [field]: arr });
  };

  // 6. Submit Handler
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    const today = new Date();
    const arrival = new Date(formData.arrivalDate);
    if (arrival < today) {
      setError("Arrival date must not be earlier than today");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/arttoys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Art toy created successfully!");
        router.push("/store"); 
      } else {
        setError(data.message || "Failed to create art toy");
      }
    } catch (error) {
      setError("An error occurred while creating the art toy");
    } finally {
      setLoading(false);
    }
  };

  // Render
  if (!isAdmin) {
    return <div className="p-10 text-center">Access Denied. Admins only.</div>;
  }

  return (
    <main className="mx-auto my-4 max-w-4xl p-4">
      <h2 className="text-3xl font-bold mb-6">Add New Art Toy</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="sku">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            required
            value={formData.sku}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Arrival Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="arrivalDate">
            Arrival Date
          </label>
          <input
            type="date"
            id="arrivalDate"
            name="arrivalDate"
            required
            value={formData.arrivalDate}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Available Quota */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="availableQuota">
            Available Quota
          </label>
          <input
            type="number"
            id="availableQuota"
            name="availableQuota"
            required
            value={formData.availableQuota}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Poster Picture URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="posterPicture">
            Poster Picture URL
          </label>
          <input
            type="text"
            id="posterPicture"
            name="posterPicture" 
            value={formData.posterPicture}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
          />
          {formData.posterPicture && (
            <div className="mt-2">
              <Image 
                src={formData.posterPicture} 
                alt="Preview" 
                width={100} 
                height={100} 
                className="object-cover rounded-md border"
                unoptimized // Added to allow arbitrary external URLs without config changes
              />
            </div>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            required
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Multiple Images Array */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <label className="block text-sm font-bold text-gray-700 mb-2">Additional Image URLs</label>
          {formData.images.map((img, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Image URL"
                value={img}
                onChange={(e) => handleArrayChange("images", index, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleArrayRemove("images", index)}
              >
                X
              </Button>
            </div>
          ))}
          <Button type="button" className="mt-2" onClick={() => handleArrayAdd("images")}>
            + Add Image URL
          </Button>
        </div>

        {/* Tags Array */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Tag Name"
                value={tag}
                onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleArrayRemove("tags", index)}
              >
                X
              </Button>
            </div>
          ))}
          <Button type="button" className="mt-2" onClick={() => handleArrayAdd("tags")}>
            + Add Tag
          </Button>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
            {loading ? "Creating..." : "Create Art Toy"}
          </Button>
        </div>
      </form>
    </main>
  );
};

export default AddProductPage;