import { 
  ArsenalBuild, 
  ArsenalBuildsFilterParams, 
  ArsenalBuildsResponse, 
  ArsenalWeapon, 
  ArsenalWeaponDetail 
} from '../types/albionArsenal';

const ARSENAL_BASE_URL = 'https://albion-arsenal.com/api/v1';

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();
const CACHE_TTL_MS = 60 * 1000; 

function getFromLocalStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`arsenal_cache_${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < 10 * 60 * 1000) return parsed.data as T;
  } catch (e) { console.debug('LocalStorage read failed', e); }
  return null;
}

function setToLocalStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(`arsenal_cache_${key}`, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (e) { console.debug('LocalStorage write failed', e); }
}

export async function fetchArsenalBuilds(
  params: ArsenalBuildsFilterParams = {},
  forceFresh: boolean = false
): Promise<{ builds: ArsenalBuild[]; meta: ArsenalBuildsResponse['meta'] }> {
  const query = new URLSearchParams();
  if (params.region && params.region !== 'all') query.set('region', params.region);
  if (params.range) query.set('range', params.range);
  if (params.kind && params.kind !== 'all') query.set('kind', params.kind);
  if (params.weapon) query.set('weapon', params.weapon);
  if (params.minSample) query.set('minSample', String(params.minSample));
  if (params.limit) query.set('limit', String(params.limit));

  const cacheKey = `builds:${query.toString()}`;
  const now = Date.now();

  if (!forceFresh && memoryCache.has(cacheKey)) {
    const entry = memoryCache.get(cacheKey)!;
    if (now - entry.timestamp < CACHE_TTL_MS) return entry.data as any;
  }

  if (pendingRequests.has(cacheKey)) return pendingRequests.get(cacheKey) as any;

  const fetchPromise = (async () => {
    const url = `${ARSENAL_BASE_URL}/builds${query.toString() ? `?${query.toString()}` : ''}`;
    try {
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });

      if (response.status === 429) {
        const local = getFromLocalStorage<any>(cacheKey);
        if (local) return local;
        throw new Error('Limite de requisições atingido. Aguarde alguns segundos.');
      }

      if (!response.ok) throw new Error(`Erro na API (${response.status})`);

      const json: ArsenalBuildsResponse = await response.json();
      const rawBuilds = json?.data?.builds || [];
      const filterKind = json?.data?.filters?.kind || params.kind || 'all';
      
      const builds = rawBuilds.map(b => ({
        ...b,
        provenanceKind: b.provenanceKind || filterKind
      }));

      const result = {
        builds,
        meta: json?.meta || {
          generatedAt: new Date().toISOString(),
          source: 'albion-arsenal.com',
          docs: 'https://albion-arsenal.com/developers',
          attribution: 'Atribuição: albion-arsenal.com'
        }
      };

      memoryCache.set(cacheKey, { timestamp: Date.now(), data: result });
      setToLocalStorage(cacheKey, result);
      return result;
    } catch (err: any) {
      const local = getFromLocalStorage<any>(cacheKey);
      if (local) return local;
      throw new Error(err.message || 'Erro ao carregar builds.');
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}

export async function fetchArsenalWeapons(
  params: { region?: string; range?: string; kind?: string; minSample?: number; limit?: number; } = {},
  forceFresh: boolean = false
): Promise<{ weapons: ArsenalWeapon[]; meta: unknown }> {
  const query = new URLSearchParams();
  if (params.region && params.region !== 'all') query.set('region', params.region);
  if (params.range) query.set('range', params.range);
  if (params.kind && params.kind !== 'all') query.set('kind', params.kind);
  if (params.minSample) query.set('minSample', String(params.minSample));
  if (params.limit) query.set('limit', String(params.limit));

  const cacheKey = `weapons:${query.toString()}`;
  if (!forceFresh && memoryCache.has(cacheKey)) {
    const entry = memoryCache.get(cacheKey)!;
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) return entry.data as any;
  }

  const fetchPromise = (async () => {
    const url = `${ARSENAL_BASE_URL}/weapons${query.toString() ? `?${query.toString()}` : ''}`;
    try {
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (response.status === 429) {
        const local = getFromLocalStorage<any>(cacheKey);
        if (local) return local;
      }
      if (!response.ok) throw new Error(`Erro: ${response.status}`);
      const json = await response.json();
      const result = { weapons: json?.data?.weapons || [], meta: json?.meta };
      memoryCache.set(cacheKey, { timestamp: Date.now(), data: result });
      setToLocalStorage(cacheKey, result);
      return result;
    } catch (err: any) {
      const local = getFromLocalStorage<any>(cacheKey);
      if (local) return local;
      throw new Error(err.message || 'Erro ao carregar armas.');
    }
  })();

  pendingRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}

export async function fetchArsenalWeaponDetail(
  weaponBase: string,
  params: { region?: string; range?: string; kind?: string; } = {},
  forceFresh: boolean = false
): Promise<ArsenalWeaponDetail | null> {
  if (!weaponBase) return null;

  const query = new URLSearchParams();
  if (params.region && params.region !== 'all') query.set('region', params.region);
  if (params.range) query.set('range', params.range);
  if (params.kind && params.kind !== 'all') query.set('kind', params.kind);

  const cacheKey = `weaponDetail:${weaponBase}:${query.toString()}`;
  if (!forceFresh && memoryCache.has(cacheKey)) {
    const entry = memoryCache.get(cacheKey)!;
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) return entry.data as any;
  }

  const fetchPromise = (async () => {
    // TENTATIVA 1: Buscar com a base original (ex: T8_SWORD)
    // TENTATIVA 2: Buscar sem o prefixo de Tier (ex: SWORD)
    const attempts = [
      weaponBase,
      weaponBase.replace(/^T[1-8]_/, '')
    ];

    for (const id of attempts) {
      try {
        const url = `${ARSENAL_BASE_URL}/weapons/${encodeURIComponent(id)}${query.toString() ? `?${query.toString()}` : ''}`;
        const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          const json = await response.json();
          const result = json?.data as ArsenalWeaponDetail;
          if (result) {
            memoryCache.set(cacheKey, { timestamp: Date.now(), data: result });
            setToLocalStorage(cacheKey, result);
            return result;
          }
        }
      } catch (e) { continue; }
    }
    return null;
  })();

  pendingRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}
