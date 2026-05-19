export const sizes = [
  "Bolsa",
  "Medio litro",
  "Litro",
  "Media charola",
  "Charola completa",
] as const;

export type MenuSize = (typeof sizes)[number];

export type IngredientShape =
  | "sphere"
  | "cube"
  | "slice"
  | "stick"
  | "ring"
  | "bottle"
  | "shrimp";

export type IngredientCategory =
  | "base"
  | "sauce"
  | "crunch"
  | "protein"
  | "fresh"
  | "candy"
  | "drink";

export type Ingredient = {
  id: string;
  name: string;
  shortName: string;
  category: IngredientCategory;
  price: number;
  prepSeconds: number;
  color: string;
  accent: string;
  shape: IngredientShape;
};

export type MenuPreset = {
  id: string;
  name: string;
  color: string;
  description: string;
  includedIngredientIds: string[];
  prices: Record<MenuSize, number>;
};

export type Flavor = {
  id: string;
  name: string;
  color: string;
  heat: number;
  prepSeconds: number;
};

export type Drink = {
  id: string;
  name: string;
  price: number;
};

export const flavors: Flavor[] = [
  { id: "natural", name: "Natural", color: "#f0b64f", heat: 1, prepSeconds: 20 },
  {
    id: "flaming-hot",
    name: "Flaming Hot",
    color: "#e34b2f",
    heat: 4,
    prepSeconds: 35,
  },
  { id: "chipotle", name: "Chipotle", color: "#b45c2f", heat: 3, prepSeconds: 30 },
];

