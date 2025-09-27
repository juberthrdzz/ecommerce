"use client";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";

export default function SiteHeader({ title }: { title: string }) {
  const items = useCartStore((s) => s.items);
  const openCart = useUIStore((s) => s.openCart);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          {title}
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/checkout" className="text-sm text-zinc-700 hover:underline">
            Checkout
          </Link>
          <button aria-label="Open cart" onClick={openCart} className="relative rounded-md p-2 hover:bg-zinc-100">
            <span>🛒</span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[11px] text-white">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}


