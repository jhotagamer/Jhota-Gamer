import { VideoItem } from '../types';
export const YOUTUBE_CHANNEL_HANDLE = '@JhotaGamerOficial';
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@JhotaGamerOficial';
export interface YoutubeSyncResult {
  videos: VideoItem[]; channelConnected: boolean; channelTitle?: string;
  newVideosCount: number; syncedAt: string; message: string; shortsConfigured?: boolean;
}
let pending: Promise<YoutubeSyncResult> | undefined;
export function syncYoutubeVideos(currentVideos: VideoItem[]): Promise<YoutubeSyncResult> {
  if (pending) return pending;
  pending = (async () => {
    try {
      const response = await fetch('/api/youtube', { signal: AbortSignal.timeout(25000) });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('unavailable');
      const data = await response.json();
      if (!Array.isArray(data.videos)) throw new Error('invalid');
      try { localStorage.setItem('jhota_videos', JSON.stringify(data.videos)); } catch { /* storage optional */ }
      return { videos: data.videos, channelConnected: true, channelTitle: data.channelTitle, newVideosCount: data.videos.length, syncedAt: data.checkedAt, shortsConfigured: data.shortsConfigured, message: 'Catálogo atualizado a partir do YouTube.' };
    } catch {
      return { videos: currentVideos, channelConnected: false, newVideosCount: 0, syncedAt: '', message: 'Não foi possível atualizar o catálogo. Você pode acessar o canal no YouTube.' };
    } finally { pending = undefined; }
  })();
  return pending;
}