export const ingredients: Ingredient[] = [
  {
    id: "papas",
    name: "Papas caseras",
    shortName: "Papas",
    category: "base",
    price: 0,
    prepSeconds: 80,
    color: "#d99036",
    accent: "#f6d07a",
    shape: "sphere",
  },
  {
    id: "pepino",
    name: "Pepino",
    shortName: "Pepino",
    category: "fresh",
    price: 5,
    prepSeconds: 25,
    color: "#70b55f",
    accent: "#c8ed9d",
    shape: "slice",
  },
  {
    id: "cacahuate",
    name: "Cacahuate",
    shortName: "Cacahuate",
    category: "crunch",
    price: 10,
    prepSeconds: 25,
    color: "#c88738",
    accent: "#f4c36b",
    shape: "sphere",
  },
  {
    id: "limon",
    name: "Limon",
    shortName: "Limon",
    category: "fresh",
    price: 0,
    prepSeconds: 20,
    color: "#c7da43",
    accent: "#f7ff8a",
    shape: "slice",
  },
  {
    id: "salsa",
    name: "Salsa",
    shortName: "Salsa",
    category: "sauce",
    price: 0,
    prepSeconds: 20,
    color: "#c43d24",
    accent: "#ff8a57",
    shape: "bottle",
  },
  {
    id: "maggie",
    name: "Maggie",
    shortName: "Maggie",
    category: "sauce",
    price: 0,
    prepSeconds: 15,
    color: "#7c3f1b",
    accent: "#f1a35d",
    shape: "bottle",
  },
  {
    id: "banderita",
    name: "Banderita de tamarindo",
    shortName: "Banderita",
    category: "candy",
    price: 10,
    prepSeconds: 20,
    color: "#a43f21",
    accent: "#f0b66b",
    shape: "stick",
  },
  {
    id: "queso",
    name: "Queso",
    shortName: "Queso",
    category: "sauce",
    price: 5,
    prepSeconds: 30,
    color: "#f0df9f",
    accent: "#fff6bf",
    shape: "cube",
  },
  {
    id: "crema",
    name: "Crema",
    shortName: "Crema",
    category: "sauce",
    price: 5,
    prepSeconds: 30,
    color: "#fff6dc",
    accent: "#f4ddaf",
    shape: "bottle",
  },
  {
    id: "pico-gallo",
    name: "Pico de gallo",
    shortName: "Pico",
    category: "fresh",
    price: 10,
    prepSeconds: 45,
    color: "#df372c",
    accent: "#4fa35d",
    shape: "cube",
  },
  {
    id: "rielitos",
    name: "Rielitos",
    shortName: "Rielitos",
    category: "candy",
    price: 5,
    prepSeconds: 15,
    color: "#a04d2d",
    accent: "#db8a43",
    shape: "ring",
  },
  {
    id: "churritos",
    name: "Churritos",
    shortName: "Churritos",
    category: "crunch",
    price: 5,
    prepSeconds: 20,
    color: "#e0a236",
    accent: "#ffcf68",
    shape: "stick",
  },
  {
    id: "chicharron",
    name: "Chicharron",
    shortName: "Chicharron",
    category: "crunch",
    price: 30,
    prepSeconds: 45,
    color: "#d9b986",
    accent: "#fff0c2",
    shape: "cube",
  },
  {
    id: "tocino",
    name: "Tocino seco",
    shortName: "Tocino",
    category: "protein",
    price: 0,
    prepSeconds: 35,
    color: "#a94d36",
    accent: "#f28a67",
    shape: "stick",
  },
  {
    id: "parmesano",
    name: "Parmesano",
    shortName: "Parmesano",
    category: "sauce",
    price: 0,
    prepSeconds: 25,
    color: "#f4e3b0",
    accent: "#fff8cf",
    shape: "cube",
  },
  {
    id: "chiles-curtidos",
    name: "Chiles curtidos",
    shortName: "Chiles",
    category: "fresh",
    price: 0,
    prepSeconds: 30,
    color: "#678f38",
    accent: "#d6dc6c",
    shape: "slice",
  },
  {
    id: "camaron",
    name: "Camaron",
    shortName: "Camaron",
    category: "protein",
    price: 50,
    prepSeconds: 70,
    color: "#f28b62",
    accent: "#ffd1aa",
    shape: "shrimp",
  },
  {
    id: "carne-seca",
    name: "Carne seca",
    shortName: "Carne",
    category: "protein",
    price: 50,
    prepSeconds: 65,
    color: "#6b382a",
    accent: "#b66c45",
    shape: "stick",
  },
  {
    id: "conchitas",
    name: "Conchitas",
    shortName: "Conchitas",
    category: "crunch",
    price: 5,
    prepSeconds: 20,
    color: "#e5aa59",
    accent: "#ffd788",
    shape: "ring",
  },
  {
    id: "tajin",
    name: "Tajin",
    shortName: "Tajin",
    category: "sauce",
    price: 5,
    prepSeconds: 15,
    color: "#d4412e",
    accent: "#f6a03c",
    shape: "bottle",
  },
  {
    id: "chamoy",
    name: "Chamoy",
    shortName: "Chamoy",
    category: "sauce",
    price: 5,
    prepSeconds: 20,
    color: "#8f1f2a",
    accent: "#ff6b77",
    shape: "bottle",
  },
  {
    id: "valentina",
    name: "Valentina",
    shortName: "Valentina",
    category: "sauce",
    price: 10,
    prepSeconds: 20,
    color: "#d44a28",
    accent: "#ffe07c",
    shape: "bottle",
  },
  {
    id: "gomitas",
    name: "Gomitas enchiladas",
    shortName: "Gomitas",
    category: "candy",
    price: 0,
    prepSeconds: 35,
    color: "#d84e5f",
    accent: "#f5a552",
    shape: "sphere",
  },
  {
    id: "mangomix",
    name: "Mangomix",
    shortName: "Mangomix",
    category: "candy",
    price: 0,
    prepSeconds: 25,
    color: "#f0a23a",
    accent: "#ffd05f",
    shape: "cube",
  },
  {
    id: "zanahoria",
    name: "Zanahoria",
    shortName: "Zanahoria",
    category: "fresh",
    price: 0,
    prepSeconds: 25,
    color: "#e87932",
    accent: "#ffd29f",
    shape: "stick",
  },
  {
    id: "jicama",
    name: "Jicama",
    shortName: "Jicama",
    category: "fresh",
    price: 0,
    prepSeconds: 25,
    color: "#f4efe0",
    accent: "#cfc8a7",
    shape: "cube",
  },
];

