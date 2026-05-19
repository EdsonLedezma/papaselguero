import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Store, Utensils } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { presets, formatCurrency } from "~/lib/menu";

export function HomePage() {
  const featured = presets.slice(1, 5);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border bg-[#130d0a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(246,185,67,0.28),transparent_34%),radial-gradient(circle_at_20%_78%,rgba(225,75,43,0.20),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative mx-auto grid min-h-[92svh] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div className="max-w-2xl">
            <Badge className="mb-5 border-amber-300/40 bg-amber-300/10 text-amber-100" variant="outline">
              <Sparkles className="size-3.5" />
              Papas caseras con todo el sabor
            </Badge>
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl">
              El Wero
              <span className="block text-amber-300">Papas</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              Ordena desde tu cel, elige una receta del menu o arma tu charola en 3D con salsas,
              toppings y extras. El local recibe el pedido con tiempo estimado y detalle completo.
            </p>
            <div className="mt-8 grid gap-3 sm:flex">
              <Button asChild className="h-12 px-5 text-base">
                <Link href="/ordenar">
                  Ordenar del menu
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 border-white/20 bg-white/10 px-5 text-base text-white hover:bg-white/15"
                variant="outline"
              >
                <Link href="/ordenar/personalizado">
                  Crear pedido personalizado
                  <Utensils className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-white">
              <div className="rounded-lg border border-white/10 bg-white/8 p-3">
                <Clock className="mb-2 size-4 text-amber-300" />
                <div className="text-sm font-semibold">ETA calculado</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/8 p-3">
                <Store className="mb-2 size-4 text-amber-300" />
                <div className="text-sm font-semibold">Orden al local</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/8 p-3">
                <Sparkles className="mb-2 size-4 text-amber-300" />
                <div className="text-sm font-semibold">3D interactivo</div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[620px]">
            <div className="absolute inset-x-0 bottom-0 mx-auto h-[68%] max-w-[760px] rounded-[42px] bg-black/35 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur" />
            <div className="absolute left-1/2 top-[52%] h-56 w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-black shadow-[inset_0_16px_34px_rgba(255,255,255,0.08),0_34px_80px_rgba(0,0,0,0.65)] sm:h-72" />
            <div className="absolute left-[18%] top-[33%] h-24 w-24 rounded-full bg-amber-500 shadow-[0_10px_28px_rgba(245,158,11,0.45)]" />
            <div className="absolute left-[31%] top-[26%] h-28 w-32 rounded-[45%] bg-orange-500 shadow-[0_12px_35px_rgba(249,115,22,0.5)]" />
            <div className="absolute left-[45%] top-[28%] h-24 w-40 rounded-[40%] bg-red-600 shadow-[0_12px_38px_rgba(220,38,38,0.45)]" />
            <div className="absolute left-[55%] top-[43%] h-20 w-44 rounded-[38%] bg-yellow-400 shadow-[0_12px_36px_rgba(250,204,21,0.38)]" />
            <div className="absolute left-[30%] top-[47%] h-20 w-56 rotate-[-8deg] rounded-full bg-stone-700 shadow-[0_10px_32px_rgba(87,83,78,0.5)]" />
            <div className="absolute left-[63%] top-[18%] h-24 w-14 rotate-[18deg] rounded-xl bg-[#6d341e] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <div className="mx-auto mt-3 h-10 w-9 rounded-md bg-amber-300/80" />
            </div>
            <div className="absolute bottom-8 left-1/2 w-[76%] -translate-x-1/2 rounded-xl border border-white/10 bg-black/70 p-4 text-white shadow-2xl backdrop-blur">
              <div className="text-sm font-semibold text-amber-200">Charola Wera lista</div>
              <div className="mt-1 text-xs text-white/60">
                Papas, queso, salsa, crema, carne seca, chamoy y extras.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Favoritas del menu</h2>
            <p className="text-sm text-muted-foreground">Recetas listas para pedir o usar como base.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {featured.map((preset) => (
            <Card key={preset.id}>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">{preset.name}</h3>
                  <span className="size-3 rounded-full" style={{ background: preset.color }} />
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{preset.description}</p>
                <Button asChild className="mt-4 w-full" variant="secondary">
                  <Link href={`/ordenar?preset=${preset.id}`}>
                    Desde {formatCurrency(preset.prices.Bolsa)}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
