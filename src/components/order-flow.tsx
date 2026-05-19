"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Send, ShoppingBag, Wand2 } from "lucide-react";

import { PotatoBuilder3D } from "~/components/potato-builder-3d";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { drinks, flavors, formatCurrency, getIngredient, presets, sizes } from "~/lib/menu";
import { buildOrderSnapshot, useOrderStore } from "~/lib/order-store";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

function PresetCards({ customOnly }: { customOnly: boolean }) {
  const presetId = useOrderStore((state) => state.presetId);
  const selectPreset = useOrderStore((state) => state.selectPreset);

  if (customOnly) {
    return (
      <Card className="border-amber-300/35 bg-amber-300/10">
        <CardContent className="flex items-center gap-3 p-4">
          <Wand2 className="size-5 text-amber-300" />
          <div>
            <p className="font-semibold">Pedido personalizado</p>
            <p className="text-sm text-muted-foreground">
              Arranca con una base y agrega ingredientes a voluntad en la escena 3D.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {presets.map((preset) => {
        const active = preset.id === presetId;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => selectPreset(preset.id)}
            className={cn(
              "rounded-lg border bg-card p-4 text-left shadow-sm transition",
              active
                ? "border-amber-300 ring-2 ring-amber-300/35"
                : "border-border hover:border-amber-300/60",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">{preset.name}</span>
              <span className="size-3 rounded-full" style={{ background: preset.color }} />
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{preset.description}</p>
            <div className="mt-3 text-sm font-medium text-amber-300">
              Desde {formatCurrency(preset.prices.Bolsa)}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SizeFlavorDrinks() {
  const store = useOrderStore();
  const activePreset = presets.find((preset) => preset.id === store.presetId) ?? presets[0]!;

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <Label>Tamano</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {sizes.map((size) => (
            <Button
              key={size}
              className="h-auto min-h-12 flex-col items-start px-3 py-2 text-left"
              onClick={() => store.setSize(size)}
              type="button"
              variant={store.size === size ? "default" : "outline"}
            >
              <span className="text-xs">{size}</span>
              <span className="text-[11px] opacity-75">
                {formatCurrency(activePreset.prices[size])}
              </span>
            </Button>
          ))}
        </div>
      </section>
      <section className="space-y-2">
        <Label>Sabor</Label>
        <div className="grid grid-cols-3 gap-2">
          {flavors.map((flavor) => (
            <Button
              key={flavor.id}
              className="h-11 justify-start gap-2 px-3"
              onClick={() => store.setFlavor(flavor.id)}
              type="button"
              variant={store.flavorId === flavor.id ? "default" : "outline"}
            >
              <span className="size-3 rounded-full" style={{ background: flavor.color }} />
              <span className="truncate text-xs">{flavor.name}</span>
            </Button>
          ))}
        </div>
      </section>
      <section className="space-y-2">
        <Label>Sodas</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {drinks.map((drink) => {
            const active = store.drinkIds.includes(drink.id);

            return (
              <button
                key={drink.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs transition",
                  active
                    ? "border-amber-300 bg-amber-300/15"
                    : "border-border hover:bg-muted",
                )}
                onClick={() => store.toggleDrink(drink.id)}
                type="button"
              >
                {drink.name}
                <span className="block text-muted-foreground">{formatCurrency(drink.price)}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function OrderSummary() {
  const store = useOrderStore();
  const snapshot = buildOrderSnapshot(store);
  const ingredientCounts = snapshot.ingredients.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = (acc[item.id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          Tu orden
          <Badge>{snapshot.etaMinutes} min</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">{snapshot.preset.name}</div>
          <div className="text-3xl font-bold">{formatCurrency(snapshot.total)}</div>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{snapshot.size}</Badge>
          <Badge variant="outline">{snapshot.flavor.name}</Badge>
          {Object.entries(ingredientCounts).map(([id, count]) => {
            const ingredient = getIngredient(id);
            return (
              <Badge key={id} className="gap-1" variant="secondary">
                <span className="size-2 rounded-full" style={{ background: ingredient.color }} />
                {ingredient.shortName}
                {count > 1 ? ` x${count}` : ""}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function OrderFlow({ customOnly = false }: { customOnly?: boolean }) {
  const searchParams = useSearchParams();
  const store = useOrderStore();
  const snapshot = buildOrderSnapshot(store);
  const createOrder = api.orders.create.useMutation();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<null | {
    id: string;
    etaMinutes: number;
    total: number;
  }>(null);

  useEffect(() => {
    const preset = searchParams.get("preset");
    if (preset && presets.some((item) => item.id === preset)) {
      store.selectPreset(preset);
    }
    // Only read the initial URL value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSubmit = customerName.trim().length >= 2 && snapshot.ingredients.length > 0;

  const submitOrder = async () => {
    if (!canSubmit) return;

    const result = await createOrder.mutateAsync({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      presetId: snapshot.preset.id,
      size: snapshot.size,
      flavorId: snapshot.flavor.id,
      ingredientIds: snapshot.ingredients.map((item) => item.id),
      drinkIds: snapshot.drinks.map((drink) => drink.id),
      notes: store.notes,
      queueOrders: store.timing.queueOrders,
    });

    setConfirmedOrder(result);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Inicio
            </Link>
          </Button>
          <Badge variant="outline">{customOnly ? "Personalizado 3D" : "Orden del menu"}</Badge>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos para recibir tu pedido</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nombre</Label>
                <Input
                  id="customerName"
                  placeholder="Tu nombre"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Telefono opcional</Label>
                <Input
                  id="customerPhone"
                  placeholder="Para confirmar si hace falta"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <PresetCards customOnly={customOnly} />
          <SizeFlavorDrinks />
          <PotatoBuilder3D />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-4 space-y-4">
            {confirmedOrder ? (
              <Card className="border-emerald-400/40 bg-emerald-400/10">
                <CardContent className="p-5">
                  <CheckCircle2 className="mb-3 size-8 text-emerald-300" />
                  <h2 className="text-lg font-semibold">Pedido enviado</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Orden {confirmedOrder.id.slice(0, 8)}. Tiempo estimado:{" "}
                    {confirmedOrder.etaMinutes} min.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <OrderSummary />
                <Button
                  className="h-11 w-full"
                  disabled={!canSubmit || createOrder.isPending}
                  onClick={submitOrder}
                >
                  <Send className="size-4" />
                  {createOrder.isPending ? "Enviando..." : "Enviar al local"}
                </Button>
              </>
            )}
          </div>
        </aside>
      </section>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed inset-x-4 bottom-4 z-30 h-12 shadow-2xl lg:hidden">
            <ShoppingBag className="size-4" />
            Ver pedido: {formatCurrency(snapshot.total)}
          </Button>
        </SheetTrigger>
        <SheetContent className="max-h-[90vh] overflow-y-auto" side="bottom">
          <SheetHeader>
            <SheetTitle>Tu pedido</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {confirmedOrder ? (
              <Card className="border-emerald-400/40 bg-emerald-400/10">
                <CardContent className="p-5">
                  <CheckCircle2 className="mb-3 size-8 text-emerald-300" />
                  <h2 className="text-lg font-semibold">Pedido enviado</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Orden {confirmedOrder.id.slice(0, 8)}. Tiempo estimado:{" "}
                    {confirmedOrder.etaMinutes} min.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <OrderSummary />
                <Button
                  className="h-11 w-full"
                  disabled={!canSubmit || createOrder.isPending}
                  onClick={submitOrder}
                >
                  <Send className="size-4" />
                  {createOrder.isPending ? "Enviando..." : "Enviar al local"}
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
