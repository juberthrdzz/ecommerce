"use client";
import { useCartStore } from "@/store/useCartStore";

export default function CartIcon() {
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  return (
    <span className="relative inline-block">
      <span>🛒</span>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[11px] text-white">
          {count}
        </span>
      )}
    </span>
  );
}


