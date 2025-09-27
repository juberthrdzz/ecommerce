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
  constructor() {
    // Requires server route to create PaymentIntent; not implemented here
  }
  async createPaymentIntent(): Promise<{ clientSecret: string }> {
    throw new Error(
      "StripePaymentGateway requires a backend route to create PaymentIntent. Wire via paymentGateway.createPaymentIntent()."
    );
  }
}


