"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-4 py-12">Cargando…</main>}>
      <SignInInner />
    </Suspense>
  );
}

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = (params && params.get("next")) || "/";
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    signIn(email);
    router.push(nextPath);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-xl font-semibold">Iniciar sesión</h1>
      <div className="mb-4 space-y-2">
        <Button disabled className="w-full" title="Conectar proveedor después">Google</Button>
        <Button disabled className="w-full" title="Conectar proveedor después">Apple</Button>
      </div>
      <div className="mb-3 text-center text-xs uppercase text-zinc-500">o</div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input type="email" label="Correo" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" className="w-full">Continuar</Button>
      </form>
    </main>
  );
}


