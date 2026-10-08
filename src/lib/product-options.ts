import type { Product, ProductOptionGroup } from "@/data/menu";

export type UiOptionGroup = ProductOptionGroup & {
  prices?: Record<string, number>;
};

export function displayProductDescription(product: Product) {
  return product.description;
}

export const pizzaBordas: UiOptionGroup = {
  id: "borda-recheada",
  label: "Borda recheada externa",
  options: ["Sem borda adicional", "Borda Catupiry", "Borda Cheddar"],
  min: 0,
  max: 1,
  hint: "Escolha 1 opção (opcional)",
  prices: {
    "Sem borda adicional": 0,
    "Borda Catupiry": 12,
    "Borda Cheddar": 12,
  },
};

export function productOptionGroups(product: Product): UiOptionGroup[] {
  const groups: UiOptionGroup[] = (product.customGroups ?? []).map((group) => ({
    ...group,
  }));

  if (product.category === "pizzas" || product.category === "doces") {
    groups.push(pizzaBordas);
  }

  return groups;
}

export function optionPrice(group: UiOptionGroup, option: string) {
  return group.prices?.[option] ?? 0;
}
