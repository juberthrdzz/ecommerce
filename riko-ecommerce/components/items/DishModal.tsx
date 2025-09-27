"use client";
import React from "react";
import { useUIStore } from "@/store/useUIStore";
import { useMenu } from "@/app/providers";
import Money from "@/components/Money";
import Button from "@/components/Button";
import { useCartStore } from "@/store/useCartStore";

export default function DishModal() {
  const { dishModal, closeDish } = useUIStore();
  const menu = useMenu();
  const add = useCartStore((s) => s.addItem);

  const item = menu.items.find((i) => i.id === dishModal.itemId);
  const [qty, setQty] = React.useState(1);
  const [selected, setSelected] = React.useState<Record<string, Set<string>>>({});

  React.useEffect(() => {
    if (!item) return;
    // initialize groups
    const init: Record<string, Set<string>> = {};
    (item.optionGroups ?? []).forEach((g) => {
      init[g.id] = new Set();
    });
    setSelected(init);
    setQty(1);
  }, [item]);

  console.log('DishModal state', dishModal, 'item?', !!item);
  if (!dishModal.open || !item) return null;

  const toggleOption = (groupId: string, optionId: string, max: number) => {
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[groupId] ?? []);
      if (set.has(optionId)) set.delete(optionId);
      else {
        if (set.size >= max) {
          // remove first to allow adding another
          const first = set.values().next().value as string | undefined;
          if (first) set.delete(first);
        }
        set.add(optionId);
      }
      next[groupId] = set;
      return next;
    });
  };

  const validate = (): string | null => {
    for (const g of item.optionGroups ?? []) {
      const sel = selected[g.id] ?? new Set();
      if (sel.size < g.min) return `Selecciona al menos ${g.min} en ${g.name}`;
      if (sel.size > g.max) return `Selecciona máximo ${g.max} en ${g.name}`;
    }
    return null;
  };

  const priceWithOptions = () => {
    const groups = item.optionGroups ?? [];
    const delta = groups.reduce((sum, g) => {
      const sel = selected[g.id] ?? new Set();
      const groupDelta = g.options
        .filter((o) => sel.has(o.id))
        .reduce((s, o) => s + o.priceDelta, 0);
      return sum + groupDelta;
    }, 0);
    return item.basePrice + delta;
  };

  const onAdd = () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    const options = (item.optionGroups ?? []).flatMap((g) => {
      const sel = selected[g.id] ?? new Set();
      return g.options
        .filter((o) => sel.has(o.id))
        .map((o) => ({ groupId: g.id, optionId: o.name, priceDelta: o.priceDelta }));
    });
    add({ itemId: item.id, name: item.name, unitPrice: item.basePrice, qty, options });
    closeDish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-base font-semibold">{item.name}</h3>
          <button onClick={closeDish} className="rounded p-2 hover:bg-zinc-100" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="space-y-4 p-4">
          {item.description && <p className="text-sm text-zinc-700">{item.description}</p>}
          {(item.optionGroups ?? []).map((g) => (
            <div key={g.id} className="rounded-md border p-3">
              <div className="mb-2 text-sm font-medium">
                {g.name} <span className="text-xs text-zinc-500">({g.min}-{g.max})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.options.map((o) => {
                  const checked = selected[g.id]?.has(o.id) ?? false;
                  return (
                    <button
                      key={o.id}
                      onClick={() => toggleOption(g.id, o.id, g.max)}
                      className={`rounded-full border px-3 py-1 text-sm ${checked ? "border-black bg-black text-white" : "hover:bg-zinc-100"}`}
                    >
                      {o.name} {o.priceDelta ? <span>(+<Money amount={o.priceDelta} />)</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="h-8 w-8 rounded border hover:bg-zinc-100" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-6 text-center text-sm">{qty}</span>
              <button className="h-8 w-8 rounded border hover:bg-zinc-100" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
            <div className="text-sm font-semibold">
              <Money amount={priceWithOptions() * qty} />
            </div>
          </div>
          <Button className="w-full" onClick={onAdd}>
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}


