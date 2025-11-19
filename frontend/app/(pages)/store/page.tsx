"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductList from "@/components/store/ProductList";

export default function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <main className="bg-slate-50">
      <ProductList />

      {/* Admin-only Add Product button */}
      {isAdmin && (
        <div className="fixed inset-x-0 bottom-0 h-[72px] p-2 bg-white/60 border-t flex items-center md:justify-end justify-center gap-4 md:pr-32 sm:pr-12">
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white max-sm:flex-1 w-48"
            size="lg"
            onClick={() => router.push("/addProduct")}
          >
            Add Product
          </Button>
        </div>
      )}
    </main>
  );
}
