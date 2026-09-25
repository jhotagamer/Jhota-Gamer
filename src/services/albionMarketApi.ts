import { 
  AlbionServer, 
  AlbionItem, 
  AlbionMarketPrice, 
  AlbionMarketRow,
  AlbionHistoryEntry,
  PriceDifferenceSummary 
} from '../types/albionMarket';
import { 
  POPULAR_ALBION_ITEMS, 
  SERVER_HOSTS, 
  MARKET_LOCATIONS 
} from '../data/albionPopularItems';

export const ALBION_SERVERS: Record<AlbionServer, string> = SERVER_HOSTS;

export const SERVER_LABELS: Record<AlbionServer, string> = {
  americas: 'Americas (West)',
  asia: 'Asia (East)',
  europe: 'Europe'
};

export function getItemIconUrl(itemId: string, enchantment: number = 0, quality: number = 1): string {
  let finalId = itemId.trim();
  if (enchantment > 0 && !finalId.includes('@')) {
    finalId = `${finalId}@${enchantment}`;
  }
  const qualityParam = quality > 1 ? `?quality=${quality}` : '';
  return `https://render.albiononline.com/v1/item/${encodeURIComponent(finalId)}.png${qualityParam}`;
}

let cachedItemDatabase: AlbionItem[] | null = null;

export async function loadItemDatabase(): Promise<AlbionItem[]> {
  if (cachedItemDatabase) return cachedItemDatabase;
  try {
    const response = await fetch('/data/albion_items.json');
    if (response.ok) {
      const data = await response.json();
      cachedItemDatabase = Array.isArray(data) ? data : POPULAR_ALBION_ITEMS;
    }
  } catch (err) {
    console.warn('Usando catálogo popular devido a erro no JSON local', err);
    cachedItemDatabase = POPULAR_ALBION_ITEMS;
  }
  return cachedItemDatabase || POPULAR_ALBION_ITEMS;
}

const pricesCache = new Map<string, { timestamp: number; data: AlbionMarketPrice[] }>();

export async function fetchMarketPrices(
  itemIds: string[],
  server: AlbionServer = 'americas',
  locations?: string[],
  qualities?: number[],
  forceFresh: boolean = false
): Promise<AlbionMarketPrice[]> {
  if (!itemIds || itemIds.length === 0) return [];

  const host = SERVER_HOSTS[server] || SERVER_HOSTS.americas;
  const uniqueItemIds = Array.from(new Set(itemIds)).map(id => id.trim()).filter(Boolean);
  
  const locKey = locations?.sort().join(',') || 'all';
  const qualKey = qualities?.sort().join(',') || 'all';
  const itemsKey = [...uniqueItemIds].sort().join(',');
  const cacheKey = `${server}:${locKey}:${qualKey}:${itemsKey}`;

  if (!forceFresh && pricesCache.has(cacheKey)) {
    const entry = pricesCache.get(cacheKey)!;
    if (Date.now() - entry.timestamp < 60000) return entry.data;
  }

  try {
    const queryParams = new URLSearchParams();
    const finalLocs = (locations && locations.length > 0 && !locations.includes('Todas')) 
      ? locations 
      : (MARKET_LOCATIONS[server] || MARKET_LOCATIONS.americas);
    
    queryParams.set('locations', finalLocs.join(','));
    queryParams.set('qualities', (qualities && qualities.length > 0 && !qualities.includes(0)) 
      ? qualities.join(',') 
      : '1,2,3,4,5');

    const queryString = queryParams.toString();
    const basePrefix = `${host}/api/v2/stats/prices/`;
    
    // Chunking logic to prevent URL length errors
    const chunks: string[][] = [];
    let currentChunk: string[] = [];
    let currentLen = basePrefix.length + queryString.length + 10;

    for (const id of uniqueItemIds) {
      const len = encodeURIComponent(id).length + 1;
      if (currentLen + len > 3000 || currentChunk.length >= 30) {
        chunks.push(currentChunk);
        currentChunk = [id];
        currentLen = basePrefix.length + queryString.length + len + 10;
      } else {
        currentChunk = [id];
        currentLen += len;
      }
    }
    if (currentChunk.length > 0) chunks.push(currentChunk);

    const results = await Promise.all(chunks.map(async (chunk) => {
      try {
        const url = `${basePrefix}${chunk.join(',')}.json?${queryString}`;
        const res = await fetch(url);
        return res.ok ? await res.json() : [];
      } catch { return []; }
    }));

    const flatData = results.flat();
    pricesCache.set(cacheKey, { timestamp: Date.now(), data: flatData });
    return flatData;
  } catch (err) {
    console.error('Erro fatal na API de Albion:', err);
    return [];
  }
}

