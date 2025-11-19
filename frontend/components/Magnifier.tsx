"use client";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Magnifier({
  src,
  zoom = 2, // zoom factor
}: {
  src: string;
  zoom?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const { left, top, width, height } =
      containerRef.current!.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;

    setPos({
      x: Math.max(0, Math.min(x, width)),
      y: Math.max(0, Math.min(y, height)),
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onMouseMove={handleMove}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100%"
        className="object-contain select-none pointer-events-none"
      />

      {show && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${zoom * 100}%`,
            backgroundPosition: `${(-pos.x * zoom) + pos.x}px ${
              (-pos.y * zoom) + pos.y
            }px`,
          }}
        />
      )}
    </div>
  );
}
