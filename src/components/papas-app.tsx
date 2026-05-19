"use client";

import {
  Clock,
  Flame,
  ReceiptText,
  Send,
  Settings2,
  ShoppingBag,
  Store,
  Utensils,
} from "lucide-react";
import { motion } from "framer-motion";

import { PotatoBuilder3D } from "~/components/potato-builder-3d";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Slider } from "~/components/ui/slider";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { drinks, flavors, formatCurrency, getIngredient, presets, sizes } from "~/lib/menu";
import { buildOrderSnapshot, useOrderStore } from "~/lib/order-store";
import { cn } from "~/lib/utils";

function PresetPicker() {
  const presetId = useOrderStore((state) => state.presetId);
  const selectPreset = useOrderStore((state) => state.selectPreset);

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-3 p-1">
        {presets.map((preset) => {
          const active = preset.id === presetId;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => selectPreset(preset.id)}
              className={cn(
                "min-w-[210px] rounded-lg border bg-card p-3 text-left shadow-sm transition",
                active
                  ? "border-amber-300 ring-2 ring-amber-300/40"
                  : "border-border hover:border-amber-300/60",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{preset.name}</span>
                <span
                  aria-hidden
                  className="size-3 rounded-full"
                  style={{ backgroundColor: preset.color }}
                />
              </div>
              <p className="mt-2 line-clamp-2 whitespace-normal text-xs text-muted-foreground">
                {preset.description}
              </p>
              <div className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-300">
                Desde {formatCurrency(preset.prices.Bolsa)}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function SizeAndFlavorPicker() {
  const state = useOrderStore();
  const activePreset = presets.find((preset) => preset.id === state.presetId) ?? presets[0]!;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <section className="space-y-2">
        <Label>Tamano</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {sizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant={state.size === size ? "default" : "outline"}
              className="h-auto min-h-12 flex-col items-start px-3 py-2 text-left"
              onClick={() => state.setSize(size)}
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
              type="button"
              variant={state.flavorId === flavor.id ? "default" : "outline"}
              className="h-12 justify-start gap-2 px-3"
              onClick={() => state.setFlavor(flavor.id)}
            >
              <span
                aria-hidden
                className="size-3 rounded-full"
                style={{ backgroundColor: flavor.color }}
              />
              <span className="min-w-0 truncate text-xs">{flavor.name}</span>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}

function OrderSummary({ compact = false }: { compact?: boolean }) {
  const store = useOrderStore();
  const snapshot = buildOrderSnapshot(store);
  const ingredientCounts = snapshot.ingredients.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = (acc[item.id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ReceiptText className="size-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatCurrency(snapshot.total)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="size-4" />
              Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{snapshot.etaMinutes} min</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{snapshot.preset.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{snapshot.size}</Badge>
            <Badge variant="outline">{snapshot.flavor.name}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-40 overflow-y-auto pr-1">
            {Object.entries(ingredientCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                La charola esta lista para personalizar.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.entries(ingredientCounts).map(([id, count]) => {
                  const ingredient = getIngredient(id);

                  return (
                    <Badge key={id} className="gap-1" variant="secondary">
                      <span
                        aria-hidden
                        className="size-2 rounded-full"
                        style={{ backgroundColor: ingredient.color }}
                      />
                      {ingredient.shortName}
                      {count > 1 ? ` x${count}` : ""}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {!compact && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="notes">Notas del cliente</Label>
                <Input
                  id="notes"
                  placeholder="Ej. poca salsa, sin limon, extra crujiente"
                  value={store.notes}
                  onChange={(event) => store.setNotes(event.target.value)}
                />
              </div>
            </>
          )}

          <Separator />
          <div className="space-y-2">
            <Label>Sodas</Label>
            <div className="grid grid-cols-2 gap-2">
              {drinks.map((drink) => {
                const active = store.drinkIds.includes(drink.id);

                return (
                  <button
                    key={drink.id}
                    type="button"
                    onClick={() => store.toggleDrink(drink.id)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-xs transition",
                      active
                        ? "border-amber-300 bg-amber-300/15 text-foreground"
                        : "border-border hover:bg-muted",
                    )}
                  >
                    {drink.name}
                    <span className="block text-muted-foreground">
                      {formatCurrency(drink.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MobileOrderSheet() {
  const snapshot = buildOrderSnapshot(useOrderStore());

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed inset-x-4 bottom-4 z-30 h-12 shadow-2xl lg:hidden">
          <ShoppingBag className="size-4" />
          Ver pedido: {formatCurrency(snapshot.total)}
        </Button>
      </SheetTrigger>
      <SheetContent className="max-h-[90vh] overflow-y-auto" side="bottom">
        <SheetHeader>
          <SheetTitle>Tu orden</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <OrderSummary />
          <Button className="mt-4 h-11 w-full">
            <Send className="size-4" />
            Enviar al local
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function VendorBoard() {
  const snapshot = buildOrderSnapshot(useOrderStore());
  const progress = Math.min(92, Math.max(18, 100 - snapshot.etaMinutes * 3));

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="size-5" />
            Orden entrante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Cliente app movil</p>
              <p className="text-xs text-muted-foreground">Pedido configurado en 3D</p>
            </div>
            <Badge className="bg-amber-300 text-stone-950">RECIBIDA</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Tiempo restante</span>
              <span className="font-medium">{snapshot.etaMinutes} min</span>
            </div>
            <Progress value={progress} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-muted p-3">
              <span className="text-muted-foreground">Total</span>
              <strong className="block text-lg">{formatCurrency(snapshot.total)}</strong>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <span className="text-muted-foreground">Tamano</span>
              <strong className="block text-lg">{snapshot.size}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="size-5" />
            Detalle de preparacion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingrediente</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Tiempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshot.ingredients.map((item) => {
                const ingredient = getIngredient(item.id);

                return (
                  <TableRow key={item.instanceId}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell>{ingredient.category}</TableCell>
                    <TableCell className="text-right">{ingredient.prepSeconds}s</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminTimingPanel() {
  const store = useOrderStore();
  const snapshot = buildOrderSnapshot(store);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="size-5" />
            Tiempos configurables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Base por pedido</Label>
              <Badge variant="outline">{Math.round(store.timing.baseSeconds / 60)} min</Badge>
            </div>
            <Slider
              max={720}
              min={120}
              step={30}
              value={[store.timing.baseSeconds]}
              onValueChange={([value]) => store.setBaseSeconds(value ?? 240)}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Por ingrediente</Label>
              <Badge variant="outline">{store.timing.perIngredientSeconds}s</Badge>
            </div>
            <Slider
              max={60}
              min={5}
              step={1}
              value={[store.timing.perIngredientSeconds]}
              onValueChange={([value]) => store.setPerIngredientSeconds(value ?? 18)}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Pedidos en fila</Label>
              <Badge variant="outline">{store.timing.queueOrders}</Badge>
            </div>
            <Slider
              max={20}
              min={0}
              step={1}
              value={[store.timing.queueOrders]}
              onValueChange={([value]) => store.setQueueOrders(value ?? 0)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label>Modo hora pico</Label>
              <p className="text-xs text-muted-foreground">
                Listo para conectar reglas por horario.
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado actual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">ETA calculado</p>
            <p className="mt-1 text-4xl font-semibold">{snapshot.etaMinutes} min</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Formula: base + tiempos de ingredientes + ajuste por tamano + fila del local. El admin
            puede calibrarla segun criterio y carga real.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                Ver payload para tRPC
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Payload de orden</DialogTitle>
              </DialogHeader>
              <pre className="max-h-[420px] overflow-auto rounded-lg bg-muted p-3 text-xs">
                {JSON.stringify(
                  {
                    presetId: snapshot.preset.id,
                    size: snapshot.size,
                    flavorId: snapshot.flavor.id,
                    ingredientIds: snapshot.ingredients.map((item) => item.id),
                    drinkIds: snapshot.drinks.map((drink) => drink.id),
                    etaMinutes: snapshot.etaMinutes,
                    total: snapshot.total,
                  },
                  null,
                  2,
                )}
              </pre>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

export function PapasApp() {
  const snapshot = buildOrderSnapshot(useOrderStore());

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Badge className="mb-2 gap-1" variant="outline">
            <Flame className="size-3.5 text-amber-500" />
            Papas caseras con todo el sabor
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">El Wero Papas</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Constructor 3D responsive para pedidos personalizados, recepcion del vendedor y tiempos
            configurables para admin.
          </p>
        </div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-card p-3 text-sm shadow-sm"
          initial={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45 }}
        >
          <span className="text-muted-foreground">Pedido</span>
          <strong className="text-right">{formatCurrency(snapshot.total)}</strong>
          <span className="text-muted-foreground">Entrega</span>
          <strong className="text-right">{snapshot.etaMinutes} min</strong>
        </motion.div>
      </header>

      <Tabs className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6" defaultValue="cliente">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="vendedor">Vendedor</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent className="mt-4 space-y-4" value="cliente">
          <PresetPicker />
          <SizeAndFlavorPicker />
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <PotatoBuilder3D />
            <aside className="hidden lg:block">
              <div className="sticky top-4 space-y-4">
                <OrderSummary />
                <Button className="h-11 w-full">
                  <Send className="size-4" />
                  Enviar al local
                </Button>
              </div>
            </aside>
          </div>
          <MobileOrderSheet />
        </TabsContent>

        <TabsContent className="mt-4" value="vendedor">
          <VendorBoard />
        </TabsContent>

        <TabsContent className="mt-4" value="admin">
          <AdminTimingPanel />
        </TabsContent>
      </Tabs>
    </main>
  );
}
