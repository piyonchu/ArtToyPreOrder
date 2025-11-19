import Slider from "@/components/Slider";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-50 pb-8">
      <Slider />
      <section className="grid grid-cols-2 gap-3 my-8 w-[95vw] mx-auto">
        {homeProduct.map((item) => (
          <Link
            href={`/${item.id}`}
            className="shadow-lg hover:shadow-xl"
            key={item.id}
          >
            <div className="relative overflow-hidden w-full h-[400px]">
              <Image
                src={item.image}
                alt={item.image}
                width={400}
                height={400}
                className="object-contain transition-transform hover:scale-105"
              />
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}


const homeProduct = [
  {
    id: "64c5dc0a0c06622dfd4f94d6",
    image:
      "https://m.media-amazon.com/images/I/71eK6iPxOSL._AC_SX679_.jpg",
  },
  {
    id: "64c5dfdb0c06622dfd4f94d8",
    image:
      "https://m.media-amazon.com/images/I/61uAnkZuY-L._AC_SX679_.jpg",
  },
  {
    id: "64c5e1090c06622dfd4f94d9",
    image:
      "https://m.media-amazon.com/images/I/51lAXJBFEvL._AC_SX679_.jpg",
  },
  {
    id: "64c5dde60c06622dfd4f94d7",
    image:
      "https://m.media-amazon.com/images/I/51eOaZnsHzL._AC_SX679_.jpg",
  },
];
