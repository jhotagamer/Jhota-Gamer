import { GameNewsSection } from './GameNewsSection';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Game, Guide, Build, NewsItem, VideoItem } from '../types';
import { 
  ArrowLeft, BookOpen, Swords, Video, Newspaper, Clock, 
  Play, CheckCircle, AlertCircle, ChevronRight,
  ExternalLink, User, Zap, Utensils, Code, Copy, Check, TrendingUp, Calculator
} from 'lucide-react';
import { AlbionMarketSection } from './albion/AlbionMarketSection';
import { AlbionBuildsMetaSection } from './albion/AlbionBuildsMetaSection';
import { AlbionToolsSection } from './albion/AlbionToolsSection';

interface GameDetailPageProps {
  game: Game;
  guides: Guide[];
  builds: Build[];
  news: NewsItem[];
  videos: VideoItem[];
  initialTab?: 'guias' | 'builds' | 'videos' | 'noticias' | 'mercado' | 'ferramentas';
  onBackToGames?: () => void;
  onSelectGuide?: (guide: Guide) => void;
  onPlayVideo?: (video: VideoItem) => void;
  onSelectNews?: (item: NewsItem) => void;
}

export const GameDetailPage: React.FC<GameDetailPageProps> = ({
  game,
  guides,
  builds,
  news,
  videos,
  initialTab,
  onBackToGames,
  onSelectGuide,
  onPlayVideo,
  onSelectNews
}) => {
  const navigate = useNavigate();
  const isAlbion = game.id === 'albion-online';
  const isLineage = game.id === 'lineage-2';
  const [activeTab, setActiveTab] = useState<'guias' | 'builds' | 'videos' | 'noticias' | 'mercado' | 'ferramentas'>(
    isLineage && initialTab === 'builds' ? 'guias' : (initialTab || 'guias')
  );
  const [rawViewBuildId, setRawViewBuildId] = useState<string | null>(null);
  const [copiedBuildId, setCopiedBuildId] = useState<string | null>(null);

  const gameGuides = guides.filter((g) => g.gameId === game.id);
  const gameBuilds = builds.filter((b) => b.gameId === game.id);
  const gameVideos = videos.filter((v) => v.gameId === game.id);
  const gameNews = news.filter((n) => n.gameId === game.id);

  const tabs = [
    { id: 'guias' as const, label: 'Guias & Tutoriais', count: gameGuides.length, icon: BookOpen },
    ...(!isLineage
      ? [{ id: 'builds' as const, label: 'Builds & Meta', count: isAlbion ? 0 : gameBuilds.length, icon: Swords }]
      : []),
    { id: 'videos' as const, label: 'Vídeos do Canal', count: gameVideos.length, icon: Video },
    { id: 'noticias' as const, label: 'Notícias & Patches', count: gameNews.length, icon: Newspaper },
    ...(isAlbion
      ? [
          { id: 'mercado' as const, label: 'Mercado', count: 0, icon: TrendingUp },
          { id: 'ferramentas' as const, label: 'Calculadoras', count: 0, icon: Calculator }
        ]
      : [])
  ];

  return (
    <div className="bg-[#090b10] min-h-screen pb-20">
      
      {/* Top Breadcrumb & Return Nav */}
      <div className="bg-zinc-950/80 border-b border-zinc-800/80 sticky top-18 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            id="btn-back-to-games-list"
            onClick={() => {
              if (onBackToGames) onBackToGames();
              navigate('/jogos');
            }}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Lista de Jogos</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <span>Jogos</span>
            <span>/</span>
            <span className="text-amber-400 font-semibold">{game.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Game Banner */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-zinc-950 border-b border-zinc-800">
        <img 
          src={game.bannerImage || game.coverImage} 
          alt={game.name}
                    style={{ objectPosition: game.id === 'lineage-2' ? '45% 20%' : '45% 40%' }}
          className="w-full h-full object-cover object-center" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-black/60 to-black/30" />
        <div className="absolute bottom-0 inset-x-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500 text-zinc-950 shadow-md">
                {game.badge}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-black/70 backdrop-blur-md border border-zinc-700 text-zinc-300">
                {game.genre}
              </span>
            </div>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white mb-2 drop-shadow-md">
              {game.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 max-w-3xl font-sans leading-relaxed">
              {game.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-zinc-800/80">
              {game.stats.map((st, i) => (
                <div key={i} className="text-xs">
                  <span className="text-zinc-500">{st.label}: </span>
                  <span className="font-bold text-amber-300">{st.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 overflow-x-auto pb-px mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`game-tab-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-800 text-zinc-400'}`}>{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: GUIAS - ATUALIZADO PARA NAVEGAÇÃO */}
        {activeTab === 'guias' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-cinzel text-xl font-bold text-white">Guias Práticos & Tutoriais para {game.name}</h2>
            </div>
            {gameGuides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gameGuides.map((guide) => (
                  <div
                    key={guide.id}
                    onClick={() => {
                      if (onSelectGuide) onSelectGuide(guide);
                      navigate(`/jogo/${game.id}/guia/${guide.id}`);
                    }}
                    className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">{guide.category}</span>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono"><Clock className="w-3 h-3" /><span>{guide.readTime}</span></div>
                      </div>
                      <h3 className="font-cinzel text-lg font-bold text-white hover:text-amber-300 transition-colors mb-2">{guide.title}</h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">{guide.summary}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {guide.tags.map((t, idx) => <span key={idx} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-mono">#{t}</span>)}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
                      <span>Nível Recomendado: {guide.recommendedLevel}</span>
                      <div className="flex items-center gap-1"><span>Ler Guia Completo</span><ChevronRight className="w-4 h-4" /></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400">Novos guias em produção!</div>
            )}
          </div>
        )}

        {/* TAB 2: BUILDS - EXIBIDO APENAS PARA JOGOS COM SUPORTE A BUILDS */}
        {!isLineage && activeTab === 'builds' && (
          isAlbion ? (
            <AlbionBuildsMetaSection />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-white">
                    Builds & Equipamentos — {game.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Combinações recomendadas para PvP, Sieges, PvE e Farm de alto rendimento.
                  </p>
                </div>
              </div>

              {gameBuilds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gameBuilds.map((build) => (
                    <div
                      key={build.id}
                      className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            {build.role}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                            {build.difficulty}
                          </span>
                        </div>

                        <h3 className="font-cinzel text-xl font-bold text-white mb-2">
                          {build.title}
                        </h3>

                        <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 mb-4">
                          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                            Foco & Atividade
                          </div>
                          <div className="text-sm font-bold text-amber-400">
                            {build.activity}
                          </div>
                        </div>

                        {/* Gear slots */}
                        <div className="space-y-2 mb-4">
                          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                            Equipamentos Principais:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {build.gear.map((g, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs flex items-center justify-between"
                              >
                                <span className="text-zinc-500 font-mono">{g.slot}</span>
                                <span className="font-semibold text-zinc-200">{g.item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pros and Cons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                            <div className="text-[11px] font-bold text-emerald-400 uppercase mb-1.5 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Vantagens</span>
                            </div>
                            <ul className="text-xs text-zinc-300 space-y-1">
                              {build.pros.map((pro, idx) => (
                                <li key={idx}>&bull; {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
                            <div className="text-[11px] font-bold text-rose-400 uppercase mb-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>Pontos de Atenção</span>
                            </div>
                            <ul className="text-xs text-zinc-300 space-y-1">
                              {build.cons.map((con, idx) => (
                                <li key={idx}>&bull; {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400">
                  Builds de Lineage 2 estão sendo otimizadas para o servidor atual.
                </div>
              )}
            </div>
          )
        )}

        {/* TAB 3: VÍDEOS - ATUALIZADO PARA NAVEGAÇÃO */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-cinzel text-xl font-bold text-white">Vídeos e Gameplays de {game.name}</h2>
              <a
                href="https://www.youtube.com/@JhotaGamerOficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <span>Canal Oficial Jhota Gamer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            {gameVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameVideos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      if (onPlayVideo) onPlayVideo(vid);
                      navigate(`/jogo/${game.id}/video/${vid.id}`);
                    }}
                    className="group rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-red-500/50 overflow-hidden cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Play className="w-5 h-5 fill-current ml-0.5" /></div>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white">
                        {vid.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-rajdhani text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">{vid.title}</h3>
                      <div className="flex items-center justify-between text-xs text-zinc-500 mt-3 pt-2 border-t border-zinc-800">
                        <span>{vid.views}</span>
                        <span>{vid.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400">Em breve novos vídeos!</div>
            )}
          </div>
        )}

        {activeTab === 'noticias' && (
          <GameNewsSection news={gameNews} gameId={game.id} />
        )}

        {/* TAB 5: MERCADO (Albion Online) */}
        {activeTab === 'mercado' && isAlbion && (
          <AlbionMarketSection />
        )}

        {/* TAB 6: CALCULADORAS & UTILITÁRIOS (Albion Online) */}
        {activeTab === 'ferramentas' && isAlbion && (
          <AlbionToolsSection />
        )}

      </div>
    </div>
  );
};
