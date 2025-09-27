export function formatCurrency(amount: number, currency: "MXN" | "USD" = "MXN", locale = "es-MX"): string {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}


