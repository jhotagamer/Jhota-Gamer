export interface CraftMaterial {
  id: string;
  count: number;
  returnable: boolean;
}

export interface CraftAlternative {
  materials: CraftMaterial[];
  outputCount: number;
  silverCost: number;
  baseFocus: number;
}

export interface CraftRecipe {
  id: string;
  name: string;
  category: string;
  tier: number;
  bonusCity: string | null;
  alternatives: CraftAlternative[];
}

/** Production bonus is output per original materials, not the resource return percentage. */
export function cityCraftReturnRate(bonusCity: string | null, craftCity: string, withFocus: boolean, dailyBonus: number = 0): number {
  const productionBonus = 18 + (bonusCity === craftCity ? 15 : 0) + (withFocus ? 59 : 0) + dailyBonus;
  return 100 * productionBonus / (100 + productionBonus);
}

export function calculateCraftProfit(input: {
  recipe: CraftAlternative;
  quantity: number;
  materialPrices: Record<string, number>;
  outputPrice: number;
  returnRate: number;
  stationCost: number;
  saleTax: number;
  orderFee: number;
}) {
  const { recipe, quantity, materialPrices, outputPrice, returnRate, stationCost, saleTax, orderFee } = input;
  const materialsGross = recipe.materials.reduce((sum, material) => sum + material.count * quantity * materialPrices[material.id], 0);
  const returnedMaterials = recipe.materials.reduce((sum, material) => sum + (material.returnable ? material.count * quantity * materialPrices[material.id] * returnRate / 100 : 0), 0);
  const revenue = quantity * recipe.outputCount * outputPrice;
  const salesCosts = revenue * (saleTax + orderFee) / 100;
  const stationCosts = quantity * (stationCost + recipe.silverCost);
  const profit = revenue - salesCosts - materialsGross + returnedMaterials - stationCosts;
  return { materialsGross, returnedMaterials, revenue, salesCosts, stationCosts, profit, perItem: profit / (quantity * recipe.outputCount), margin: revenue ? 100 * profit / revenue : 0 };
}
