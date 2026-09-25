import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Newspaper, Calendar, Clock, ExternalLink, ArrowRight } from 'lucide-react';

interface RecentNewsSectionProps {
  news: NewsItem[];
  onSelectNews: (item: NewsItem) => void;
}

export const RecentNewsSection: React.FC<RecentNewsSectionProps> = ({ news, onSelectNews }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');

  const filterOptions = [
    { id: 'todos', label: 'Todas as Notícias' },
    { id: 'albion-online', label: 'Albion Online' },
    { id: 'lineage-2', label: 'Lineage 2 Exilium' }
  ];

  const filteredNews = selectedFilter === 'todos' 
    ? news 
    : news.filter(item => item.gameId === selectedFilter);

  return (
    <section className="py-16 bg-[#0c0f17] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Notícias & Patches Oficiais</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Últimas do <span className="text-cyan-400">Meta & Comunidade</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Notas de patch, atualizações e comunicados vinculados diretamente aos portais oficiais de cada jogo.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {filterOptions.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg"
            >
              {/* Card Banner Image */}
              <a
                href={item.officialUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-48 w-full overflow-hidden bg-zinc-950 block"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {item.category}
                  </span>
                  {item.gameName && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900/80 backdrop-blur-md text-zinc-300 border border-zinc-700">
                      {item.gameName}
                    </span>
                  )}
                </div>
              </a>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-2 font-mono">
                    <span className="flex items-center gap-1 text-cyan-400/90 font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.readTime}</span>
                    </span>
                  </div>

                  <a
                    href={item.officialUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-rajdhani text-lg font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors leading-snug"
                  >
                    {item.title}
                  </a>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col gap-2">
                  <a
                    href={item.officialUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs bg-cyan-400 hover:bg-cyan-300 text-zinc-950 transition-all duration-200 shadow-md shadow-cyan-400/15"
                  >
                    <span>Ver matéria completa</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectNews(item)}
                    className="w-full inline-flex items-center justify-between text-[11px] text-zinc-400 hover:text-cyan-300 py-1 transition-colors cursor-pointer"
                  >
                    <span>Ver resumo detalhado</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
