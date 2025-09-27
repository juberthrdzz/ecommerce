import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riko Ecommerce",
  description: "Restaurant ordering demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-zinc-900 antialiased">{children}</body>
    </html>
  );
}


