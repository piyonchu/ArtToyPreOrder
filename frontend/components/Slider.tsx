"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { Button } from "./ui/button";
import { priceFormat } from "@/lib/utils";
import Link from "next/link";

const Slider = () => {
  return (
    // Added theme variants to border color
    <section className="translate-y-4 shadow-2xl border-4 rounded-2xl border-blue-300 pink:border-pink-300 green:border-green-300 purple:border-purple-300 relative max-w-[83rem] mx-auto transition-colors duration-300">
      <Swiper
        slidesPerView={1}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]} // Add Autoplay to the modules
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 3000,  // Slide every 3 seconds
          disableOnInteraction: false,  // Keep autoplay even if the user interacts with the slider
        }}
        className="h-[400px] sm:h-[600px] rounded-[0.5rem]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative">
            <Link href={`/product?id=${slide.id}`}>
              <figure className="h-full">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill={true}
                  quality={100}
                  className="object-cover"
                />
              </figure>
              <div className="absolute left-20 top-1/2 transform -translate-y-1/2 md:max-w-sm max-w-xs">
                <h2 className="md:text-6xl text-4xl font-bold text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                  {slide.title}
                </h2>
                <div className="flex items-center gap-2 py-4">
                  <span className="text-2xl text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                    {priceFormat(slide.price)}
                  </span>
                  <del className="text-gray-500 text-xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {priceFormat(slide.discountPrice)}
                  </del>
                </div>
                <div>
                  {/* Added theme variants to Button background and hover states */}
                  <Button className="bg-sky-500 pink:bg-pink-500 green:bg-green-500 purple:bg-purple-500 hover:bg-sky-600 pink:hover:bg-pink-600 green:hover:bg-green-600 purple:hover:bg-purple-600 text-white transition-colors duration-300">
                    Preorder now
                  </Button>
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
    id: "691c2ac582a2e4e2c8f5fe60",
    img: "https://genshinfans.com/cdn/shop/articles/shenhe-figure-genshin_5be0dc7b-70d7-411e-8819-a997f7608995_1024x1024.jpg?v=1753429487",
    title: "Shenhe Figure",
    price: 3999,
    discountPrice: 4599,
    align: "left",
  },
  {
    id: "691c2ac582a2e4e2c8f5fe5f",
    img: "https://drive.google.com/uc?export=view&id=1m4yJIPUT99XaBuZ6BzWycfGcBmtNZf7z",
    title: "Genshin Impact : Official Art Book Vol. 1",
    price: 1099,
    discountPrice: 1299,
    align: "left",
  },
  {
    id: "691917532106fab761df0b23",
    img: "https://genshinfans.com/cdn/shop/collections/genshin_plushies_4679a82f-857a-4d34-9670-e794d9e619d6.jpg?v=1743586669",
    title: "Genshin Official Plushies",
    price: 1899,
    discountPrice: 1999,
    align: "left",
  },
];
