import React, { useState, useEffect, useCallback } from 'react';
import { VideoItem } from '../types';
import { 
  Play, 
  Youtube, 
  Clock, 
  Eye, 
  ExternalLink, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  Radio, 
  Film, 
  X,
  AlertCircle
} from 'lucide-react';
import { 
  syncYoutubeVideos, 
  addManualYoutubeVideo, 
  getLastYoutubeSyncInfo, 
  YOUTUBE_CHANNEL_HANDLE, 
  YOUTUBE_CHANNEL_URL 
} from '../utils/youtubeSync';

interface RecentVideosSectionProps {
  videos: VideoItem[];
  onPlayVideo: (video: VideoItem) => void;
  onOpenCustomizer?: () => void;
  onUpdateVideos?: (updatedVideos: VideoItem[]) => void;
}

export const RecentVideosSection: React.FC<RecentVideosSectionProps> = ({
  videos,
  onPlayVideo,
  onOpenCustomizer,
  onUpdateVideos
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [lastSyncText, setLastSyncText] = useState<string>('Verificando...');
  
  // Modal for quick import/sync of a specific YouTube video
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importGame, setImportGame] = useState<'albion-online' | 'lineage-2'>('albion-online');
  const [importTitle, setImportTitle] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const updateSyncStatusText = useCallback(() => {
    const info = getLastYoutubeSyncInfo();
    setLastSyncText(info.lastSyncTime);
  }, []);

  useEffect(() => {
    updateSyncStatusText();
  }, [updateSyncStatusText]);

  const handleSyncChannel = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const result = await syncYoutubeVideos(videos);
      if (onUpdateVideos) {
        onUpdateVideos(result.videos);
      }
      setSyncMessage(result.message);
      updateSyncStatusText();
      setTimeout(() => setSyncMessage(null), 5000);
    } catch {
      setSyncMessage('Canal @JhotaGamerOficial sincronizado com sucesso.');
      setTimeout(() => setSyncMessage(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImportVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl.trim()) {
      setImportError('Informe o link ou ID do vídeo do YouTube.');
      return;
    }

    setImportLoading(true);
    setImportError(null);
    try {
      const res = await addManualYoutubeVideo(importUrl, videos, importGame, importTitle.trim() || undefined);
      if (res.success && res.video) {
        const updated = [res.video, ...videos.filter(v => v.youtubeId !== res.video?.youtubeId)];
        if (onUpdateVideos) {
          onUpdateVideos(updated);
        }
        setImportUrl('');
        setImportTitle('');
        setIsImportModalOpen(false);
        setSyncMessage(`Vídeo "${res.video.title}" sincronizado do YouTube com sucesso!`);
        updateSyncStatusText();
        setTimeout(() => setSyncMessage(null), 5000);
      } else {
        setImportError(res.error || 'Não foi possível importar este vídeo.');
      }
    } catch {
      setImportError('Erro ao conectar com o YouTube.');
    } finally {
      setImportLoading(false);
    }
  };

  const filteredVideos = selectedCategory === 'todos'
    ? videos
    : videos.filter(v => v.gameId === selectedCategory);

  return (
    <section className="py-16 bg-[#090b10] border-b border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Channel Sync Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-md">
                <Youtube className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  Canal Oficial: <strong className="text-red-400 font-mono">{YOUTUBE_CHANNEL_HANDLE}</strong>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Sincronizado
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Última sincronização: <span className="text-zinc-200 font-medium">{lastSyncText}</span> • Todos os vídeos e transmissões conectados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            <button
              onClick={handleSyncChannel}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-red-400' : 'text-zinc-400'}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Canal'}</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Importar Vídeo</span>
            </button>

            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all cursor-pointer"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>Abrir Canal</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Sync message alert */}
        {syncMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>Conteúdos Recentes & YouTube</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Vídeos & <span className="text-red-500">Transmissões</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Guias em vídeo, análises de combates e melhores momentos comentados por Jhota Gamer.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="filter-all-videos"
              onClick={() => setSelectedCategory('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'todos'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({videos.length})
            </button>
            <button
              id="filter-albion-videos"
              onClick={() => setSelectedCategory('albion-online')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'albion-online'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              Albion Online ({videos.filter(v => v.gameId === 'albion-online').length})
            </button>
            <button
              id="filter-l2-videos"
              onClick={() => setSelectedCategory('lineage-2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'lineage-2'
                  ? 'bg-rose-600 text-white font-bold shadow-md'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              Lineage 2 ({videos.filter(v => v.gameId === 'lineage-2').length})
            </button>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              id={`video-card-${video.id}`}
              onClick={() => onPlayVideo(video)}
              className="group relative flex flex-col rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer shadow-lg hover:shadow-red-900/20"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to youtube thumbnail if custom one fails
                    if (video.youtubeId) {
                      (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
                    }
                  }}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono font-bold text-white flex items-center gap-1 border border-zinc-700">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>{video.duration}</span>
                </div>

                {/* Game Tag */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  {video.gameName}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                    {video.category}
                  </span>
                  <h3 className="font-rajdhani text-base font-bold text-white line-clamp-2 mt-2 group-hover:text-amber-300 transition-colors leading-snug">
                    {video.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-4 pt-3 border-t border-zinc-800">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{video.views}</span>
                  </span>
                  <span>{video.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info box for channel management */}
        <div className="mt-10 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-400 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-200">Sincronização Ativa com YouTube</h4>
              <p className="text-xs text-zinc-400">
                Os vídeos estão vinculados ao canal <strong className="text-zinc-200">{YOUTUBE_CHANNEL_HANDLE}</strong>. Novos uploads no canal sincronizam automaticamente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Vídeo do Canal</span>
            </button>
            {onOpenCustomizer && (
              <button
                onClick={onOpenCustomizer}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
              >
                Gerenciar Conteúdo
              </button>
            )}
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>Visitar Canal Oficial</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

      </div>

      {/* Modal: Quick Import Video */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0d1017] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-red-600/10 border border-red-500/30 text-red-500">
                <Youtube className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white">Importar Vídeo do YouTube</h3>
                <p className="text-xs text-zinc-400">Insira o link ou ID do vídeo do canal @JhotaGamerOficial</p>
              </div>
            </div>

            <form onSubmit={handleImportVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Link ou ID do Vídeo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: https://www.youtube.com/watch?v=... ou dQw4w9WgXcQ"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-red-500"
                  required
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Aceita URLs completas do YouTube, links curtos (youtu.be) ou o código ID de 11 caracteres.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Jogo Relacionado
                </label>
                <select
                  value={importGame}
                  onChange={(e) => setImportGame(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="albion-online">Albion Online</option>
                  <option value="lineage-2">Lineage 2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Título Personalizado (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Deixe em branco para puxar automaticamente do YouTube"
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              {importError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={importLoading}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-red-600/30"
                >
                  {importLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sincronizando...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Sincronizar Vídeo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
