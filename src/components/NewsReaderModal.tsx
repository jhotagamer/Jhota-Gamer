import React from 'react';
import { NewsItem } from '../types';
import { X, Calendar, Clock, ExternalLink } from 'lucide-react';

interface NewsReaderModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

export const NewsReaderModal: React.FC<NewsReaderModalProps> = ({ news, onClose }) => {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c0f17] border border-cyan-500/30 shadow-2xl my-8 overflow-hidden">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {news.category}
            </span>
            {news.gameName && (
              <span className="text-xs text-zinc-400 font-semibold">{news.gameName}</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar notícia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cover image */}
        <div className="relative h-64 w-full overflow-hidden bg-zinc-950">
          <img
            src={news.imageUrl}
            alt={news.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>{news.date}</span>
            <span>&bull;</span>
            <Clock className="w-3.5 h-3.5" />
            <span>{news.readTime}</span>
          </div>

          <h2 className="font-cinzel text-2xl font-bold text-white leading-snug">
            {news.title}
          </h2>

          <p className="text-sm text-zinc-400 italic border-l-2 border-cyan-400 pl-3 py-1">
            {news.snippet}
          </p>

          <div className="text-sm sm:text-base text-zinc-300 leading-relaxed space-y-3 pt-2">
            <p>{news.content}</p>
            <p className="text-xs text-zinc-400">
              Clique no botão abaixo para acessar o portal oficial de notícias e conferir a publicação na íntegra.
            </p>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            {news.officialUrl ? (
              <a
                href={news.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-400/20"
              >
                <span>{news.officialLabel || "Acessar Notícia Oficial na Íntegra"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : <div />}

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Fechar Notícia
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
