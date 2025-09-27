"use client";
import React from "react";
import Money from "@/components/Money";
import type { OrderPayload } from "@/lib/gateways/orderGateway";

export default function SuccessPage() {
  const [order, setOrder] = React.useState<(OrderPayload & { id?: string }) | null>(null);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("lastOrder");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-xl font-semibold">¡Gracias por tu compra!</h1>
      <p className="mb-6 text-zinc-700">Hemos recibido tu orden.</p>
      {order ? (
        <div className="rounded-lg border p-4 text-sm">
          <div className="mb-2">Orden ID: <span className="font-mono">{order.id}</span></div>
          <div className="mb-3">Items: {order.items?.length ?? 0}</div>
          <div className="flex justify-between"><span>Total</span><span><Money amount={order.amounts?.total ?? 0} /></span></div>
        </div>
      ) : (
        <div className="text-sm text-zinc-600">No hay datos de orden.</div>
      )}
    </main>
  );
}


