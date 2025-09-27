import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLineItem } from "@/lib/cart";

type CartState = {
  items: CartLineItem[];
  addItem: (item: CartLineItem) => void;
  updateItem: (itemId: string, updater: (prev: CartLineItem) => CartLineItem) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.itemId === item.itemId);
          if (existing) {
            return {
              items: s.items.map((i) => (i.itemId === item.itemId ? { ...i, qty: i.qty + item.qty } : i)),
            };
          }
          return { items: [...s.items, item] };
        }),
      updateItem: (itemId, updater) =>
        set((s) => ({ items: s.items.map((i) => (i.itemId === itemId ? updater(i) : i)) })),
      removeItem: (itemId) => set((s) => ({ items: s.items.filter((i) => i.itemId !== itemId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "cart_store" }
  )
);


