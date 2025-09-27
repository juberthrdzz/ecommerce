type PaymentProvider = "mock" | "stripe";
type OrderGatewayType = "mock" | "http";

function getBoolean(key: string, fallback = false): boolean {
  const v = process.env[key];
  if (v === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(String(v).toLowerCase());
}

export const env = {
  NEXT_PUBLIC_CURRENCY: (process.env.NEXT_PUBLIC_CURRENCY === "USD" ? "USD" : "MXN") as "MXN" | "USD",
  PAYMENT_PROVIDER: (process.env.PAYMENT_PROVIDER === "stripe" ? "stripe" : "mock") as PaymentProvider,
  ORDER_GATEWAY: (process.env.ORDER_GATEWAY === "http" ? "http" : "mock") as OrderGatewayType,
  ORDER_HTTP_BASE_URL: process.env.ORDER_HTTP_BASE_URL || "",
  REQUIRE_AUTH_BEFORE_PAYMENT: getBoolean("REQUIRE_AUTH_BEFORE_PAYMENT", true),
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || "",
} as const;


