import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Play, Radio, Youtube } from 'lucide-react';
import { VideoItem } from '../types';
import { syncYoutubeVideos, YOUTUBE_CHANNEL_URL } from '../utils/youtubeSync';

interface Props {
  videos: VideoItem[];
  onPlayVideo: (video: VideoItem) => void;
  onUpdateVideos?: (videos: VideoItem[]) => void;
  gameId?: string;
}
export const RecentVideosSection: React.FC<Props> = ({ videos, onPlayVideo, onUpdateVideos, gameId }) => {
  const [tab, setTab] = useState<'video' | 'short' | 'twitch'>('video');
  const [catalog, setCatalog] = useState(videos);
  const [message, setMessage] = useState('Consultando o canal...');
  const [ready, setReady] = useState(false);
  const latest = useRef({ videos, onUpdateVideos });
  latest.current = { videos, onUpdateVideos };
  useEffect(() => { setCatalog(videos); }, [videos]);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (document.hidden) return;
      const result = await syncYoutubeVideos(latest.current.videos);
      if (!active) return;
      setMessage(result.message); setReady(true);
      if (result.channelConnected) { setCatalog(result.videos); latest.current.onUpdateVideos?.(result.videos); }
    };
    void refresh();
    const timer = window.setInterval(refresh, 600000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  const items = catalog.filter(v => (!gameId || v.gameId === gameId) && (v.mediaType || 'video') === tab);
  return (
    <section className="py-12 bg-[#090b10]" id="videos-transmissoes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div><p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">Conteúdo do Jhota</p><h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white">Vídeos & Transmissões</h2></div>
          <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-amber-400"><Youtube className="w-5 h-5" /> Visitar YouTube <ExternalLink className="w-4 h-4" /></a>
        </div>
        <div className="flex flex-wrap gap-3 mb-6" role="group" aria-label="Tipo de conteúdo">
          {([['video','Vídeos'],['short','Shorts'],['twitch','Twitch']] as const).map(([key,label]) => <button key={key} onClick={() => setTab(key)} aria-pressed={tab === key} className={`rounded-xl px-5 py-3 text-sm font-bold transition-colors ${tab === key ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'}`}>{label}</button>)}
        </div>
        {tab === 'twitch' ? <TwitchLive /> : <>
          <p role="status" className="text-xs text-zinc-400 mb-5">{message}</p>
          <div className={`grid gap-5 ${tab === 'short' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {items.map(video => <article key={video.youtubeId} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
              <button onClick={() => onPlayVideo(video)} disabled={video.embeddable === false} aria-label={`Assistir ${video.title}`} className={`relative block w-full ${tab === 'short' ? 'aspect-[9/16] max-h-[420px]' : 'aspect-video'} bg-black group disabled:cursor-default`}>
                <img src={video.thumbnail} alt="" loading="lazy" className="w-full h-full object-contain" />
                {video.embeddable !== false && <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40"><Play className="w-12 h-12 text-white" /></span>}
              </button>
              <div className="p-4"><p className="text-xs text-zinc-400 mb-2">{video.date} • {video.gameName}</p><h3 className="font-bold text-white mb-3">{video.title}</h3><a href={video.url || `https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="text-amber-400 text-sm inline-flex items-center gap-2">Abrir no YouTube <ExternalLink className="w-3 h-3" /></a></div>
            </article>)}
          </div>
          {ready && !items.length && <div className="p-8 rounded-2xl border border-zinc-800 text-zinc-400">Nenhum {tab === 'short' ? 'Short' : 'vídeo'} disponível nesta seleção. <a className="text-amber-400 underline" href={`${YOUTUBE_CHANNEL_URL}/${tab === 'short' ? 'shorts' : 'videos'}`} target="_blank" rel="noopener noreferrer">Ver no YouTube</a></div>}
        </>}
      </div>
    </section>
  );
};
function TwitchLive() {
  const [stream, setStream] = useState<{ status: string; title?: string; game?: string; viewers?: number }>({ status: 'loading' });
  const [showPlayer, setShowPlayer] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch('/api/twitch', { signal: AbortSignal.timeout(25000) });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!['live','offline'].includes(data.status)) throw new Error();
        if (active) setStream(data);
      } catch { if (active) setStream({ status: 'unknown' }); }
    };
    void refresh(); const timer = window.setInterval(refresh, 60000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  const parent = encodeURIComponent(window.location.hostname);
  const status = stream.status === 'live' ? 'Ao vivo agora' : stream.status === 'offline' ? 'Offline no momento' : stream.status === 'loading' ? 'Consultando transmissão...' : 'Status indisponível';
  return <div className="rounded-2xl overflow-hidden border border-purple-500/30 bg-zinc-900/60">
    <div className="p-6"><p className={`flex items-center gap-2 text-sm mb-3 ${stream.status === 'live' ? 'text-red-400' : 'text-zinc-400'}`} role="status"><Radio className="w-4 h-4" />{status}</p><h3 className="text-xl font-bold text-white">{stream.title || 'Jhota Gamer na Twitch'}</h3>{stream.status === 'live' && <p className="text-zinc-400 text-sm mt-2">{stream.game} • {stream.viewers} espectadores</p>}
    <div className="flex flex-wrap gap-4 mt-5"><button className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold" onClick={() => setShowPlayer(v => !v)}>{showPlayer ? 'Fechar player' : 'Abrir player da Twitch'}</button><a href="https://www.twitch.tv/jhotagameroficial" target="_blank" rel="noopener noreferrer" className="px-5 py-3 text-purple-300">Assistir na Twitch ↗</a></div></div>
    {showPlayer && <iframe title="Twitch — Jhota Gamer" src={`https://player.twitch.tv/?channel=jhotagameroficial&parent=${parent}&autoplay=false`} className="w-full aspect-video min-h-[300px]" allow="autoplay; fullscreen" allowFullScreen />}
  </div>;
}
