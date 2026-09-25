import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageType } from '../types';
import { 
  ArrowUp, 
  Youtube, 
  MessageSquare, 
  Instagram, 
  Tv, 
  Facebook, 
  ShieldCheck, 
  Sliders, 
  Heart,
  Gamepad2
} from 'lucide-react';

interface FooterProps {
  brandName: string;
  onNavigate?: (page: PageType) => void;
  onSelectGame?: (gameId: string) => void;
  onOpenCustomizer?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  brandName,
  onNavigate,
  onSelectGame,
  onOpenCustomizer
}) => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: PageType) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      switch (page) {
        case 'home':
          navigate('/');
          break;
        case 'jogos':
          navigate('/jogos');
          break;
        case 'redes-sociais':
          navigate('/redes-sociais');
          break;
        case 'links-uteis':
          navigate('/links-uteis');
          break;
        case 'contato':
          navigate('/contato');
          break;
        default:
          navigate('/');
      }
    }
    scrollToTop();
  };

  const handleGameClick = (gameId: string) => {
    if (onSelectGame) {
      onSelectGame(gameId);
    } else {
      navigate(`/jogo/${gameId}`);
    }
    scrollToTop();
  };

  return (
    <footer className="relative bg-[#06080d] border-t border-zinc-800 text-zinc-400">
      {/* Decorative top colored line matching the banner */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-amber-400 to-cyan-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col (2 spans) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-[#0d1017] rounded-[7px] flex items-center justify-center">
                  <span className="font-cinzel text-xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                    J
                  </span>
                </div>
              </div>
              <span className="font-cinzel text-2xl font-bold text-white tracking-wider">
                {brandName}
              </span>
            </div>

            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed font-sans">
              Portal oficial dedicado aos entusiastas de MMORPG e RPG de mundo aberto. Guias didáticos, análises de mecânicas e economia, builds otimizadas e conteúdos focados na comunidade gamer.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@JhotaGamerOficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-red-600/20 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 flex items-center justify-center text-zinc-300 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href="https://discord.gg/Uq9pnCwDkq"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-indigo-600/20 hover:text-indigo-400 border border-zinc-800 hover:border-indigo-500/40 flex items-center justify-center text-zinc-300 transition-colors"
                aria-label="Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a
                href="https://twitch.tv/jhotagamer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-purple-600/20 hover:text-purple-400 border border-zinc-800 hover:border-purple-500/40 flex items-center justify-center text-zinc-300 transition-colors"
                aria-label="Twitch"
              >
                <Tv className="w-4 h-4" />
              </a>

              <a
                href="https://www.instagram.com/jhotagameroficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-pink-600/20 hover:text-pink-400 border border-zinc-800 hover:border-pink-500/40 flex items-center justify-center text-zinc-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61594432231685"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-blue-600/20 hover:text-blue-400 border border-zinc-800 hover:border-blue-500/40 flex items-center justify-center text-zinc-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Col */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('jogos')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Jogos & Portais
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('redes-sociais')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Redes Sociais
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('links-uteis')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Links Úteis & Wikis
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contato')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Contato & Parcerias
                </button>
              </li>
            </ul>
          </div>

          {/* Games Col */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4">
              Jogos Cobertos
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleGameClick('albion-online')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Albion Online</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGameClick('lineage-2')}
                  className="hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>Lineage 2</span>
                </button>
              </li>
              <li className="pt-1">
                <span className="text-xs text-zinc-500 italic">
                  + Mais jogos no futuro
                </span>
              </li>
            </ul>
          </div>

          {/* Management / Customizer & Back to Top */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4">
              Personalização
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Substitua qualquer texto provisório de biografia, links ou jogos pelo painel ao vivo:
            </p>
            {onOpenCustomizer && (
              <button
                onClick={onOpenCustomizer}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Painel de Conteúdo</span>
              </button>
            )}

            <button
              id="btn-back-to-top"
              onClick={scrollToTop}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 border border-zinc-700 hover:border-zinc-600 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Voltar ao Topo</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-zinc-300 font-semibold">{brandName}</strong>. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Desenvolvido para Comunidades Gamers</span>
            <span>&bull;</span>
            <span>MMORPG &bull; RPG</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
