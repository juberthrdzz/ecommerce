"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" };

export default function Button({ className, variant = "primary", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800 focus:ring-black",
    secondary: "bg-white text-black border border-zinc-300 hover:bg-zinc-50 focus:ring-zinc-300",
    ghost: "bg-transparent text-black hover:bg-zinc-100 focus:ring-zinc-200",
  } as const;
  const classes = [base, variants[variant], className].filter(Boolean).join(" ");
  return <button className={classes} {...props} />;
}


