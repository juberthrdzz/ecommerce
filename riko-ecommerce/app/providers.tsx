"use client";
import React from "react";
import type { NormalizedMenu } from "@/lib/menu.schema";

export const MenuContext = React.createContext<NormalizedMenu | null>(null);
export function useMenu() {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error("MenuContext not provided");
  return ctx;
}

export function Providers({ children, menu }: { children: React.ReactNode; menu: NormalizedMenu }) {
  return <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>;
}


