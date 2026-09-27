import assert from 'node:assert/strict';
import { onRequestGet as youtube } from '../functions/api/youtube';
import { onRequestGet as twitch } from '../functions/api/twitch';
const originalFetch = globalThis.fetch;
const entries = new Map<string, Response>();
Object.defineProperty(globalThis, 'caches', { configurable: true, value: { default: {
  match: async (r: Request) => entries.get(r.url)?.clone(),
  put: async (r: Request, res: Response) => { entries.set(r.url, res.clone()); },
}}});
const request = new Request('https://jhotagamer.com.br/api/youtube');
const env = { YOUTUBE_API_KEY: 'test-key', YOUTUBE_SHORTS_PLAYLIST_ID: 'shorts' };
let calls = 0;
const res = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status });
try {
  assert.equal((await youtube({ request, env: {} })).status, 503);
  globalThis.fetch = async (input) => {
    calls++; const url = new URL(String(input));
    if (url.pathname.endsWith('/channels')) return res({ items: [{ id: 'owner', snippet: { title: 'Jhota' }, contentDetails: { relatedPlaylists: { uploads: 'uploads' } } }] });
    if (url.pathname.endsWith('/playlistItems')) {
      const shorts = url.searchParams.get('playlistId') === 'shorts';
      const ids = shorts ? ['short'] : ['regular','short','foreign','private'];
      return res({ items: ids.map(videoId => ({ contentDetails: { videoId } })) });
    }
    return res({ items: ['regular','short','foreign','private'].map(id => ({ id, snippet: { channelId: id === 'foreign' ? 'other' : 'owner', title: id, description: '', publishedAt: '2026-09-26T12:00:00Z', thumbnails: { high: { url: 'https://i.ytimg.com/example' } } }, status: { privacyStatus: id === 'private' ? 'private' : 'public', embeddable: true }, contentDetails: { duration: 'PT1M' }, statistics: { viewCount: '2' } })) });
  };
  const data = await (await youtube({ request, env })).json() as any;
  assert.equal(data.videos.length, 2);
  assert.equal(data.videos.find((v: any) => v.id === 'regular').mediaType, 'video');
  assert.equal(data.videos.find((v: any) => v.id === 'short').mediaType, 'short');
  assert.equal(data.videos[0].duration, '1:00');
  assert.equal(data.videos[0].gameId, 'comunidade');
  assert.ok(!JSON.stringify(data).includes('test-key'));
  const count = calls; await youtube({ request, env }); assert.equal(calls, count);
  entries.clear(); globalThis.fetch = async () => res({}, 403);
  assert.equal((await youtube({ request, env })).status, 502);
  const tr = new Request('https://jhotagamer.com.br/api/twitch');
  assert.equal((await twitch({ request: tr, env: {} })).status, 503);
  const te = { TWITCH_CLIENT_ID: 'id', TWITCH_CLIENT_SECRET: 'secret' };
  globalThis.fetch = async input => String(input).includes('oauth2') ? res({ access_token: 'private-token', expires_in: 3600 }) : res({ data: [] });
  assert.equal((await (await twitch({ request: tr, env: te })).json() as any).status, 'offline');
  entries.clear(); globalThis.fetch = async () => res({ data: [{ title: 'Live', viewer_count: 0, game_name: 'Albion Online' }] });
  const live = await (await twitch({ request: tr, env: te })).json() as any;
  assert.equal(live.status, 'live'); assert.equal(live.viewers, 0);
  assert.ok(!JSON.stringify(live).includes('private-token'));
  entries.clear(); globalThis.fetch = async () => res({}, 500);
  assert.equal((await (await twitch({ request: tr, env: te })).json() as any).status, 'unknown');
  console.log('PASS: Shorts por playlist, canal correto, privados excluídos, cache, erros, Twitch offline/live/unknown e segredos ausentes das respostas.');
} finally { globalThis.fetch = originalFetch; }
