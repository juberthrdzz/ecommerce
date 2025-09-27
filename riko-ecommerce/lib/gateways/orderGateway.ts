export type OrderPayload = {
  restaurantId: string;
  items: Array<{ itemId: string; qty: number; unitPrice: number; options?: Array<{ groupId: string; optionId: string; priceDelta: number }> }>;
  amounts: { subtotal: number; tax: number; fees: number; total: number; currency: "MXN" | "USD" };
  customer?: { name?: string; email?: string; phone?: string; address?: string };
  fulfillment?: { type: "pickup" | "delivery"; notes?: string; eta?: string };
  meta?: Record<string, unknown>;
};

export interface OrderGateway {
  submit(payload: OrderPayload): Promise<{ ok: boolean; id?: string; redirectUrl?: string }>;
}

export class MockOrderGateway implements OrderGateway {
  async submit(payload: OrderPayload): Promise<{ ok: boolean; id?: string }> {
    const id = `mock_${Date.now()}`;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("lastOrder", JSON.stringify({ id, ...payload }));
      } catch (e) {
        console.warn("Failed to write lastOrder to localStorage", e);
      }
    }
    console.log("MockOrderGateway.submit", payload);
    return { ok: true, id };
  }
}

export class HttpOrderGateway implements OrderGateway {
  constructor(private baseUrl: string) {}
  async submit(payload: OrderPayload) {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false };
    const data = await res.json().catch(() => ({}));
    return { ok: true, id: data?.id };
  }
}


