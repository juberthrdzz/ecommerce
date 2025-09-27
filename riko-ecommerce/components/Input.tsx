"use client";
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string };

export default function Input({ label, hint, className, id, ...props }: Props) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  return (
    <div className={["flex flex-col gap-1", className].filter(Boolean).join(" ")}>
      {label && (
        <label htmlFor={inputId} className="text-sm text-zinc-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black"
        {...props}
      />
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}


