export type CartOptionSelection = { groupId: string; optionId: string; priceDelta: number };
export type CartLineItem = { itemId: string; name: string; unitPrice: number; qty: number; options?: CartOptionSelection[] };

export type FeeConfig = {
  taxRate?: number; // e.g., 0.16
  serviceFeeFixed?: number; // fixed fee per order
  serviceFeeRate?: number; // percentage of subtotal
};

export function calcTotals(items: CartLineItem[], cfg: FeeConfig) {
  const subtotal = items.reduce((sum, li) => {
    const optionsTotal = (li.options ?? []).reduce((s, o) => s + (o.priceDelta || 0), 0);
    const unitWithOptions = li.unitPrice + optionsTotal;
    return sum + unitWithOptions * li.qty;
  }, 0);
  const feesRate = (cfg.serviceFeeRate ?? 0) * subtotal;
  const feesFixed = cfg.serviceFeeFixed ?? 0;
  const fees = feesRate + feesFixed;
  const tax = (cfg.taxRate ?? 0) * subtotal;
  const total = subtotal + tax + fees;
  return { subtotal, tax, fees, total };
}


