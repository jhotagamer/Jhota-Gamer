import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types';
import { 
  Gamepad2, 
  ArrowRight, 
  BookOpen, 
  Swords, 
  Video, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

interface FeaturedGamesSectionProps {
  games: Game[];
  onSelectGame?: (gameId: string) => void;
  onViewAllGames?: () => void;
  onOpenCustomizer?: () => void;
}

export const FeaturedGamesSection: React.FC<FeaturedGamesSectionProps> = ({
  games,
  onSelectGame,
  onViewAllGames,
  onOpenCustomizer
}) => {
  const navigate = useNavigate();

  const handleGameClick = (gameId: string) => {
    if (onSelectGame) onSelectGame(gameId);
    navigate(`/jogo/${gameId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAllGamesClick = () => {
    if (onViewAllGames) onViewAllGames();
    navigate('/jogos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="secao-jogos-destaque" className="py-16 lg:py-20 bg-[#0b0e15] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Universo dos Jogos</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Jogos em <span className="text-amber-400">Destaque</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Selecione seu jogo favorito para acessar guias exclusivos, builds do meta e vídeos.
            </p>
          </div>

          <button
            id="featured-games-view-all-btn"
            onClick={handleAllGamesClick}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sm font-semibold text-zinc-200 border border-zinc-700 hover:border-amber-500/40 transition-all cursor-pointer"
          >
            <span>Ver Todos os Jogos</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => {
            const isAmber = game.themeColor === 'amber';
            const isRose = game.themeColor === 'rose';
            const isBlue = game.themeColor === 'blue';

            const accentBorder = isAmber 
              ? 'hover:border-amber-500/60' 
              : isRose 
              ? 'hover:border-rose-500/60' 
              : 'hover:border-cyan-500/60';

            const accentGlow = isAmber 
              ? 'group-hover:shadow-amber-500/20' 
              : isRose 
              ? 'group-hover:shadow-rose-500/20' 
              : 'group-hover:shadow-cyan-500/20';

            const badgeBg = isAmber
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : isRose
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

            return (
              <div
                key={game.id}
                id={`game-card-${game.id}`}
                onClick={() => handleGameClick(game.id)}
                className={`group relative flex flex-col rounded-2xl bg-zinc-900/70 border border-zinc-800 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden shadow-xl ${accentBorder} ${accentGlow}`}
              >
                {/* Cover Image Container */}
                <div className="relative h-52 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={game.coverImage}
                    alt={game.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border backdrop-blur-md ${badgeBg}`}>
                      {game.badge}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-zinc-700 text-[11px] text-zinc-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{game.status}</span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="text-xs font-mono text-amber-400 font-semibold tracking-wider">
                      {game.genre}
                    </div>
                    <h3 className="font-cinzel text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {game.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-zinc-300 italic mb-3 font-medium">
                      &ldquo;{game.tagline}&rdquo;
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                      {game.description}
                    </p>

                    {/* Content counters */}
                    <div className={`grid ${game.id === 'lineage-2' ? 'grid-cols-2' : 'grid-cols-3'} gap-2 py-3 border-y border-zinc-800/80 mb-4 text-center`}>
                      <div className="flex flex-col items-center">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400 mb-1" />
                        <span className="text-xs font-bold text-zinc-200">{game.guidesCount}</span>
                        <span className="text-[10px] text-zinc-500">Guias</span>
                      </div>

                      {game.id !== 'lineage-2' && (
                        <div className="flex flex-col items-center">
                          <Swords className="w-3.5 h-3.5 text-rose-400 mb-1" />
                          <span className="text-xs font-bold text-zinc-200">{game.buildsCount}</span>
                          <span className="text-[10px] text-zinc-500">Builds</span>
                        </div>
                      )}

                      <div className="flex flex-col items-center">
                        <Video className="w-3.5 h-3.5 text-cyan-400 mb-1" />
                        <span className="text-xs font-bold text-zinc-200">{game.videosCount}</span>
                        <span className="text-[10px] text-zinc-500">Vídeos</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <button
                      id={`btn-open-game-${game.id}`}
                      className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-zinc-200 bg-zinc-800 group-hover:bg-amber-400 group-hover:text-zinc-950 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Acessar Portal do Jogo</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Slot for Future Games as explicitly requested */}
          <div 
            onClick={() => onOpenCustomizer?.()}
            className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-zinc-900/30 border-2 border-dashed border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/60 transition-all duration-300 text-center cursor-pointer min-h-[360px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30 mb-2">
              Em Breve no Canal
            </span>

            <h3 className="font-cinzel text-xl font-bold text-white mb-2">
              Novos Jogos no Radar
            </h3>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-xs mb-4 leading-relaxed">
              World of Warcraft, Ashes of Creation, Path of Exile 2 e sugestões da comunidade de inscritos.
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sugerir ou Adicionar Jogo</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