export function buildMarketMatrix(
  items: AlbionItem[],
  cities: string[],
  qualities: number[],
  prices: AlbionMarketPrice[],
  numericEnchantment: number
): AlbionMarketRow[] {
  const rows: AlbionMarketRow[] = [];

  // Otimização: Map com chaves normalizadas para evitar erro de Case Sensitive
  const priceMap = new Map<string, AlbionMarketPrice>();
  prices.forEach(p => {
    if (!p.item_id || !p.city) return;
    const key = `${p.item_id.toLowerCase()}_${p.city.toLowerCase()}_${p.quality}`;
    priceMap.set(key, p);
  });

  for (const item of items) {
    const targetId = numericEnchantment > 0 && !item.id.includes('@')
      ? `${item.id}@${numericEnchantment}`
      : item.id;

    for (const city of cities) {
      for (const quality of qualities) {
        const key = `${targetId.toLowerCase()}_${city.toLowerCase()}_${quality}`;
        const match = priceMap.get(key);

        const sellPrice = (match && match.sell_price_min > 0) ? match.sell_price_min : null;
        const buyPrice = (match && match.buy_price_max > 0) ? match.buy_price_max : null;

        rows.push({
          id: `${targetId}_${city}_${quality}`,
          itemId: targetId,
          itemName: item.name,
          itemNameEn: item.nameEn,
          tier: item.tier,
          category: item.category,
          enchantment: numericEnchantment,
          city,
          quality,
          sellPrice,
          buyPrice,
          sellDate: (sellPrice !== null && isValidMarketDate(match?.sell_price_min_date)) ? match!.sell_price_min_date : null,
          buyDate: (buyPrice !== null && isValidMarketDate(match?.buy_price_max_date)) ? match!.buy_price_max_date : null,
          hasData: !!(match && (match.sell_price_min > 0 || match.buy_price_max > 0)),
          rawItem: item
        });
      }
    }
  }
  return rows;
}

// Memory cache for price history
const historyCache = new Map<string, { timestamp: number; data: AlbionHistoryEntry[] }>();

export async function fetchPriceHistory(
  itemId: string,
  server: AlbionServer = 'americas',
  locations?: string[],
  quality: number = 1,
  timeScale: number = 24
): Promise<AlbionHistoryEntry[]> {
  if (!itemId) return [];

  const host = SERVER_HOSTS[server] || SERVER_HOSTS.americas;
  const locKey = locations && locations.length > 0 ? locations.sort().join(',') : 'all';
  const cacheKey = `${server}:${itemId}:${locKey}:${quality}:${timeScale}`;

  const now = Date.now();
  if (historyCache.has(cacheKey)) {
    const entry = historyCache.get(cacheKey)!;
    if (now - entry.timestamp < 300000) {
      return entry.data;
    }
  }

  const queryParams = new URLSearchParams();
  queryParams.set('time-scale', String(timeScale));
  if (quality > 0) {
    queryParams.set('qualities', String(quality));
  }
  if (locations && locations.length > 0) {
    const filteredLocs = locations.filter(l => l !== 'Todas');
    if (filteredLocs.length > 0) {
      queryParams.set('locations', filteredLocs.join(','));
    }
  }

  const url = `${host}/api/v2/stats/history/${encodeURIComponent(itemId)}.json?${queryParams.toString()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to load history: ${response.status}`);
    }

    const data: AlbionHistoryEntry[] = await response.json();
    const cleanData = Array.isArray(data) ? data : [];
    historyCache.set(cacheKey, { timestamp: Date.now(), data: cleanData });
    return cleanData;
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('Price history error:', err);
    return [];
  }
}

