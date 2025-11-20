"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import useDeviceSize from "@/lib/useDeviceSize";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart, setTotal } from "@/redux/slice/cartSlice";
import { useToast } from "./ui/use-toast";
import { IArtToy } from "@/lib/interface";
import { priceFormat } from "@/lib/utils"; 
import { Star } from "lucide-react";

const Cards = ({ toy }: { toy: IArtToy }) => {
  const { width } = useDeviceSize();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const {
    _id,
    name,
    posterPicture,
    description,
    availableQuota,
    arrivalDate,
    discountPercentage,
    rating,
    price,
  } = toy;

  const finalSellingPrice = price * (1 - discountPercentage / 100);

  const addToCartHandle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); 
    dispatch(
      addToCart({ 
        _id, 
        price: finalSellingPrice,
        title: name, 
        img: posterPicture, 
        quantity: 1 
      })
    );
    dispatch(setTotal());
    toast({ title: "ArtToy added to cart" });
  };

  return (
    <Link href={`/product?id=${_id}`}>
      <Card className="rounded-2xl grid items-center h-full border-sky-800 border-2 bg-sky-50 hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gray-50 aspect-[1/0.85] items-center justify-center p-0 rounded-2xl">
          <figure className="h-full">
            <Image
              src={posterPicture}
              width={width < 400 ? 100 : 200}
              height={width < 400 ? 100 : 200}
              alt={name}
              className="brightness-[0.98] w-full h-full object-scale-down p-6"
            />
          </figure>
        </CardHeader>
        <CardContent className="md:p-4 md:pb-0 p-2 pb-0">
          <p className="font-semibold text-sky-900">
            {name.length > 100 ? name.slice(0, 100) + "..." : name}
          </p>
          <p className="text-sm text-sky-700">
            {description.length > 60
              ? description.slice(0, 60) + "..."
              : description}
          </p>
          <div className="flex items-center">
            {discountPercentage > 0 ? (
              <span className="text-[#f50514] text-sm flex-1">
                {discountPercentage}% OFF
              </span>
            ) : (
              <span className="flex-1"></span>
            )}
            <span className="flex items-center text-sm gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-yellow-300" />
              <span>{rating}</span>
            </span>
          </div>
          <div className="flex items-center py-2 gap-1">
            <span className="font-medium text-sky-800">{priceFormat(finalSellingPrice)}</span>
            {discountPercentage > 0 && (
              <del className="text-gray-500 text-xs">
                {priceFormat(price)} 
              </del>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-sky-800">
            <span>Available: {availableQuota}</span>
            <span>Arrival: {new Date(arrivalDate).toLocaleDateString()}</span>
          </div>
        </CardContent>
        <CardFooter className="md:p-4 md:pt-0 p-2 pt-0">
          <Button
            className="translate-y-1 border w-full h-10 rounded-xl bg-sky-600 hover:bg-sky-700 text-white"
            onClick={addToCartHandle}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Cards;