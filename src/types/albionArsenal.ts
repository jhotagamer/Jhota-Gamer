import { AlbionServer } from './albionMarket';

export type ArsenalRegion = 'all' | 'americas' | 'europe' | 'asia';
export type ArsenalRange = '24h' | '7d' | '30d';
export type ArsenalKind = 'all' | '1v1' | 'gank' | 'zvz';

export interface ArsenalBuildSlots {
  mainHand: string;
  offHand: string | null;
  head: string;
  armor: string;
  shoes: string;
  cape: string;
}

export interface ArsenalBuild {
  id: number;
  url: string;
  name: string;
  slots: ArsenalBuildSlots;
  kills: number;
  deaths: number;
  winrate: number;
  adjustedWinrate: number;
  avgIp: number;
  kitValueSilver: number;
  killFame: number;
  provenanceKind?: '1v1' | 'gank' | 'zvz' | 'all';
  activityTags?: string[];
}

export interface ArsenalBuildsFilterParams {
  region?: ArsenalRegion;
  range?: ArsenalRange;
  kind?: ArsenalKind;
  weapon?: string;
  minSample?: number;
  limit?: number;
}

export interface ArsenalBuildsResponse {
  data: {
    filters: {
      region: ArsenalRegion;
      range: ArsenalRange;
      kind: ArsenalKind;
      weapon: string | null;
      minSample: number;
    };
    builds: ArsenalBuild[];
  };
  meta: {
    generatedAt: string;
    source: string;
    docs: string;
    attribution: string;
  };
}

export interface ArsenalWeapon {
  weapon: string;
  name: string;
  url: string;
  fights: number;
  wins: number;
  winrate: number;
  adjustedWinrate: number;
  gearGap: {
    punchingUp: { fights: number; wins: number };
    even: { fights: number; wins: number };
    punchingDown: { fights: number; wins: number };
  };
}

export interface ArsenalMatchup {
  opponent: string;
  name: string;
  fights: number;
  wins: number;
  winrate: number;
  avgIpEdge: number;
}

export interface ArsenalWeaponDetail {
  weapon: string;
  name: string;
  url: string;
  filters: {
    region: ArsenalRegion;
    range: ArsenalRange;
    kind: ArsenalKind;
  };
  fights: number;
  wins: number;
  winrate: number;
  adjustedWinrate: number;
  gearGap: {
    punchingUp: { fights: number; wins: number };
    even: { fights: number; wins: number };
    punchingDown: { fights: number; wins: number };
  };
  matchups: ArsenalMatchup[];
}

export interface ResolvedSlotItem {
  slotKey: 'mainHand' | 'offHand' | 'head' | 'armor' | 'shoes' | 'cape' | 'food' | 'potion' | 'mount';
  slotLabel: string;
  baseCode: string;
  fullItemId: string;
  namePt: string;
  nameEn: string;
  tier: number;
  iconUrl: string;
  category?: string;
}

export interface CustomBuildSlotItem {
  itemId: string;
  namePt: string;
  nameEn: string;
  tier: number;
  enchantment: number;
  category: string;
}

export interface CustomBuild {
  id: string;
  name: string;
  activity: ArsenalKind | 'pve';
  tier: number;
  notes?: string;
  slots: {
    mainHand: CustomBuildSlotItem | null;
    offHand: CustomBuildSlotItem | null;
    head: CustomBuildSlotItem | null;
    armor: CustomBuildSlotItem | null;
    shoes: CustomBuildSlotItem | null;
    cape: CustomBuildSlotItem | null;
    food: CustomBuildSlotItem | null;
    potion: CustomBuildSlotItem | null;
    mount: CustomBuildSlotItem | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ItemMarketPriceSummary {
  itemId: string;
  name: string;
  city: string;
  sellPrice: number | null;
  buyPrice: number | null;
  hasPrice: boolean;
  sellDate: string | null;
}

export interface BuildMarketCostResult {
  server: AlbionServer;
  city: string;
  items: ItemMarketPriceSummary[];
  totalSellCost: number;
  totalBuyCost: number;
  availableItemsCount: number;
  totalItemsCount: number;
  allPriced: boolean;
}
