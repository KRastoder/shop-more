"use client";

import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/cart";

export default function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(getCartCount());
    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
      {count}
    </span>
  );
}