function normalizeSearchStr(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Filtering algorithm for items
export function filterItems(
  items: AlbionItem[],
  query: string,
  category: string,
  tier: string
): AlbionItem[] {
  const cleanQuery = normalizeSearchStr(query);

  return items.filter((item) => {
    // Category filter
    if (category && category !== 'Todas') {
      if (item.category !== category) return false;
    }

    // Tier filter
    if (tier && tier !== 'Todos') {
      const targetTier = parseInt(tier.replace('T', ''), 10);
      if (!isNaN(targetTier) && item.tier !== targetTier) return false;
    }

    // Search query filter
    if (cleanQuery) {
      const normId = normalizeSearchStr(item.id);
      const normName = normalizeSearchStr(item.name);
      const normNameEn = normalizeSearchStr(item.nameEn || '');
      const normCat = normalizeSearchStr(item.category || '');

      // Direct ID check
      if (normId.includes(cleanQuery) || normId.replace(/_/g, ' ').includes(cleanQuery)) {
        return true;
      }

      // Base query check
      if (cleanQuery.includes('@')) {
        const [baseQuery] = cleanQuery.split('@');
        if (normId === baseQuery || normId.includes(baseQuery)) return true;
      }

      // Name checks
      if (normName.includes(cleanQuery)) return true;
      if (normNameEn.includes(cleanQuery)) return true;
      if (normCat.includes(cleanQuery)) return true;

      if (cleanQuery.startsWith('t') && !isNaN(Number(cleanQuery.slice(1)))) {
        if (item.tier === Number(cleanQuery.slice(1))) return true;
      }

      return false;
    }

    return true;
  });
}

// Helpers de formatação
export function formatSilver(value: number | undefined | null): string {
  if (!value || value <= 0) return '—';
  return value.toLocaleString('pt-BR');
}

export function isValidMarketDate(dateStr: string | undefined | null): boolean {
  if (!dateStr || dateStr.startsWith('0001') || dateStr.startsWith('1970')) return false;
  return true;
}

export function formatRelativeDate(dateStr: string | undefined | null): string {
  if (!isValidMarketDate(dateStr)) return '—';
  try {
    const parsed = new Date(dateStr!.endsWith('Z') ? dateStr! : `${dateStr!}Z`);
    const diff = Date.now() - parsed.getTime();
    if (diff < 60000 && diff >= 0) return 'Agora mesmo';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `há ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `há ${hours} h`;
    const days = Math.floor(hours / 24);
    return days === 1 ? 'ontem' : `há ${days} dias`;
  } catch { return '—'; }
}

export function formatFullDate(dateStr: string | undefined | null): string {
  if (!isValidMarketDate(dateStr)) return 'Sem registro';
  try {
    const parsedDate = new Date(dateStr!.endsWith('Z') ? dateStr! : `${dateStr!}Z`);
    if (isNaN(parsedDate.getTime())) return 'Sem registro';
    return parsedDate.toLocaleString('pt-BR');
  } catch {
    return 'Sem registro';
  }
}

export function calculatePriceDifferences(prices: AlbionMarketPrice[]): PriceDifferenceSummary {
  const sells = prices.filter(p => p.sell_price_min > 0).sort((a,b) => b.sell_price_min - a.sell_price_min);
  const buys = prices.filter(p => p.buy_price_max > 0).sort((a,b) => b.buy_price_max - a.buy_price_max);

  const highestSell = sells[0] ? { price: sells[0].sell_price_min, city: sells[0].city } : null;
  const lowestSell = sells[sells.length - 1] ? { price: sells[sells.length - 1].sell_price_min, city: sells[sells.length - 1].city } : null;
  const highestBuy = buys[0] ? { price: buys[0].buy_price_max, city: buys[0].city } : null;
  const lowestBuy = buys[buys.length - 1] ? { price: buys[buys.length - 1].buy_price_max, city: buys[buys.length - 1].city } : null;

  return {
    highestSell,
    lowestSell,
    sellDiff: sells.length > 1 ? sells[0].sell_price_min - sells[sells.length - 1].sell_price_min : 0,
    highestBuy,
    lowestBuy,
    buyDiff: buys.length > 1 ? buys[0].buy_price_max - buys[buys.length - 1].buy_price_max : 0,
  };
}
