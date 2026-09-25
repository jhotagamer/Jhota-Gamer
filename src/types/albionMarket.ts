export type AlbionServer = 'americas' | 'asia' | 'europe';

export type AlbionCity = 
  | 'Todas'
  | 'Caerleon'
  | 'Bridgewatch'
  | 'Fort Sterling'
  | 'Lymhurst'
  | 'Martlock'
  | 'Thetford'
  | 'Brecilien'
  | 'Black Market';

export type AlbionQuality = 1 | 2 | 3 | 4 | 5;

export interface AlbionItem {
  id: string; // e.g. "T4_BAG" or "T4_MAIN_SWORD"
  name: string; // e.g. "Bolsa do Adepto"
  nameEn: string; // e.g. "Adept's Bag"
  tier: number; // 2 to 8
  category: string; // e.g. "Bolsas", "Armas", etc.
  enchantment?: number; // 0, 1, 2, 3, 4
}

export interface AlbionMarketPrice {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_min_date: string;
  sell_price_max: number;
  sell_price_max_date: string;
  buy_price_min: number;
  buy_price_min_date: string;
  buy_price_max: number;
  buy_price_max_date: string;
}

export interface AlbionMarketRow {
  id: string; // unique key: itemId_city_quality
  itemId: string;
  itemName: string;
  itemNameEn?: string;
  tier: number;
  category: string;
  enchantment: number;
  city: string;
  quality: number;
  sellPrice: number | null;
  buyPrice: number | null;
  sellDate: string | null;
  buyDate: string | null;
  hasData: boolean;
  rawItem: AlbionItem;
}

export type PriceDataFilter = 'all' | 'sell_only' | 'buy_only' | 'any_price' | 'no_data';

export interface AlbionHistoryPoint {
  item_count: number;
  avg_price: number;
  timestamp: string;
}

export interface AlbionHistoryEntry {
  location: string;
  item_id: string;
  quality: number;
  data: AlbionHistoryPoint[];
}

export interface PriceDifferenceSummary {
  highestSell: { price: number; city: string } | null;
  lowestSell: { price: number; city: string } | null;
  sellDiff: number;
  highestBuy: { price: number; city: string } | null;
  lowestBuy: { price: number; city: string } | null;
  buyDiff: number;
}
