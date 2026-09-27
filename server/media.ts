export async function fetchJSON(url: string, init: RequestInit = {}) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('upstream');
  return response.json() as Promise<any>;
}
export function json(data: unknown, status = 200, ttl = 0) {
  return new Response(JSON.stringify(data), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': ttl ? `public, max-age=${ttl}` : 'no-store',
    'X-Content-Type-Options': 'nosniff',
  }});
}
export async function cached(request: Request, ttl: number, load: () => Promise<unknown>) {
  const cache = (caches as unknown as { default: Cache }).default;
  const url = new URL(request.url); url.search = '';
  const key = new Request(url.toString());
  const hit = await cache.match(key);
  if (hit) return hit;
  const response = json(await load(), 200, ttl);
  await cache.put(key, response.clone());
  return response;
}
