import Slider from "@/components/Slider";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { priceFormat } from "@/lib/utils";

export default function Home() {
  return (
    <main className="h-[1500px] bg-gradient-to-br from-slate-50 to-sky-100">
      <Slider />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 my-8 w-[90vw] mx-auto rounded-2xl">
        {homeProduct.map((item) => (
          <Link
            href={`/product?id=${item.id}`}
            className="shadow-lg hover:shadow-xl bg-sky-50 rounded-lg overflow-hidden flex flex-col md:flex-row border-4 rounded-2xl border-blue-300"
            key={item.id}
          >
            {/* LEFT — IMAGE */}
            <div className="md:w-1/2 h-[300px] md:h-[400px] flex items-center justify-center bg-white">
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={300}
                className="object-contain transition-transform hover:scale-105"
              />
            </div>

            {/* RIGHT — TEXT (STICK TO RIGHT SIDE) */}
            <div className="md:w-1/2 p-4 flex flex-col justify-center items-end text-right">
              <h2 className="text-lg md:text-xl font-bold text-sky-800">{item.title}</h2>

              <div className="flex items-center gap-3 py-4 justify-end">
                <span className="text-xl font-bold text-sky-700">
                  {priceFormat(item.price)}
                </span>
                <del className="text-gray-500 text-lg text-sky-600">
                  {priceFormat(item.discountPrice)}
                </del>
              </div>

              <Button className="w-fit bg-sky-500 hover:bg-sky-600 text-white">Preorder now</Button>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

const homeProduct = [
  {
    id: "691917532106fab761df0b26",
    image: "https://m.media-amazon.com/images/I/71eK6iPxOSL._AC_SX679_.jpg",
    title:
      "Genshin Impact Hu Tao Skateboard Figurine – 9 Inches Tall, 7 Inches Wide – Collectible Action Figure",
    price: 1039,
    discountPrice: 1299,
    align: "right",
  },
  {
    id: "691a203480127907c084fd56",
    image: "https://m.media-amazon.com/images/I/61uAnkZuY-L._AC_SX679_.jpg",
    title:
      "Genshin Impact Official Illustration miHoYo Original Merch Collection Set Vol.2",
    price: 1299,
    discountPrice: 1299,
    align: "right",
  },
  {
    id: "691917532106fab761df0b25",
    image: "https://m.media-amazon.com/images/I/51lAXJBFEvL._AC_SX679_.jpg",
    title: "GENSHIN Impact Furina Impression Series - Sitting Plushie",
    price: 1999,
    discountPrice: 1999,
    align: "right",
  },
  {
    id: "691917532106fab761df0b24",
    image: "https://m.media-amazon.com/images/I/51eOaZnsHzL._AC_SX679_.jpg",
    title: "GENSHIN IMPACT Frostflake Heron Kamisato Ayaka 1/7 Scale Figure",
    price: 6299,
    discountPrice: 6999,
    align: "right",
  },
];
