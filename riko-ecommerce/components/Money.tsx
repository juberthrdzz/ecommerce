"use client";
import { uiConfig } from "@/config/ui";
import { formatCurrency } from "@/utils/currency";

export default function Money({ amount, currency }: { amount: number; currency?: "MXN" | "USD" }) {
  return <span>{formatCurrency(amount, currency ?? uiConfig.currency, uiConfig.locale)}</span>;
}


