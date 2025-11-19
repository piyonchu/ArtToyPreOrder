"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchOrders } from "../../../redux/slice/orderSlice";
import { priceFormat } from "../../../lib/utils";
import Image from "next/image";
import Link from "next/link";

// Function to make PUT request to update the order
const updateOrder = async (orderId: string, orderAmount: number) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { error: "Token not found" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderAmount }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update order");
    }

    return data; // Return success response
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message }; // Type assertion here
    }
    return { error: "An unknown error occurred" };
  }
};

// Function to make DELETE request to cancel the order
const deleteOrder = async (orderId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { error: "Token not found" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete order");
    }

    return data; // Return success response
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message }; // Type assertion here
    }
    return { error: "An unknown error occurred" };
  }
};

const Page = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.order);
  const [editOrderId, setEditOrderId] = useState<string | null>(null); // For handling edit mode
  const [newOrderAmount, setNewOrderAmount] = useState<number | null>(null); // For handling new quantity input
  const [userRole, setUserRole] = useState<string | null>(null); // For storing the logged-in user's role

  useEffect(() => {
    // Get the current user's role from localStorage (or an API call if necessary)
    const role = localStorage.getItem("role");
    setUserRole(role);

    dispatch(fetchOrders()); // Fetch orders on component mount
  }, [dispatch]);

  // Loading state while orders are being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state if fetching orders fails
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handler for updating order amount
  const handleUpdateOrder = async (orderId: string) => {
    if (!newOrderAmount || newOrderAmount < 1 || newOrderAmount > 5) {
      alert("Order amount must be between 1 and 5.");
      return;
    }

    const { error } = await updateOrder(orderId, newOrderAmount);

    if (error) {
      alert(error);
    } else {
      // Successfully updated, reset the edit state
      setEditOrderId(null);
      setNewOrderAmount(null);
      dispatch(fetchOrders()); // Re-fetch orders to reflect the update
    }
  };

  // Handler for deleting an order
  const handleDeleteOrder = async (orderId: string) => {
    const { error } = await deleteOrder(orderId);

    if (error) {
      alert(error);
    } else {
      // Successfully deleted, re-fetch orders to reflect the deletion
      dispatch(fetchOrders());
    }
  };

  console.log("Orders Data:", orders);

  return (
    <main className="mx-auto my-4 max-w-6xl px-2 md:my-6 md:px-0">
      <h2 className="text-3xl font-bold">Order Details</h2>
      <div className="mt-3 text-sm">
        Check the status of recent and old orders & discover more products
      </div>

      {/* Display orders if available */}
      {orders && orders.length > 0 ? (
        <div className="flex-1">
          <div className="p-8">
            <ul className="-my-7 divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order._id}>
                  <div className="flex flex-col justify-between space-x-5 py-7 md:flex-row">
                    <div className="flex flex-1 items-stretch">
                      <div className="flex-shrink-0">
                        <Image
                          width={50}
                          height={50}
                          className="h-20 w-20 rounded-lg border border-gray-200 object-contain"
                          src={order.artToy.posterPicture}
                          alt={order.artToy.name}
                        />
                      </div>

                      <div className="ml-5 flex flex-col justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">
                            {order.artToy.name}
                          </p>
                        </div>

                        <p className="mt-4 text-sm font-medium text-gray-500">
                          x {order.orderAmount}
                        </p>
                      </div>
                    </div>

                    <div className="ml-auto flex flex-col items-end justify-between">
                      <p className="text-right text-sm font-bold text-gray-900">
                        {priceFormat(order.artToy.price * order.orderAmount)}{" "}
                        {/* Display price */}
                      </p>

                      {/* Edit or Delete buttons */}
                      <div className="flex space-x-3 mt-4">
                        {editOrderId === order._id ? (
                          <>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              step="1" // Ensures only integer values
                              value={newOrderAmount || order.orderAmount}
                              onChange={(e) => {
                                // Ensure the value is an integer between 1 and 5
                                let value = parseInt(e.target.value, 10);

                                if (isNaN(value)) {
                                  value = 1; // Default to 1 if the value is invalid
                                }

                                if (value < 1) value = 1; // Prevent values less than 1
                                if (value > 5) value = 5; // Prevent values greater than 5

                                setNewOrderAmount(value);
                              }}
                              className="w-16 p-1 border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => handleUpdateOrder(order._id)}
                              className="bg-blue-500 text-white py-1 px-3 rounded"
                            >
                              Update
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditOrderId(order._id)}
                            className="bg-yellow-500 text-white py-1 px-3 rounded"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="bg-red-500 text-white py-1 px-3 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Display user details if the logged-in user is an admin */}
                  {userRole === "admin" && (
                    <div className="mt-4 text-sm text-gray-500">
                      <h4 className="font-bold">User Information</h4>
                      <p><strong>Name:</strong> {order.user?.name}</p>
                      <p><strong>Email:</strong> {order.user?.email}</p>
                      <p><strong>Phone:</strong> {order.user?.tel}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <hr className="my-8 border-t border-t-gray-200" />
          </div>
        </div>
      ) : (
        <div>No Orders Found</div>
      )}
    </main>
  );
};

export default Page;
