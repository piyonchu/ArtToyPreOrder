"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { Button } from "./ui/button";
import { priceFormat } from "@/lib/utils";
import Link from "next/link";

const Slider = () => {
  return (
    <section className="relative">
      <Swiper
        slidesPerView={1}
        navigation={true}
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        loop={true}
        className="sm:h-[700px] h-[200px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative">
            <Link href={`/${slide.id}`}>
              <figure className="h-full">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill={true}
                  quality={100}
                  className="max-sm:object-cover"
                />
              </figure>
              <div className="absolute left-12 top-1/2 -translate-y-1/2 md:max-w-sm max-w-xs">
                <h2 className="md:text-6xl text-4xl font-bold text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                  {slide.title}
                </h2>
                <div className="flex items-center gap-2 py-4">
                  <span className="text-2xl text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">{priceFormat(slide.price)}</span>
                  <del className="text-gray-500 text-xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {priceFormat(slide.discountPrice)}
                  </del>
                </div>
                <div>
                  <Button>Buy now</Button>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};


export default Slider;

const slides = [
  
  {
    id: "64ba67d69a61845ba6b4f5a4",
    img: "https://genshinfans.com/cdn/shop/articles/shenhe-figure-genshin_5be0dc7b-70d7-411e-8819-a997f7608995_1024x1024.jpg?v=1753429487",
    title: "Shenhe Figure",
    price: 3999,
    discountPrice: 4599,
    align: "left",
  },
  {
    id: "64ba6ec19a61845ba6b4f5a6",
    img: "https://drive.google.com/uc?export=view&id=1m4yJIPUT99XaBuZ6BzWycfGcBmtNZf7z",
    title: "Genshin Impact : Official Art Book Vol. 1",
    price: 1099,
    discountPrice: 1299,
    align: "left",
  },
  {
    id: "64ba6b7c9a61845ba6b4f5a5",
    img: "https://genshinfans.com/cdn/shop/collections/genshin_plushies_4679a82f-857a-4d34-9670-e794d9e619d6.jpg?v=1743586669",
    title: "Genshin Official Plushies",
    price: 1899,
    discountPrice: 1999,
    align: "left",
  },
];
