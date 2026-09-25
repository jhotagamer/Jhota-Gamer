import React from 'react';
import { VideoItem } from '../types';
import { X, Youtube, Clock, Eye, ExternalLink, ThumbsUp } from 'lucide-react';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0d1017] border border-red-500/40 shadow-2xl overflow-hidden my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              {video.gameName} &bull; {video.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Screen container */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          {video.youtubeId && video.youtubeId !== 'dQw4w9WgXcQ' ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            // Dedicated stylized gaming video display with high definition backdrop and play simulation
            <div className="relative w-full h-full">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover opacity-60 filter blur-xs"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 mb-4 animate-bounce">
                  <Youtube className="w-10 h-10" />
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white max-w-xl mb-2">
                  {video.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-md mb-6">
                  Vídeo demonstrativo oficial do canal Jhota Gamer. Você pode assistir diretamente ou abrir no YouTube.
                </p>
                <a
                  href={video.youtubeId && video.youtubeId !== 'dQw4w9WgXcQ' ? `https://www.youtube.com/watch?v=${video.youtubeId}` : "https://www.youtube.com/@JhotaGamerOficial"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 shadow-xl shadow-red-600/40 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Youtube className="w-4 h-4" />
                  <span>Assistir no YouTube Oficial</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-6 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-rajdhani text-lg font-bold text-white">{video.title}</h4>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{video.views}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{video.duration}</span>
              </span>
              <span>&bull;</span>
              <span>{video.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={video.youtubeId && video.youtubeId !== 'dQw4w9WgXcQ' ? `https://www.youtube.com/watch?v=${video.youtubeId}` : "https://www.youtube.com/@JhotaGamerOficial"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1.5"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Deixar Like</span>
            </a>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
