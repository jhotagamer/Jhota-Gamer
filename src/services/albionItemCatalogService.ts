import { AlbionItem } from '../types/albionMarket';
import { POPULAR_ALBION_ITEMS } from '../data/albionPopularItems';
import { ArsenalBuildSlots, ResolvedSlotItem } from '../types/albionArsenal';

let catalogCache: AlbionItem[] | null = null;
let catalogPromise: Promise<AlbionItem[]> | null = null;
const baseIndexMap = new Map<string, Map<number, AlbionItem>>();
const directIdMap = new Map<string, AlbionItem>();

export async function getItemCatalog(): Promise<AlbionItem[]> {
  if (catalogCache && catalogCache.length > 0) {
    return catalogCache;
  }

  if (catalogPromise) {
    return catalogPromise;
  }

  catalogPromise = (async () => {
    try {
      const response = await fetch('/data/albion_items.json');
      if (response.ok) {
        const data: AlbionItem[] = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          catalogCache = data;
          buildIndexes(data);
          return data;
        }
      }
    } catch (err) {
      console.warn('Failed to load albion_items.json, using fallback catalog', err);
    }

    catalogCache = POPULAR_ALBION_ITEMS;
    buildIndexes(POPULAR_ALBION_ITEMS);
    return POPULAR_ALBION_ITEMS;
  })();

  return catalogPromise;
}

function buildIndexes(items: AlbionItem[]) {
  baseIndexMap.clear();
  directIdMap.clear();

  for (const item of items) {
    directIdMap.set(item.id, item);

    // Strip tier prefix (e.g. T4_2H_DUALAXE_KEEPER -> 2H_DUALAXE_KEEPER)
    const match = item.id.match(/^T([1-8])_(.+)$/);
    if (match) {
      const tier = parseInt(match[1], 10);
      const baseCode = match[2];
      if (!baseIndexMap.has(baseCode)) {
        baseIndexMap.set(baseCode, new Map());
      }
      baseIndexMap.get(baseCode)!.set(tier, item);
    }
  }
}

/**
 * Finds an AlbionItem by its base code (from Albion Arsenal) or full ID.
 * If tier is specified, it prefers that tier (default T4).
 */
export function findItemByCode(code: string, preferredTier: number = 4): AlbionItem | null {
  if (!code) return null;
  const cleanCode = code.trim();

  // Direct ID lookup
  if (directIdMap.has(cleanCode)) {
    return directIdMap.get(cleanCode)!;
  }

  // Check with tier prefix e.g. T4_CODE
  const tieredId = cleanCode.startsWith('T') ? cleanCode : `T${preferredTier}_${cleanCode}`;
  if (directIdMap.has(tieredId)) {
    return directIdMap.get(tieredId)!;
  }

  // Strip tier if user passed T4_xxx but wants code index
  const baseWithoutTier = cleanCode.replace(/^T[1-8]_/, '');
  if (baseIndexMap.has(baseWithoutTier)) {
    const tierMap = baseIndexMap.get(baseWithoutTier)!;
    if (tierMap.has(preferredTier)) {
      return tierMap.get(preferredTier)!;
    }
    // Return first available tier (avoiding ARTEFACT items if possible)
    for (const [, item] of tierMap) {
      if (!item.id.includes('ARTEFACT')) {
        return item;
      }
    }
    const first = tierMap.values().next().value;
    if (first) return first;
  }

  // Fallback scan in catalogCache
  if (catalogCache) {
    const candidate = catalogCache.find(i => 
      !i.id.includes('ARTEFACT') && 
      (i.id.endsWith(`_${baseWithoutTier}`) || i.id === baseWithoutTier || i.id.includes(baseWithoutTier))
    );
    if (candidate) return candidate;
  }

  return null;
}

export function formatFriendlyItemName(code: string): string {
  if (!code) return '';
  return code
    .replace(/^T[1-8]_/, '')
    .replace(/^2H_/, '')
    .replace(/^MAIN_/, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

export function resolveBuildSlots(
  slots: ArsenalBuildSlots,
  tier: number = 4
): ResolvedSlotItem[] {
  const slotDefinitions: { key: keyof ArsenalBuildSlots; label: string; defaultCategory: string }[] = [
    { key: 'mainHand', label: 'Arma Principal', defaultCategory: 'Armas' },
    { key: 'offHand', label: 'Mão Secundária', defaultCategory: 'Armaduras' },
    { key: 'head', label: 'Capacete / Elmo', defaultCategory: 'Capacetes' },
    { key: 'armor', label: 'Peito / Armadura', defaultCategory: 'Armaduras' },
    { key: 'shoes', label: 'Botas / Sapatos', defaultCategory: 'Botas' },
    { key: 'cape', label: 'Capa', defaultCategory: 'Capas' }
  ];

  const results: ResolvedSlotItem[] = [];

  for (const def of slotDefinitions) {
    const baseCode = slots[def.key];
    if (!baseCode) {
      if (def.key === 'offHand') {
        // Many 2-handed weapons have no off-hand, so we can omit or show null
        continue;
      }
      continue;
    }

    const matched = findItemByCode(baseCode, tier);
    const fullItemId = matched ? matched.id : `T${tier}_${baseCode.replace(/^T[1-8]_/, '')}`;
    const namePt = matched ? matched.name : formatFriendlyItemName(baseCode);
    const nameEn = matched?.nameEn || formatFriendlyItemName(baseCode);
    const iconUrl = `https://render.albiononline.com/v1/item/${encodeURIComponent(fullItemId)}.png`;

    results.push({
      slotKey: def.key,
      slotLabel: def.label,
      baseCode,
      fullItemId,
      namePt,
      nameEn,
      tier: matched ? matched.tier : tier,
      iconUrl,
      category: matched?.category || def.defaultCategory
    });
  }

  return results;
}

export function filterItemsByCategory(
  items: AlbionItem[],
  category: 'Armas' | 'Armaduras' | 'Capacetes' | 'Botas' | 'Capas' | 'Consumíveis' | 'Alimentos' | 'Poções' | 'Montarias' | string,
  searchQuery: string = ''
): AlbionItem[] {
  const query = searchQuery.toLowerCase().trim();

  return items.filter(item => {
    // Exclude wardrobe skins and artefacts from the equipment picker
    if (item.id.includes('ARTEFACT') || item.id.includes('UNIQUE_UNLOCK')) {
      return false;
    }

    if (category && category !== 'Todas') {
      if (category === 'Alimentos' || category === 'Poções') {
        if (item.category !== category && item.category !== 'Consumíveis') {
          return false;
        }
      } else if (item.category !== category) {
        return false;
      }
    }

    if (query) {
      const matchNamePt = item.name.toLowerCase().includes(query);
      const matchNameEn = item.nameEn?.toLowerCase().includes(query);
      const matchId = item.id.toLowerCase().includes(query);
      return matchNamePt || matchNameEn || matchId;
    }

    return true;
  });
}
