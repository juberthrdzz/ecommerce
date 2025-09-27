"use client";
import Link from "next/link";
import { useUIStore } from "@/store/useUIStore";
import { useCartStore } from "@/store/useCartStore";
import Money from "@/components/Money";
import { calcTotals } from "@/lib/cart";
import { uiConfig } from "@/config/ui";
import Button from "@/components/Button";

export default function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const close = useUIStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const update = useCartStore((s) => s.updateItem);
  const remove = useCartStore((s) => s.removeItem);

  const { subtotal, tax, fees, total } = calcTotals(items, uiConfig.fees);

  return (
    <div aria-hidden={!open} className="pointer-events-none fixed inset-0 z-40">
      {/* Overlay */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "pointer-events-auto opacity-100" : "opacity-0"}`}
      />
      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-white shadow-xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">Tu carrito</h2>
          <button onClick={close} aria-label="Close cart" className="rounded p-2 hover:bg-zinc-100">
            ✕
          </button>
        </div>
        <div className="flex h-[calc(100%-56px)] flex-col">
          <div className="flex-1 space-y-3 overflow-auto p-4">
            {items.length === 0 && <p className="text-sm text-zinc-600">Tu carrito está vacío.</p>}
            {items.map((li) => (
              <div key={li.itemId} className="flex items-start justify-between gap-3 rounded-md border p-3">
                <div>
                  <div className="font-medium text-zinc-900">{li.name}</div>
                  {li.options && li.options.length > 0 && (
                    <ul className="mt-1 text-xs text-zinc-600">
                      {li.options.map((o) => (
                        <li key={`${o.groupId}-${o.optionId}`}>+ {o.optionId} <Money amount={o.priceDelta} /></li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-1 text-sm text-zinc-700">
                    <Money amount={li.unitPrice} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Decrease"
                    className="h-7 w-7 rounded border text-sm hover:bg-zinc-100"
                    onClick={() => update(li.itemId, (p) => ({ ...p, qty: Math.max(1, p.qty - 1) }))}
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{li.qty}</span>
                  <button
                    aria-label="Increase"
                    className="h-7 w-7 rounded border text-sm hover:bg-zinc-100"
                    onClick={() => update(li.itemId, (p) => ({ ...p, qty: p.qty + 1 }))}
                  >
                    +
                  </button>
                  <button
                    aria-label="Remove"
                    className="ml-2 h-7 rounded border px-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => remove(li.itemId)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}

            {/* Promo stub */}
            <div className="rounded-md border p-3">
              <label className="mb-1 block text-xs text-zinc-600">Código promocional</label>
              <input
                disabled
                placeholder="Próximamente"
                className="w-full rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-600"
              />
            </div>
          </div>
          <div className="border-t p-4 text-sm">
            <div className="mb-2 flex justify-between"><span>Subtotal</span><span><Money amount={subtotal} /></span></div>
            <div className="mb-2 flex justify-between"><span>Impuestos</span><span><Money amount={tax} /></span></div>
            <div className="mb-3 flex justify-between"><span>Comisiones</span><span><Money amount={fees} /></span></div>
            <div className="mb-4 flex justify-between font-semibold"><span>Total</span><span><Money amount={total} /></span></div>
            <Link href="/checkout" onClick={close} className="block">
              <Button className="w-full">Ir a pagar</Button>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}


