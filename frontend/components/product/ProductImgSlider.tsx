import Magnifier from "@/components/Magnifier";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ProductImgSlider = ({ images }: { images: string[] }) => {
  return (
    <div className="bg-gray-50 md:h-[calc(100vh_-_120px)] max-md:aspect-square overflow-hidden flex-1">
      <Swiper
        slidesPerView={1}
        navigation
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        className="h-full swiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Magnifier src={img} zoom={2.5} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImgSlider;
