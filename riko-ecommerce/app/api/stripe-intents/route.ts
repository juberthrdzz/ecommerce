import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  if (!env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  const body = await req.json().catch(() => ({} as any));
  const amount = Number(body?.amount);
  const currency: "mxn" | "usd" = String(body?.currency || "mxn").toLowerCase() === "usd" ? "usd" : "mxn";
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  try {
    const intent = await stripe.paymentIntents.create({ amount, currency, automatic_payment_methods: { enabled: true } });
    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


