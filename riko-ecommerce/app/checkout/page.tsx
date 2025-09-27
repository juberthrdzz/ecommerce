"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Money from "@/components/Money";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { calcTotals } from "@/lib/cart";
import { uiConfig } from "@/config/ui";
import { env } from "@/lib/env";
import { MockOrderGateway, HttpOrderGateway } from "@/lib/gateways/orderGateway";
import { MockPaymentGateway, StripePaymentGateway } from "@/lib/gateways/paymentGateway";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);

  React.useEffect(() => {
    if (env.REQUIRE_AUTH_BEFORE_PAYMENT && !user) {
      router.push(`/signin?next=/checkout`);
    }
  }, [user, router]);

  const [form, setForm] = React.useState({ name: "", email: user?.email ?? "", phone: "", address: "" });
  const { subtotal, tax, fees, total } = calcTotals(items, uiConfig.fees);

  const orderGateway = env.ORDER_GATEWAY === "http" && env.ORDER_HTTP_BASE_URL
    ? new HttpOrderGateway(env.ORDER_HTTP_BASE_URL)
    : new MockOrderGateway();
  const paymentGateway = env.PAYMENT_PROVIDER === "stripe" ? new StripePaymentGateway() : new MockPaymentGateway();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    try {
      // Payment flow (mock only for now)
      if (env.PAYMENT_PROVIDER === "mock") {
        await paymentGateway.createPaymentIntent(total, uiConfig.currency);
      } else {
        // Stripe disabled - UI only
        alert("Stripe UI only; requires backend to create PaymentIntent.");
        return;
      }

      const payload = {
        restaurantId: "rest_mx_1",
        items: items.map((i) => ({
          itemId: i.itemId,
          qty: i.qty,
          unitPrice: i.unitPrice,
          options: (i.options ?? []).map((o) => ({ groupId: o.groupId, optionId: o.optionId, priceDelta: o.priceDelta })),
        })),
        amounts: { subtotal, tax, fees, total, currency: uiConfig.currency },
        customer: { name: form.name, email: form.email, phone: form.phone, address: form.address },
        fulfillment: { type: "pickup" as const },
        meta: { source: "nextjs_demo" },
      };

      const res = await orderGateway.submit(payload);
      if (res.ok) {
        clear();
        router.push("/success");
      } else {
        alert("Error al enviar la orden");
      }
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Error en el pago");
    }
  };

  const disabledStripe = env.PAYMENT_PROVIDER === "stripe";

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">Checkout</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <section className="rounded-lg border p-4">
          <h2 className="mb-3 font-medium">Contacto y entrega</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Dirección (opcional)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
        </section>
        <section className="rounded-lg border p-4">
          <h2 className="mb-3 font-medium">Pago</h2>
          {env.PAYMENT_PROVIDER === "mock" ? (
            <div className="rounded-md border border-dashed p-3 text-sm text-zinc-600">Formulario de tarjeta (mock)</div>
          ) : (
            <div className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              <p>
                Stripe Elements UI solo. Se requiere servidor para crear PaymentIntent.
                Conecta vía <code>paymentGateway.createPaymentIntent()</code>.
              </p>
              <Button type="button" disabled className="opacity-60">Pagar con Stripe</Button>
            </div>
          )}
        </section>
        <section className="rounded-lg border p-4 text-sm">
          <div className="mb-2 flex justify-between"><span>Subtotal</span><span><Money amount={subtotal} /></span></div>
          <div className="mb-2 flex justify-between"><span>Impuestos</span><span><Money amount={tax} /></span></div>
          <div className="mb-3 flex justify-between"><span>Comisiones</span><span><Money amount={fees} /></span></div>
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span><Money amount={total} /></span></div>
        </section>
        <div>
          <Button type="submit" disabled={disabledStripe} className="w-full sm:w-auto">
            {env.PAYMENT_PROVIDER === "mock" ? "Pagar (mock)" : "Pagar"}
          </Button>
        </div>
      </form>
    </main>
  );
}


