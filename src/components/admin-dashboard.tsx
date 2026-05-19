"use client";

import Link from "next/link";
import { ArrowLeft, Check, Clock, RefreshCw, Store } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { formatCurrency } from "~/lib/menu";
import { api } from "~/trpc/react";

const nextStatus = {
  RECEIVED: "IN_PREP",
  IN_PREP: "READY",
  READY: "DELIVERED",
} as const;

const statusLabel = {
  RECEIVED: "Pendiente",
  IN_PREP: "En preparacion",
  READY: "Lista",
  DELIVERED: "Entregada",
  CANCELLED: "Cancelada",
  DRAFT: "Borrador",
} as const;

export function AdminDashboard() {
  const utils = api.useUtils();
  const orders = api.orders.pending.useQuery(undefined, {
    refetchInterval: 15000,
  });
  const updateStatus = api.orders.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.orders.pending.invalidate();
    },
  });

  const pendingCount = orders.data?.filter((order) => order.status === "RECEIVED").length ?? 0;
  const prepCount = orders.data?.filter((order) => order.status === "IN_PREP").length ?? 0;
  const readyCount = orders.data?.filter((order) => order.status === "READY").length ?? 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Inicio
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Panel del local</h1>
              <p className="text-sm text-muted-foreground">
                Pedidos pendientes, preparacion y entrega.
              </p>
            </div>
          </div>
          <Button onClick={() => orders.refetch()} variant="outline">
            <RefreshCw className="size-4" />
            Actualizar
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6">
        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-3xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="size-8 text-amber-300" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">En preparacion</p>
                <p className="text-3xl font-bold">{prepCount}</p>
              </div>
              <Store className="size-8 text-orange-300" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Listas</p>
                <p className="text-3xl font-bold">{readyCount}</p>
              </div>
              <Check className="size-8 text-emerald-300" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos activos</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando pedidos...</p>
            ) : orders.isError ? (
              <p className="text-sm text-destructive">
                No se pudieron cargar pedidos. Revisa DATABASE_URL y migraciones.
              </p>
            ) : !orders.data?.length ? (
              <p className="text-sm text-muted-foreground">No hay pedidos pendientes.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Tiempo</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Accion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.data.map((order) => {
                      const status = order.status as keyof typeof statusLabel;
                      const next = nextStatus[status as keyof typeof nextStatus];

                      return (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div className="font-medium">{order.customerName ?? "Cliente"}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.customerPhone ?? "Sin telefono"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{order.presetName}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.size} / {order.flavorName}
                            </div>
                            {order.notes ? (
                              <div className="mt-1 text-xs text-amber-300">{order.notes}</div>
                            ) : null}
                          </TableCell>
                          <TableCell>{order.etaMinutes} min</TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            <Badge variant={status === "READY" ? "default" : "secondary"}>
                              {statusLabel[status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {next ? (
                              <Button
                                disabled={updateStatus.isPending}
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: order.id,
                                    status: next,
                                  })
                                }
                                size="sm"
                              >
                                Avanzar
                              </Button>
                            ) : (
                              <Badge variant="outline">Cerrado</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
