"use client";

import { create } from "zustand";
import {
  drinks,
  flavors,
  getIngredient,
  ingredients,
  presets,
  type Drink,
  type Flavor,
  type MenuPreset,
  type MenuSize,
} from "~/lib/menu";

export type DroppedIngredient = {
  id: string;
  instanceId: string;
  droppedAt: number;
};

export type TimingConfig = {
  baseSeconds: number;
  perIngredientSeconds: number;
  sizeMultiplier: Record<MenuSize, number>;
  queueOrders: number;
  queueSeconds: number;
};

export type OrderSnapshot = {
  preset: MenuPreset;
  size: MenuSize;
  flavor: Flavor;
  ingredients: DroppedIngredient[];
  drinks: Drink[];
  notes: string;
  total: number;
  etaMinutes: number;
};

type OrderStore = {
  presetId: string;
  size: MenuSize;
  flavorId: string;
  droppedIngredients: DroppedIngredient[];
  drinkIds: string[];
  notes: string;
  timing: TimingConfig;
  selectPreset: (presetId: string) => void;
  setSize: (size: MenuSize) => void;
  setFlavor: (flavorId: string) => void;
  addIngredient: (ingredientId: string) => void;
  removeIngredient: (instanceId: string) => void;
  clearIngredients: () => void;
  toggleDrink: (drinkId: string) => void;
  setNotes: (notes: string) => void;
  setQueueOrders: (queueOrders: number) => void;
  setBaseSeconds: (baseSeconds: number) => void;
  setPerIngredientSeconds: (perIngredientSeconds: number) => void;
};

const defaultTiming: TimingConfig = {
  baseSeconds: 240,
  perIngredientSeconds: 18,
  sizeMultiplier: {
    Bolsa: 0.75,
    "Medio litro": 0.9,
    Litro: 1,
    "Media charola": 1.35,
    "Charola completa": 1.75,
  },
  queueOrders: 3,
  queueSeconds: 150,
};

export const useOrderStore = create<OrderStore>((set) => ({
  presetId: "triguenas",
  size: "Litro",
  flavorId: "natural",
  droppedIngredients:
    presets
      .find((preset) => preset.id === "triguenas")
      ?.includedIngredientIds.map((id, index) => ({
        id,
        instanceId: `initial-${id}-${index}`,
        droppedAt: index * 55,
      })) ?? [],
  drinkIds: [],
  notes: "",
  timing: defaultTiming,
  selectPreset: (presetId) => {
    const preset = presets.find((item) => item.id === presetId);

    set({
      presetId,
      droppedIngredients:
        preset?.includedIngredientIds.map((id, index) => ({
          id,
          instanceId: `${id}-${Date.now()}-${index}`,
          droppedAt: index * 55,
        })) ?? [],
    });
  },
  setSize: (size) => set({ size }),
  setFlavor: (flavorId) => set({ flavorId }),
  addIngredient: (ingredientId) => {
    set((state) => ({
      droppedIngredients: [
        ...state.droppedIngredients,
        {
          id: ingredientId,
          instanceId: `${ingredientId}-${Date.now()}-${state.droppedIngredients.length}`,
          droppedAt: Date.now(),
        },
      ],
    }));
  },
  removeIngredient: (instanceId) =>
    set((state) => ({
      droppedIngredients: state.droppedIngredients.filter(
        (ingredient) => ingredient.instanceId !== instanceId,
      ),
    })),
  clearIngredients: () => set({ droppedIngredients: [] }),
  toggleDrink: (drinkId) =>
    set((state) => ({
      drinkIds: state.drinkIds.includes(drinkId)
        ? state.drinkIds.filter((id) => id !== drinkId)
        : [...state.drinkIds, drinkId],
    })),
  setNotes: (notes) => set({ notes }),
  setQueueOrders: (queueOrders) =>
    set((state) => ({
      timing: { ...state.timing, queueOrders },
    })),
  setBaseSeconds: (baseSeconds) =>
    set((state) => ({
      timing: { ...state.timing, baseSeconds },
    })),
  setPerIngredientSeconds: (perIngredientSeconds) =>
    set((state) => ({
      timing: { ...state.timing, perIngredientSeconds },
    })),
}));

export function buildOrderSnapshot(state: OrderStore): OrderSnapshot {
  const preset = presets.find((item) => item.id === state.presetId) ?? presets[0]!;
  const flavor = flavors.find((item) => item.id === state.flavorId) ?? flavors[0]!;
  const selectedDrinks = drinks.filter((drink) => state.drinkIds.includes(drink.id));
  const extraTotal = state.droppedIngredients.reduce((sum, dropped, index) => {
    const ingredient = getIngredient(dropped.id);
    const includedCount = preset.includedIngredientIds.filter((id) => id === dropped.id).length;
    const selectedBefore = state.droppedIngredients
      .slice(0, index)
      .filter((item) => item.id === dropped.id).length;

    return sum + (selectedBefore >= includedCount ? ingredient.price : 0);
  }, 0);
  const drinkTotal = selectedDrinks.reduce((sum, drink) => sum + drink.price, 0);
  const ingredientSeconds = state.droppedIngredients.reduce(
    (sum, dropped) => sum + getIngredient(dropped.id).prepSeconds,
    0,
  );
  const rawSeconds =
    (state.timing.baseSeconds +
      ingredientSeconds +
      state.timing.perIngredientSeconds * state.droppedIngredients.length +
      flavor.prepSeconds) *
      state.timing.sizeMultiplier[state.size] +
    state.timing.queueOrders * state.timing.queueSeconds;

  return {
    preset,
    size: state.size,
    flavor,
    ingredients: state.droppedIngredients,
    drinks: selectedDrinks,
    notes: state.notes,
    total: preset.prices[state.size] + extraTotal + drinkTotal,
    etaMinutes: Math.max(5, Math.ceil(rawSeconds / 60)),
  };
}

export const selectableIngredients = ingredients.filter(
  (ingredient) => ingredient.category !== "drink",
);
