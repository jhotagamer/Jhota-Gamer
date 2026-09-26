import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types';
import { 
  Gamepad2, 
  Search, 
  ArrowRight, 
  Layers 
} from 'lucide-react';

interface GamesPageProps {
  games: Game[];
  onSelectGame?: (gameId: string) => void;
}

export const GamesPage: React.FC<GamesPageProps> = ({
  games,
  onSelectGame,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('todos');

  const handleGameClick = (gameId: string) => {
    if (onSelectGame) onSelectGame(gameId);
    navigate(`/jogo/${gameId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = 
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = 
      selectedGenre === 'todos' || 
      game.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="py-12 bg-[#090b10] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Biblioteca de Jogos Oficiais</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white mb-4">
            Jogos & <span className="text-amber-400">Hubs de Conteúdo</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Selecione uma das franquias abaixo para acessar guias estratégicos completos, montagens de builds (equipamentos e runas), notícias atualizadas e vídeos exclusivos.
          </p>
        </div>

        <div className="mb-10 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar jogo por nome ou gênero..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950/80 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedGenre('todos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedGenre === 'todos'
                  ? 'bg-amber-400 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              Todos os Jogos
            </button>
            <button
              onClick={() => setSelectedGenre('mmorpg')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedGenre === 'mmorpg'
                  ? 'bg-amber-400 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              MMORPG
            </button>
            <button
              onClick={() => setSelectedGenre('sandbox')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedGenre === 'sandbox'
                  ? 'bg-amber-400 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              Sandbox
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredGames.map((game) => {
            const isAmber = game.themeColor === 'amber';
            const isRose = game.themeColor === 'rose';
            const isBlue = game.themeColor === 'blue';

            const borderGlow = isAmber
              ? 'hover:border-amber-500/60 shadow-amber-500/5'
              : isRose
              ? 'hover:border-rose-500/60 shadow-rose-500/5'
              : 'hover:border-cyan-500/60 shadow-cyan-500/5';

            return (
              <div
                key={game.id}
                id={`games-page-card-${game.id}`}
                onClick={() => handleGameClick(game.id)}
                className={`group flex flex-col rounded-2xl bg-zinc-900/80 border border-zinc-800 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden shadow-xl cursor-pointer ${borderGlow}`}
              >
                <div className="relative h-60 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={game.bannerImage || game.coverImage}
                    alt={game.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-zinc-700 text-amber-300">
                      {game.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{game.status}</span>
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {game.genre}
                    </span>
                    <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {game.name}
                    </h2>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <p className="text-xs text-zinc-300 font-medium italic mb-3">
                      &ldquo;{game.tagline}&rdquo;
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                      {game.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                        Principais Destaques:
                      </div>
                      {game.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`grid ${game.id === 'lineage-2' ? 'grid-cols-2' : 'grid-cols-3'} gap-2 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center`}>
                      <div>
                        <div className="text-xs font-bold text-amber-400">{game.guidesCount}</div>
                        <div className="text-[10px] text-zinc-500 uppercase">Guias</div>
                      </div>
                      {game.id !== 'lineage-2' && (
                        <div>
                          <div className="text-xs font-bold text-rose-400">{game.buildsCount}</div>
                          <div className="text-[10px] text-zinc-500 uppercase">Builds</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-cyan-400">{game.videosCount}</div>
                        <div className="text-[10px] text-zinc-500 uppercase">Vídeos</div>
                      </div>
                    </div>
                  </div>

                  <button
                    id={`btn-view-game-content-${game.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameClick(game.id);
                    }}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <span>Ver Conteúdos & Guias de {game.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-1">
                Gostaria de ver outro jogo abordado no portal?
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-xl">
                Você pode gerenciar os jogos da biblioteca ou adicionar novas franquias como World of Warcraft, Tibia, Throne and Liberty ou Path of Exile 2.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
