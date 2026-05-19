import { randomUUID } from "node:crypto";
import { z } from "zod";

import { drinks, flavors, getIngredient, presets, sizes } from "~/lib/menu";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const orderStatusSchema = z.enum([
  "DRAFT",
  "RECEIVED",
  "IN_PREP",
  "READY",
  "DELIVERED",
  "CANCELLED",
]);

function quoteOrder(input: {
  presetId: string;
  size: (typeof sizes)[number];
  flavorId: string;
  ingredientIds: string[];
  drinkIds: string[];
  queueOrders: number;
}) {
  const preset = presets.find((item) => item.id === input.presetId) ?? presets[0]!;
  const flavor = flavors.find((item) => item.id === input.flavorId) ?? flavors[0]!;
  const selectedDrinks = drinks.filter((drink) => input.drinkIds.includes(drink.id));
  const ingredientSeconds = input.ingredientIds.reduce(
    (sum, id) => sum + getIngredient(id).prepSeconds,
    0,
  );
  const extras = input.ingredientIds.reduce((sum, id, index) => {
    const includedCount = preset.includedIngredientIds.filter((item) => item === id).length;
    const previousCount = input.ingredientIds.slice(0, index).filter((item) => item === id).length;

    return sum + (previousCount >= includedCount ? getIngredient(id).price : 0);
  }, 0);
  const drinkTotal = selectedDrinks.reduce((sum, drink) => sum + drink.price, 0);
  const etaMinutes = Math.ceil(
    (240 + ingredientSeconds + input.ingredientIds.length * 18 + flavor.prepSeconds) / 60 +
      input.queueOrders * 2.5,
  );

  return {
    preset,
    flavor,
    selectedDrinks,
    total: preset.prices[input.size] + extras + drinkTotal,
    etaMinutes,
  };
}

function countItems(ids: string[]) {
  return Object.entries(
    ids.reduce<Record<string, number>>((acc, id) => {
      acc[id] = (acc[id] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([id, quantity]) => ({ id, quantity }));
}

export const ordersRouter = createTRPCRouter({
  menu: publicProcedure.query(() => ({
    presets,
    flavors,
    drinks,
    sizes,
  })),

  quote: publicProcedure
    .input(
      z.object({
        presetId: z.string(),
        size: z.enum(sizes),
        flavorId: z.string(),
        ingredientIds: z.array(z.string()),
        drinkIds: z.array(z.string()),
        queueOrders: z.number().int().min(0).max(50),
      }),
    )
    .query(({ input }) => quoteOrder(input)),

  create: publicProcedure
    .input(
      z.object({
        customerName: z.string().min(2).max(80),
        customerPhone: z.string().max(30).optional(),
        presetId: z.string(),
        size: z.enum(sizes),
        flavorId: z.string(),
        ingredientIds: z.array(z.string()).min(1),
        drinkIds: z.array(z.string()),
        notes: z.string().max(300).optional(),
        queueOrders: z.number().int().min(0).max(50).default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const quote = quoteOrder(input);
      const orderId = randomUUID();
      const now = new Date();

      await ctx.db.$transaction(async (tx) => {
        await tx.$executeRaw`
          INSERT INTO "Order" (
            "id", "customerName", "customerPhone", "presetId", "presetName", "size",
            "flavorId", "flavorName", "notes", "totalCents", "etaMinutes", "status",
            "createdAt", "updatedAt"
          )
          VALUES (
            ${orderId}, ${input.customerName}, ${input.customerPhone ?? null},
            ${quote.preset.id}, ${quote.preset.name}, ${input.size},
            ${quote.flavor.id}, ${quote.flavor.name}, ${input.notes ?? ""},
            ${Math.round(quote.total * 100)}, ${quote.etaMinutes}, ${"RECEIVED"},
            ${now}, ${now}
          )
        `;

        for (const item of countItems(input.ingredientIds)) {
          const ingredient = getIngredient(item.id);
          await tx.$executeRaw`
            INSERT INTO "OrderItem" ("id", "orderId", "ingredientId", "name", "quantity", "priceCents")
            VALUES (
              ${randomUUID()}, ${orderId}, ${ingredient.id}, ${ingredient.name},
              ${item.quantity}, ${Math.round(ingredient.price * 100)}
            )
          `;
        }

        for (const item of countItems(input.drinkIds)) {
          const drink = drinks.find((entry) => entry.id === item.id);
          if (!drink) continue;

          await tx.$executeRaw`
            INSERT INTO "OrderDrink" ("id", "orderId", "drinkId", "name", "quantity", "priceCents")
            VALUES (
              ${randomUUID()}, ${orderId}, ${drink.id}, ${drink.name},
              ${item.quantity}, ${Math.round(drink.price * 100)}
            )
          `;
        }
      });

      return {
        id: orderId,
        etaMinutes: quote.etaMinutes,
        total: quote.total,
      };
    }),

  pending: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.$queryRaw<
      Array<{
        id: string;
        customerName: string | null;
        customerPhone: string | null;
        presetName: string;
        size: string;
        flavorName: string;
        notes: string;
        totalCents: number;
        etaMinutes: number;
        status: string;
        createdAt: Date;
      }>
    >`
      SELECT "id", "customerName", "customerPhone", "presetName", "size", "flavorName",
        "notes", "totalCents", "etaMinutes", "status", "createdAt"
      FROM "Order"
      WHERE "status" IN ('RECEIVED', 'IN_PREP', 'READY')
      ORDER BY "createdAt" ASC
      LIMIT 50
    `;

    return rows.map((row) => ({
      ...row,
      total: row.totalCents / 100,
    }));
  }),

  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: orderStatusSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$executeRaw`
        UPDATE "Order"
        SET "status" = ${input.status}, "updatedAt" = ${new Date()}
        WHERE "id" = ${input.id}
      `;

      return { ok: true };
    }),
});
