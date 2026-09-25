import { AlbionServer, AlbionMarketPrice } from '../types/albionMarket';
import { fetchMarketPrices } from './albionMarketApi';
import { BuildMarketCostResult, ItemMarketPriceSummary } from '../types/albionArsenal';

/**
 * Central reusable market price query function.
 * Wraps fetchMarketPrices with caching, chunking and server resolution.
 */
export async function getMarketPricesForItems(
  itemIds: string[],
  server: AlbionServer = 'americas',
  locations?: string[],
  qualities?: number[],
  forceFresh: boolean = false
): Promise<AlbionMarketPrice[]> {
  if (!itemIds || itemIds.length === 0) return [];
  return fetchMarketPrices(itemIds, server, locations, qualities, forceFresh);
}

/**
 * Calculates real equipment kit costs for a list of items at a chosen server and city.
 * Follows the strict rule: If an item has no price, it is marked as 'Preço indisponível',
 * NOT treated as 0 silver, and the summary clearly communicates coverage.
 */
export async function calculateBuildMarketCost(
  items: { id: string; name: string }[],
  server: AlbionServer = 'americas',
  city: string = 'Caerleon',
  quality: number = 1
): Promise<BuildMarketCostResult> {
  const itemIds = items.map(i => i.id);
  const locations = city === 'Todas' ? undefined : [city];
  const rawPrices = await getMarketPricesForItems(itemIds, server, locations, [quality]);

  const summaries: ItemMarketPriceSummary[] = items.map(item => {
    // Filter matching prices for this item
    const matches = rawPrices.filter(p => p.item_id === item.id);
    
    // Pick the best match for the selected city, or lowest sell price if city is "Todas"
    let selectedPrice: AlbionMarketPrice | undefined;
    if (city !== 'Todas') {
      selectedPrice = matches.find(p => p.city.toLowerCase() === city.toLowerCase());
    } else {
      // Find lowest sell price > 0
      selectedPrice = matches
        .filter(p => p.sell_price_min > 0)
        .sort((a, b) => a.sell_price_min - b.sell_price_min)[0];
    }

    const sellPrice = selectedPrice && selectedPrice.sell_price_min > 0 ? selectedPrice.sell_price_min : null;
    const buyPrice = selectedPrice && selectedPrice.buy_price_max > 0 ? selectedPrice.buy_price_max : null;

    return {
      itemId: item.id,
      name: item.name,
      city: selectedPrice ? selectedPrice.city : city,
      sellPrice,
      buyPrice,
      hasPrice: sellPrice !== null,
      sellDate: selectedPrice?.sell_price_min_date || null
    };
  });

  let totalSellCost = 0;
  let totalBuyCost = 0;
  let availableItemsCount = 0;

  for (const s of summaries) {
    if (s.sellPrice !== null) {
      totalSellCost += s.sellPrice;
      availableItemsCount++;
    }
    if (s.buyPrice !== null) {
      totalBuyCost += s.buyPrice;
    }
  }

  return {
    server,
    city,
    items: summaries,
    totalSellCost,
    totalBuyCost,
    availableItemsCount,
    totalItemsCount: items.length,
    allPriced: availableItemsCount === items.length
  };
}
