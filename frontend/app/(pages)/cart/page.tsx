"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Button } from "../../../components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { priceFormat } from "../../../lib/utils";
import {
  decItem,
  incItem,
  removeCart,
  removeSelectedCart,
  handleEditCartMode,
  handleSelectCart,
  handleSelectAll,
  setTotal,
  clearCart
} from "../../../redux/slice/cartSlice";
import useDeviceSize from "../../../lib/useDeviceSize";
import axios from "axios";

const Page = () => {
  const [mounted, setMounted] = useState(false); // State to track if the component has mounted

  const { width } = useDeviceSize(); // This depends on the client-side width
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Ensure useAppSelector is always called
  const {
    cart,
    totalPrice,
    totalQuantity,
    editCartMode,
    selectCart,
    selectAll,
  } = useAppSelector((state) => state.cart);
  const { authStatus } = useAppSelector((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = async () => {
    try {

      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to place an order!");
        return;
      }

      const cartItems = cart; 
      const totalQuantity = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      for (const item of cartItems) {
        const cartData = {
          artToy: item._id,
          orderAmount: item.quantity,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
            body: JSON.stringify(cartData), 
          }
        );


        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (response.ok) {
            console.log("Checkout successful:", data);

            localStorage.setItem(
              "order",
              JSON.stringify({
                items: cartItems,
                totalQuantity,
                totalPrice,
              })
            );

            //localStorage.removeItem("myCart");
            dispatch(clearCart());

    
            router.push("/orders"); 
          } else {

            console.error("Checkout failed:", data);
            alert(
              `There was an issue with the checkout process: ${
                data.message || "Please try again."
              }`
            );
          }
        } catch (parseError) {
          // If response is not valid JSON, log the raw response text for debugging
          console.error("Response is not valid JSON. Raw response:", text);
          alert(
            "The server returned an unexpected response. Please try again later."
          );
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      // Handle the error, such as displaying an error message
      alert("There was an issue with the checkout process. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(setTotal());
  }, [dispatch]);

  if (!mounted) return null; // Ensure the UI only renders after the component is mounted

  return (
  <main className="bg-gray-100 h-[100dvh] relative">
    <section className="py-4 max-md:pt-0">
      {cart.length > 0 && (
        <>
          {width < 768 && (
            <div className="flex items-center justify-between p-4 mb-4 bg-white">
              <p>My Cart ({totalQuantity})</p>
              <button
                onClick={() => dispatch(handleEditCartMode(!editCartMode))}
              >
                {!editCartMode ? "Edit" : "Cancel"}
              </button>
            </div>
          )}
        </>
      )}
      {cart.length > 0 ? (
        cart.map((elm) => (
          <div
            className="flex items-center gap-4 p-4 md:px-8 bg-white mb-4"
            key={elm._id}
          >
            {editCartMode && width < 768 && (
              <div>
                <input
                  type="checkbox"
                  name="edit"
                  id="edit"
                  checked={selectCart.includes(elm._id)}
                  onChange={() =>
                    dispatch(
                      handleSelectCart({
                        id: elm._id,
                        cartLength: cart.length,
                      })
                    )
                  }
                />
              </div>
            )}
            <div>
              <figure className="sm:w-28 sm:h-28 w-16 h-16">
                <Image
                  src={elm.img}
                  width={width > 640 ? 100 : 60}
                  height={width > 640 ? 100 : 60}
                  alt={elm.title}
                  className="w-full h-full object-scale-down"
                />
              </figure>
            </div>
            <div className="flex-1 flex sm:items-center max-sm:justify-between max-sm:flex-col">
              {/* Added theme variants to Product Title */}
              <h2 className="md:text-xl font-medium flex-1 text-sky-900 pink:text-pink-900 green:text-green-900 purple:text-purple-900 transition-colors duration-300">{elm.title}</h2>
              <div className="flex-1 flex items-center">
                {/* Added theme variants to Product Price */}
                <p className="md::text-lg flex-1 text-sky-900 pink:text-pink-900 green:text-green-900 purple:text-purple-900 transition-colors duration-300">{priceFormat(elm.price)}</p>
                <div className="flex-1 flex items-center md:justify-center justify-end">
                  <button
                    className="w-6 h-6 sm:w-8 sm:h-8 border flex items-center justify-center hover:bg-gray-100 disabled:cursor-not-allowed "
                    disabled={elm.quantity <= 1}
                    onClick={() => {
                      dispatch(decItem(elm._id));
                      dispatch(setTotal());
                    }}
                  >
                    <Minus strokeWidth={1.5} size={18} />
                  </button>
                  <span className="w-10 h-6 sm:w-12 sm:h-8 inline-flex items-center justify-center border-t border-b">
                    {elm.quantity}
                  </span>
                  <button
                    className="w-6 h-6 sm:w-8 sm:h-8 border flex items-center justify-center hover:bg-gray-100"
                    onClick={() => {
                      dispatch(incItem(elm._id));
                      dispatch(setTotal());
                    }}
                  >
                    <Plus strokeWidth={1.5} size={18} />
                  </button>
                </div>
                <div className="flex-1 hidden md:flex items-center justify-end">
                  <button
                    className=" w-4 h-4 hover:scale-125"
                    onClick={() => {
                      dispatch(removeCart(elm._id));
                      dispatch(setTotal());
                    }}
                  >
                    <X strokeWidth={1.5} size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center pt-8">
          {/* Added theme variants to Empty Cart Message */}
          <p className="text-4xl font-medium text-sky-900 pink:text-pink-900 green:text-green-900 purple:text-purple-900 transition-colors duration-300">Your cart is empty!</p>
        </div>
      )}
    </section>
    {cart.length > 0 && (
      <>
        {editCartMode && width < 768 ? (
          <div className="fixed bottom-0 inset-x-0 px-8 h-[72px] bg-white flex gap-8 items-center justify-between">
            <label htmlFor="all" className="">
              <input
                type="checkbox"
                name="all"
                id="all"
                checked={selectAll}
                onChange={() =>
                  dispatch(handleSelectAll(cart.map((c) => c._id)))
                }
              />{" "}
              All
            </label>
            <Button
              size={"lg"}
              variant={"outline"}
              className="rounded-none "
              disabled={selectCart.length < 1}
              onClick={() => {
                dispatch(removeSelectedCart());
                dispatch(setTotal());
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="fixed inset-x-0 bottom-0 h-[72px] p-2 bg-white/60 border-t flex items-center md:justify-end justify-center gap-4 md:pr-32 sm:pr-12">
            {/* Added theme variants to Total Price Text */}
            <p className="font-medium text-xl text-sky-900 pink:text-pink-900 green:text-green-900 purple:text-purple-900 transition-colors duration-300">{priceFormat(totalPrice)}</p>
            <Button
              size={"lg"}
              // Added theme variants to Preorder Button
              className="bg-sky-500 pink:bg-pink-500 green:bg-green-500 purple:bg-purple-500 hover:bg-sky-600 pink:hover:bg-pink-600 green:hover:bg-green-600 purple:hover:bg-purple-600 text-white max-sm:flex-1 w-48 transition-colors duration-300"
              onClick={handleCheckout}
            >
              Preorder
            </Button>
          </div>
        )}
      </>
    )}
  </main>
);
};

export default Page;
