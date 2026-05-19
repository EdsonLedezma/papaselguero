import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Store, Utensils } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { presets, formatCurrency } from "~/lib/menu";

const heroPotatoes = [
  [
    "left-[17%]",
    "top-[34%]",
    "h-12",
    "w-16",
    "rotate-[-18deg]",
    "bg-[#d88731]",
  ],
  ["left-[25%]", "top-[30%]", "h-14", "w-20", "rotate-[12deg]", "bg-[#efad43]"],
  ["left-[37%]", "top-[33%]", "h-12", "w-16", "rotate-[26deg]", "bg-[#c8782f]"],
  ["left-[48%]", "top-[31%]", "h-14", "w-20", "rotate-[-8deg]", "bg-[#e89933]"],
  ["left-[60%]", "top-[36%]", "h-12", "w-16", "rotate-[16deg]", "bg-[#d58a37]"],
  [
    "left-[29%]",
    "top-[45%]",
    "h-12",
    "w-16",
    "rotate-[-32deg]",
    "bg-[#f0b24a]",
  ],
  ["left-[42%]", "top-[47%]", "h-14", "w-20", "rotate-[10deg]", "bg-[#d28132]"],
  [
    "left-[55%]",
    "top-[49%]",
    "h-12",
    "w-16",
    "rotate-[-14deg]",
    "bg-[#eda842]",
  ],
  ["left-[67%]", "top-[47%]", "h-12", "w-16", "rotate-[24deg]", "bg-[#c8792d]"],
];

const heroCarne = [
  ["left-[23%]", "top-[23%]", "rotate-[-22deg]"],
  ["left-[29%]", "top-[20%]", "rotate-[12deg]"],
  ["left-[36%]", "top-[22%]", "rotate-[-8deg]"],
  ["left-[44%]", "top-[21%]", "rotate-[18deg]"],
];

const heroShrimp = [
  ["left-[61%]", "top-[25%]", "rotate-[28deg]"],
  ["left-[68%]", "top-[31%]", "rotate-[-16deg]"],
  ["left-[57%]", "top-[41%]", "rotate-[8deg]"],
];

const heroPico = [
  ["left-[34%]", "top-[40%]", "bg-red-500"],
  ["left-[38%]", "top-[37%]", "bg-lime-500"],
  ["left-[45%]", "top-[41%]", "bg-white"],
  ["left-[50%]", "top-[39%]", "bg-red-600"],
  ["left-[58%]", "top-[42%]", "bg-lime-400"],
  ["left-[63%]", "top-[38%]", "bg-white"],
];

