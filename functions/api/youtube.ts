import { cached, fetchJSON, json } from '../../server/media';
interface Env { YOUTUBE_API_KEY?: string; YOUTUBE_SHORTS_PLAYLIST_ID?: string; }
const HANDLE = '@JhotaGamerOficial';
function durationLabel(iso: string) {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return '';
  const h = Number(m[1] || 0), min = Number(m[2] || 0), sec = Number(m[3] || 0);
  return h ? `${h}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${min}:${String(sec).padStart(2, '0')}`;
}
export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  if (!env.YOUTUBE_API_KEY) return json({ message: 'O catálogo do YouTube está temporariamente indisponível.' }, 503);
  try {
    return await cached(request, 600, async () => {
      const api = (resource: string, params: Record<string, string>) => fetchJSON(
        `https://www.googleapis.com/youtube/v3/${resource}?${new URLSearchParams({ ...params, key: env.YOUTUBE_API_KEY! })}`
      );
      const channel = (await api('channels', { part: 'contentDetails,snippet', forHandle: HANDLE })).items?.[0];
      if (!channel?.contentDetails?.relatedPlaylists?.uploads) throw new Error('channel');
      const uploads = await api('playlistItems', { part: 'contentDetails', playlistId: channel.contentDetails.relatedPlaylists.uploads, maxResults: '50' });
      const shortIds = new Set<string>();
      if (env.YOUTUBE_SHORTS_PLAYLIST_ID) {
        let pageToken = '';
        for (let page = 0; page < 10; page++) {
          const data = await api('playlistItems', { part: 'contentDetails', playlistId: env.YOUTUBE_SHORTS_PLAYLIST_ID, maxResults: '50', ...(pageToken ? { pageToken } : {}) });
          for (const item of data.items || []) shortIds.add(item.contentDetails.videoId);
          pageToken = data.nextPageToken || '';
          if (!pageToken) break;
        }
        if (pageToken) throw new Error('playlist too large');
      }
      // Catálogo recente, limitado a 50 uploads + 50 Shorts da playlist.
      const ids = [...new Set<string>([...(uploads.items || []).map((v: any) => v.contentDetails.videoId), ...[...shortIds].slice(0, 50)])];
      const details: any[] = [];
      for (let i = 0; i < ids.length; i += 50) {
        const data = await api('videos', { part: 'snippet,contentDetails,statistics,status', id: ids.slice(i, i + 50).join(',') });
        details.push(...(data.items || []));
      }
      const videos = details.filter(v => v.snippet.channelId === channel.id && v.status.privacyStatus === 'public' && v.snippet.liveBroadcastContent !== 'upcoming').map(v => {
        const text = `${v.snippet.title} ${v.snippet.description}`;
        const gameId = /albion/i.test(text) ? 'albion-online' : /lineage|exilium/i.test(text) ? 'lineage-2' : 'comunidade';
        const isShort = shortIds.has(v.id);
        return {
          id: v.id, youtubeId: v.id, gameId,
          gameName: gameId === 'albion-online' ? 'Albion Online' : gameId === 'lineage-2' ? 'Lineage 2' : 'Comunidade',
          title: v.snippet.title, description: v.snippet.description,
          duration: durationLabel(v.contentDetails.duration), views: v.statistics?.viewCount || '',
          date: new Date(v.snippet.publishedAt).toLocaleDateString('pt-BR'), publishedAt: v.snippet.publishedAt,
          thumbnail: v.snippet.thumbnails.high?.url || v.snippet.thumbnails.default?.url,
          category: 'Gameplay', mediaType: isShort ? 'short' : 'video', embeddable: v.status.embeddable !== false,
          url: `https://www.youtube.com/${isShort ? 'shorts/' : 'watch?v='}${v.id}`,
        };
      }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
      return { videos, channelTitle: channel.snippet.title, shortsConfigured: Boolean(env.YOUTUBE_SHORTS_PLAYLIST_ID), checkedAt: new Date().toISOString() };
    });
  } catch { return json({ message: 'Não foi possível atualizar o YouTube. Tente novamente mais tarde.' }, 502); }
}