export const presets: MenuPreset[] = [
  {
    id: "sencillas",
    name: "Papas sencillas",
    color: "#f1b24a",
    description: "Pepino, cacahuate, limon, salsa, Maggie y banderita.",
    includedIngredientIds: [
      "papas",
      "pepino",
      "cacahuate",
      "limon",
      "salsa",
      "maggie",
      "banderita",
    ],
    prices: {
      Bolsa: 35,
      "Medio litro": 45,
      Litro: 55,
      "Media charola": 75,
      "Charola completa": 130,
    },
  },
  {
    id: "triguenas",
    name: "Triguenas",
    color: "#ef794f",
    description: "Queso, crema, pico de gallo, pepino, cacahuate y rielitos.",
    includedIngredientIds: [
      "papas",
      "queso",
      "crema",
      "pico-gallo",
      "pepino",
      "cacahuate",
      "rielitos",
      "churritos",
      "limon",
      "valentina",
      "maggie",
      "banderita",
    ],
    prices: {
      Bolsa: 45,
      "Medio litro": 50,
      Litro: 60,
      "Media charola": 95,
      "Charola completa": 140,
    },
  },
  {
    id: "vaqueras",
    name: "Vaqueras",
    color: "#f1b948",
    description: "Chicharron, queso, crema, pico, pepino y cacahuate.",
    includedIngredientIds: [
      "papas",
      "chicharron",
      "queso",
      "crema",
      "pico-gallo",
      "pepino",
      "cacahuate",
      "rielitos",
      "churritos",
      "limon",
      "valentina",
      "maggie",
      "banderita",
    ],
    prices: {
      Bolsa: 55,
      "Medio litro": 60,
      Litro: 75,
      "Media charola": 105,
      "Charola completa": 155,
    },
  },
  {
    id: "pelirrojas",
    name: "Pelirrojas",
    color: "#f0644e",
    description: "Gomitas enchiladas, mangomix, zanahoria, jicama y chamoy.",
    includedIngredientIds: [
      "papas",
      "gomitas",
      "mangomix",
      "zanahoria",
      "jicama",
      "pepino",
      "cacahuate",
      "chamoy",
      "limon",
      "valentina",
      "maggie",
      "banderita",
      "rielitos",
      "tajin",
    ],
    prices: {
      Bolsa: 45,
      "Medio litro": 55,
      Litro: 65,
      "Media charola": 85,
      "Charola completa": 135,
    },
  },
  {
    id: "weras",
    name: "Las Weras",
    color: "#9a6bf0",
    description: "Queso, crema, tocino seco, parmesano, papitas y chiles.",
    includedIngredientIds: [
      "papas",
      "queso",
      "crema",
      "tocino",
      "parmesano",
      "chiles-curtidos",
    ],
    prices: {
      Bolsa: 40,
      "Medio litro": 55,
      Litro: 90,
      "Media charola": 115,
      "Charola completa": 170,
    },
  },
  {
    id: "jarochas",
    name: "Jarochas",
    color: "#45cbd6",
    description: "Camaron, carne seca, pepino, pico, queso, crema y conchitas.",
    includedIngredientIds: [
      "papas",
      "camaron",
      "carne-seca",
      "pepino",
      "pico-gallo",
      "queso",
      "crema",
      "cacahuate",
      "rielitos",
      "churritos",
      "conchitas",
      "valentina",
      "maggie",
      "limon",
      "banderita",
    ],
    prices: {
      Bolsa: 50,
      "Medio litro": 65,
      Litro: 85,
      "Media charola": 150,
      "Charola completa": 220,
    },
  },
  {
    id: "premium",
    name: "Premium",
    color: "#f6b943",
    description: "Todo lo que desees agregarle excepto camaron y carne seca.",
    includedIngredientIds: [
      "papas",
      "queso",
      "crema",
      "pico-gallo",
      "pepino",
      "cacahuate",
      "rielitos",
      "churritos",
      "limon",
      "valentina",
      "maggie",
      "banderita",
      "chicharron",
      "conchitas",
      "tajin",
      "chamoy",
    ],
    prices: {
      Bolsa: 45,
      "Medio litro": 55,
      Litro: 70,
      "Media charola": 130,
      "Charola completa": 190,
    },
  },
];

export const drinks: Drink[] = [
  { id: "pepsi", name: "Pepsi", price: 25 },
  { id: "coca-cola", name: "Coca-Cola", price: 25 },
  { id: "manzanita", name: "Manzanita Sol", price: 25 },
  { id: "sprite", name: "Sprite", price: 25 },
  { id: "reces-tea", name: "Reces Tea Limon", price: 25 },
  { id: "rubio-limon", name: "Rubio Limon", price: 25 },
  { id: "arizona", name: "Arizona Natural", price: 25 },
];

export const ingredientMap = new Map(
  ingredients.map((ingredient) => [ingredient.id, ingredient]),
);

export function getIngredient(id: string) {
  const ingredient = ingredientMap.get(id);

  if (!ingredient) {
    throw new Error(`Unknown ingredient: ${id}`);
  }

  return ingredient;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
}