export function HomePage() {
  const featured = presets.slice(1, 5);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="border-border relative overflow-hidden border-b bg-[#130d0a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(246,185,67,0.28),transparent_34%),radial-gradient(circle_at_20%_78%,rgba(225,75,43,0.20),transparent_30%)]" />
        <div className="absolute inset-0 [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] [background-size:44px_44px] opacity-[0.08]" />

        <div className="relative mx-auto grid min-h-[92svh] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div className="max-w-2xl">
            <Badge
              className="mb-5 border-amber-300/40 bg-amber-300/10 text-amber-100"
              variant="outline"
            >
              <Sparkles className="size-3.5" />
              Papas caseras con todo el sabor
            </Badge>
            <h1 className="text-5xl leading-[0.95] font-black tracking-tight text-white sm:text-7xl">
              El Wero
              <span className="block text-amber-300">Papas</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              Ordena desde tu cel, elige una receta del menu o arma tu charola
              en 3D con salsas, toppings y extras. El local recibe el pedido con
              tiempo estimado y detalle completo.
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
            <div className="absolute top-[52%] left-1/2 h-56 w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-[#050505] shadow-[inset_0_16px_34px_rgba(255,255,255,0.08),0_34px_80px_rgba(0,0,0,0.65)] sm:h-72">
              <div className="absolute inset-[9%] rounded-[24px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.10),transparent_54%)]" />
              <div className="absolute inset-x-[9%] top-[40%] h-10 rounded-full bg-[#f7c533] opacity-95 blur-[2px]" />
              <div className="absolute top-[31%] left-[38%] h-14 w-[34%] rotate-[8deg] rounded-full bg-[#d73922] shadow-[0_12px_26px_rgba(215,57,34,0.32)]" />
              <div className="absolute top-[38%] left-[27%] h-10 w-[32%] rotate-[-10deg] rounded-full bg-[#fff0cc] opacity-95" />
              <div className="absolute top-[43%] left-[56%] h-12 w-[30%] rotate-[-8deg] rounded-full bg-[#f29c24] opacity-90 blur-[1px]" />
            </div>
            {heroPotatoes.map(
              ([left, top, height, width, rotate, color], index) => (
                <div
                  className={`absolute ${left} ${top} ${height} ${width} ${rotate} ${color} rounded-[48%] shadow-[inset_-10px_-9px_14px_rgba(84,45,15,0.28),inset_8px_8px_12px_rgba(255,224,126,0.32),0_10px_24px_rgba(0,0,0,0.28)]`}
                  key={`hero-potato-${index}`}
                >
                  <span className="absolute top-[28%] left-[28%] size-1.5 rounded-full bg-[#7d461e]/55" />
                  <span className="absolute top-[52%] right-[24%] size-1 rounded-full bg-[#7d461e]/50" />
                  <span className="absolute bottom-[24%] left-[48%] size-1 rounded-full bg-[#fff0b0]/65" />
                </div>
              ),
            )}
            {heroCarne.map(([left, top, rotate], index) => (
              <div
                className={`absolute ${left} ${top} h-7 w-28 ${rotate} rounded-[14px] bg-[#58291c] shadow-[inset_0_5px_8px_rgba(255,160,86,0.26),0_10px_22px_rgba(0,0,0,0.34)]`}
                key={`hero-carne-${index}`}
              >
                <span className="absolute top-2 left-4 h-1.5 w-16 rounded-full bg-[#a65a35]/70" />
              </div>
            ))}
            {heroShrimp.map(([left, top, rotate], index) => (
              <div
                className={`absolute ${left} ${top} h-14 w-16 ${rotate} rounded-[50%] border-[10px] border-[#f18c65] border-l-transparent shadow-[0_10px_22px_rgba(0,0,0,0.28)]`}
                key={`hero-shrimp-${index}`}
              >
                <span className="absolute top-4 -right-2 size-5 rounded-full bg-[#ffd0a7]" />
              </div>
            ))}
            {heroPico.map(([left, top, color], index) => (
              <div
                className={`absolute ${left} ${top} ${color} size-3 rotate-45 rounded-[3px] shadow-[0_5px_10px_rgba(0,0,0,0.28)]`}
                key={`hero-pico-${index}`}
              />
            ))}
            <div className="absolute top-[19%] left-[72%] h-24 w-14 rotate-[18deg] rounded-xl bg-[#6d341e] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <div className="mx-auto mt-3 h-10 w-9 rounded-md bg-amber-300/80" />
              <div className="mx-auto mt-2 h-4 w-8 rounded bg-[#22140f]" />
            </div>
            <div className="absolute top-[53%] left-[17%] h-16 w-9 -rotate-[22deg] overflow-hidden rounded-t-full rounded-bl-full border-4 border-[#b5cf35] bg-[#f4ff94] shadow-[0_10px_18px_rgba(0,0,0,0.25)]">
              <span className="absolute inset-x-1 top-1/2 border-t border-[#a8bf2e]" />
              <span className="absolute top-0 left-1/2 h-full border-l border-[#a8bf2e]" />
            </div>
            <div className="absolute bottom-8 left-1/2 w-[76%] -translate-x-1/2 rounded-xl border border-white/10 bg-black/70 p-4 text-white shadow-2xl backdrop-blur">
              <div className="text-sm font-semibold text-amber-200">
                Charola Wera lista
              </div>
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
            <p className="text-muted-foreground text-sm">
              Recetas listas para pedir o usar como base.
            </p>
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
                  <span
                    className="size-3 rounded-full"
                    style={{ background: preset.color }}
                  />
                </div>
                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {preset.description}
                </p>
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
