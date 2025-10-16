export interface PaymentGateway {
  ready: boolean;
  createPaymentIntent(amount: number, currency: "MXN" | "USD"): Promise<{ clientSecret: string }>;
}

export class MockPaymentGateway implements PaymentGateway {
  ready = true;
  async createPaymentIntent(amount: number, currency: "MXN" | "USD") {
    const clientSecret = `mock_secret_${currency}_${amount}_${Date.now()}`;
    return { clientSecret };
  }
}

export class StripePaymentGateway implements PaymentGateway {
  ready = false;
  constructor(private baseUrl: string = "") {
    this.ready = true;
  }
  async createPaymentIntent(amount: number, currency: "MXN" | "USD"): Promise<{ clientSecret: string }> {
    const res = await fetch(`${this.baseUrl}/api/stripe-intents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Failed to create PaymentIntent");
    }
    const data = await res.json();
    return { clientSecret: data.clientSecret };
  }
}


