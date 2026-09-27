import { cached, fetchJSON, json } from '../../server/media';
interface Env { TWITCH_CLIENT_ID?: string; TWITCH_CLIENT_SECRET?: string; }
let token: { value: string; expires: number; client: string } | undefined;
export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  if (!env.TWITCH_CLIENT_ID || !env.TWITCH_CLIENT_SECRET) return json({ status: 'unknown' }, 503);
  try {
    return await cached(request, 60, async () => {
      if (!token || token.client !== env.TWITCH_CLIENT_ID || token.expires < Date.now()) {
        const data = await fetchJSON('https://id.twitch.tv/oauth2/token', { method: 'POST', body: new URLSearchParams({ client_id: env.TWITCH_CLIENT_ID!, client_secret: env.TWITCH_CLIENT_SECRET!, grant_type: 'client_credentials' }) });
        if (!data.access_token || !data.expires_in) throw new Error('token');
        token = { value: data.access_token, expires: Date.now() + (data.expires_in - 120) * 1000, client: env.TWITCH_CLIENT_ID! };
      }
      const result = await fetchJSON('https://api.twitch.tv/helix/streams?user_login=jhotagameroficial', { headers: { 'Client-Id': env.TWITCH_CLIENT_ID!, Authorization: `Bearer ${token.value}` } });
      if (!Array.isArray(result.data)) throw new Error('invalid');
      const stream = result.data[0];
      return { status: stream ? 'live' : 'offline', title: stream?.title || '', game: stream?.game_name || '', viewers: stream?.viewer_count ?? null, checkedAt: new Date().toISOString() };
    });
  } catch { token = undefined; return json({ status: 'unknown' }, 502); }
}
