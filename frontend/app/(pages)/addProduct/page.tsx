"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AddProductPage = () => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [availableQuota, setAvailableQuota] = useState(0);
  const [posterPic, setPosterPic] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle input change for poster picture
  const handlePosterPicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPosterPic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Validate and handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate if the arrival date is in the past
    const today = new Date();
    const arrival = new Date(arrivalDate);
    if (arrival < today) {
      setError("Arrival date must not be earlier than today");
      return;
    }

    // Prepare the payload
    const newToy = {
      sku,
      name,
      description,
      arrivalDate,
      availableQuota,
      posterPicture: posterPic,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/arttoys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newToy),
        }
      );

      const data = await response.json();
      console.log("created ", data);
      if (response.ok) {
        alert("Art toy created successfully!");
        router.push("/store"); // Redirect to products page
      } else {
        setError(data.message || "Failed to create art toy");
      }
    } catch (error) {
      setError("An error occurred while creating the art toy");
    }
  };

  return (
    <main className="mx-auto my-4 max-w-4xl p-4">
      <h2 className="text-3xl font-bold">Add New Art Toy</h2>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {/* SKU Input */}
        <div>
          <label
            htmlFor="sku"
            className="block text-sm font-medium text-gray-700"
          >
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Arrival Date Input */}
        <div>
          <label
            htmlFor="arrivalDate"
            className="block text-sm font-medium text-gray-700"
          >
            Arrival Date
          </label>
          <input
            type="date"
            id="arrivalDate"
            name="arrivalDate"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Available Quota Input */}
        <div>
          <label
            htmlFor="availableQuota"
            className="block text-sm font-medium text-gray-700"
          >
            Available Quota
          </label>
          <input
            type="number"
            id="availableQuota"
            name="availableQuota"
            value={availableQuota}
            onChange={(e) => setAvailableQuota(Number(e.target.value))}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            required
            min="0"
          />
        </div>

        {/* Poster Picture Input */}
        <div>
          <label
            htmlFor="posterPic"
            className="block text-sm font-medium text-gray-700"
          >
            Poster Picture URL
          </label>
          <input
            type="text"
            id="posterPic"
            name="posterPic"
            value={posterPic}
            onChange={(e) => setPosterPic(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter the URL of the poster picture"
            required
          />
        </div>

        {/* Preview */}
        {posterPic && (
          <div className="mt-6">
            <h3 className="text-lg font-medium">Preview</h3>
            <div className="flex space-x-4 mt-4">
              <div className="w-1/3">
                <Image
                  src={posterPic}
                  alt="Art Toy Preview"
                  width={150}
                  height={150}
                  objectFit="contain"
                />
              </div>
              <div className="w-2/3">
                <h4 className="text-lg font-bold">{name}</h4>
                <p>{description}</p>
                <p className="mt-2 text-gray-500">
                  Arrival Date: {arrivalDate}
                </p>
                <p className="mt-2 text-gray-500">
                  Available Quota: {availableQuota}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Art Toy
          </button>
        </div>
      </form>
    </main>
  );
};

export default AddProductPage;
