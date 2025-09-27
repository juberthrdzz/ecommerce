import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  cartOpen: boolean;
  dishModal: { open: boolean; itemId?: string };
  openCart: () => void;
  closeCart: () => void;
  openDish: (itemId: string) => void;
  closeDish: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      cartOpen: false,
      dishModal: { open: false },
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      openDish: (itemId) => set({ dishModal: { open: true, itemId } }),
      closeDish: () => set({ dishModal: { open: false } }),
    }),
    { name: "ui_store" }
  )
);


