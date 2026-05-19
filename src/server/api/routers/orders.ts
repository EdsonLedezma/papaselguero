import { z } from "zod";

import { drinks, flavors, getIngredient, presets, sizes } from "~/lib/menu";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
    .query(({ input }) => {
      const preset = presets.find((item) => item.id === input.presetId) ?? presets[0]!;
      const flavor = flavors.find((item) => item.id === input.flavorId) ?? flavors[0]!;
      const selectedDrinks = drinks.filter((drink) => input.drinkIds.includes(drink.id));
      const ingredientSeconds = input.ingredientIds.reduce(
        (sum, id) => sum + getIngredient(id).prepSeconds,
        0,
      );
      const extras = input.ingredientIds.reduce((sum, id, index) => {
        const includedCount = preset.includedIngredientIds.filter((item) => item === id).length;
        const previousCount = input.ingredientIds.slice(0, index).filter((item) => item === id)
          .length;

        return sum + (previousCount >= includedCount ? getIngredient(id).price : 0);
      }, 0);
      const drinkTotal = selectedDrinks.reduce((sum, drink) => sum + drink.price, 0);
      const etaMinutes = Math.ceil(
        (240 + ingredientSeconds + input.ingredientIds.length * 18 + flavor.prepSeconds) / 60 +
          input.queueOrders * 2.5,
      );

      return {
        total: preset.prices[input.size] + extras + drinkTotal,
        etaMinutes,
      };
    }),
});
