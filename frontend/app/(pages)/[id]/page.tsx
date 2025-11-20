"use client";

import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { Button } from "../../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setArtToy, setArtToyLoading } from "../../../redux/slice/productSlice";
import { useRouter } from "next/navigation";
import ProductImgSlider from "@/components/product/ProductImgSlider";
import { priceFormat } from "@/lib/utils";
import { addToCart, setTotal } from "@/redux/slice/cartSlice";
import { Star, StarHalf } from "lucide-react";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { artToy, artToyLoading } = useAppSelector((state) => state.product);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedToy, setUpdatedToy] = useState(artToy || {});
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const fetchArtToy = async () => {
      dispatch(setArtToyLoading(true));
      setFetchError(false);

      try {
        // USE YOUR INTERNAL API ROUTE INSTEAD
        const url = `/api/products/${params.id}`;
        console.log('Fetching from internal API:', url);
        
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
          cache: 'no-store',
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched result:', result);

        if (result.success && result.data) {
          dispatch(setArtToy(result.data));
          setUpdatedToy(result.data);
        } else if (result.data) {
          // Handle case where API doesn't return success flag
          dispatch(setArtToy(result.data));
          setUpdatedToy(result.data);
        } else {
          setFetchError(true);
        }
      } catch (error) {
        console.error("Error fetching ArtToy:", error);
        setFetchError(true);
      } finally {
        dispatch(setArtToyLoading(false));
      }
    };

    fetchArtToy();
  }, [dispatch, params.id]);

  if (artToyLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-lg text-gray-600">
        <p>Product not found (ID: {params.id})</p>
        <Button className="mt-4" onClick={() => router.push('/store')}>
          Return to Store
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // USE YOUR INTERNAL API ROUTE
      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...updatedToy,
          images: updatedToy.images || [],
          tags: updatedToy.tags || [],
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert("Art toy updated successfully!");
        dispatch(setArtToy(data.data || updatedToy));
        setIsEditing(false);
      } else {
        alert(data.error || data.message || "Failed to update art toy");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating the art toy.");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // USE YOUR INTERNAL API ROUTE
      const response = await fetch(`/api/products/${params.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product deleted successfully!");
        router.push("/store");
      } else {
        alert(data.error || data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the product.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedToy({ ...updatedToy, [name]: value });
  };

  const addCartHandle = () => {
    dispatch(
      addToCart({
        _id: artToy._id,
        title: artToy.name,
        quantity: 1,
        price: artToy.price,
        img: artToy.posterPicture,
      })
    );

    dispatch(setTotal());
  };

  const handleArrayChange = (
    field: "images" | "tags",
    index: number,
    value: string
  ) => {
    const arr = [...(updatedToy[field] || [])];
    arr[index] = value;
    setUpdatedToy({ ...updatedToy, [field]: arr });
  };

  const handleArrayAdd = (field: "images" | "tags") => {
    setUpdatedToy({
      ...updatedToy,
      [field]: [...(updatedToy[field] || []), ""],
    });
  };

  const handleArrayRemove = (field: "images" | "tags", index: number) => {
    const arr = [...(updatedToy[field] || [])];
    arr.splice(index, 1);
    setUpdatedToy({ ...updatedToy, [field]: arr });
  };

  const finalSellingPrice =
    artToy?.price * (1 - (artToy?.discountPercentage || 0) / 100);

  return (
    <>
      {artToy && artToy.images && artToy.name && artToy.description ? (
        <div className="sm:flex block bg-slate-50">
          <ProductImgSlider images={artToy.images} />
          <div className="flex-1 p-4">
            <h1 className="text-3xl font-bold text-sky-900">{artToy.name}</h1>

            {artToy.rating && (
              <div className="flex items-center gap-2 py-2">
                <span className="px-1 bg-yellow-400 rounded-sm mr-2">
                  {artToy.rating}
                </span>
                {Array.from({ length: 5 }, (_, index) => {
                  let num = index + 0.5;
                  return (
                    <React.Fragment key={index}>
                      {artToy.rating && (
                        <span>
                          {artToy.rating >= index + 1 ? (
                            <Star
                              className="fill-yellow-300"
                              strokeWidth={1.25}
                              size={18}
                            />
                          ) : artToy.rating >= num ? (
                            <StarHalf
                              className="fill-yellow-300"
                              strokeWidth={1.25}
                              size={18}
                            />
                          ) : (
                            ""
                          )}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
            {artToy.discountPercentage > 0 ? (
              <span className="text-[#f50514] text-3xl flex-1 text-red-500">
                {artToy.discountPercentage}% OFF
              </span>
            ) : (
              <span className="flex-1"></span>
            )}

            <div className="flex gap-2 py-4 items-center">
              <span className="text-2xl">{priceFormat(finalSellingPrice)}</span>
              {artToy.discountPercentage > 0 && (
                <del className="text-gray-500 text-xs">
                  {priceFormat(artToy.price)}
                </del>
              )}
            </div>

            {artToy.description && (
              <div className="mt-2 space-y-2 text-lg text-sky-700">
                {artToy.description.split("\n").map((line, index) => {
                  const text = line.trim();
                  if (!text) return null;
                  const isBullet = text.startsWith("--");
                  const cleanText = isBullet ? text.substring(2).trim() : text;
                  const [title, ...rest] = cleanText.split(":");
                  const body = rest.join(":");

                  return (
                    <div key={index} className="flex items-start">
                      {isBullet && <span className="mr-2 text-sky-600">•</span>}
                      <div>
                        {body ? (
                          <>
                            <span className="font-bold text-sky-900">
                              {title}:
                            </span>
                            {body}
                          </>
                        ) : (
                          cleanText
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4">
              <p>
                <strong>Arrival Date:</strong>{" "}
                {new Date(artToy.arrivalDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Available Quota:</strong> {artToy.availableQuota}
              </p>
            </div>

            {isAdmin && (
              <div className="mt-6 flex gap-4">
                <Button
                  className="w-32"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel Edit" : "Edit"}
                </Button>

                {!isEditing && (
                  <Button
                    className="w-32"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}

                {isEditing && (
                  <Button className="w-32" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                )}
              </div>
            )}

            {isEditing && (
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="sku"
                    >
                      SKU
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={updatedToy.sku}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={updatedToy.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={updatedToy.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="arrivalDate"
                    >
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      id="arrivalDate"
                      name="arrivalDate"
                      value={updatedToy.arrivalDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="availableQuota"
                    >
                      Available Quota
                    </label>
                    <input
                      type="number"
                      id="availableQuota"
                      name="availableQuota"
                      value={updatedToy.availableQuota}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="posterPicture"
                    >
                      Poster Picture URL
                    </label>
                    <input
                      type="text"
                      id="posterPicture"
                      name="posterPicture"
                      value={updatedToy.posterPicture}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={updatedToy.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={updatedToy.discountPercentage}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      name="rating"
                      value={updatedToy.rating}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Images
                    </label>
                    {updatedToy.images?.map((img: string, index: number) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) =>
                            handleArrayChange("images", index, e.target.value)
                          }
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
                    <Button
                      type="button"
                      className="mt-2"
                      onClick={() => handleArrayAdd("images")}
                    >
                      + Add Image
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tags
                    </label>
                    {updatedToy.tags?.map((tag: string, index: number) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) =>
                            handleArrayChange("tags", index, e.target.value)
                          }
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
                    <Button
                      type="button"
                      className="mt-2"
                      onClick={() => handleArrayAdd("tags")}
                    >
                      + Add Tag
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen text-lg text-gray-600">
          <p>No ArtToy data found. Please check the API or artToy object.</p>
        </div>
      )}

      {artToy && (
        <div className="fixed inset-x-0 bottom-0 h-[72px] p-2 bg-white/60 border-t flex items-center md:justify-end justify-center gap-4 md:pr-32 sm:pr-12">
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white max-sm:flex-1 w-48"
            size={"lg"}
            onClick={addCartHandle}
          >
            Add to Cart
          </Button>
        </div>
      )}
    </>
  );
};

export default Page;