import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageType } from '../types';
import { 
  Menu, 
  X, 
  Gamepad2, 
  Home, 
  Share2, 
  Link as LinkIcon, 
  Mail, 
  Youtube, 
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  brandName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Função para determinar a página ativa com base na URL real
  const getActivePage = (path: string): string => {
    if (path === '/' || path === '') return 'home';
    if (path.startsWith('/jogos')) return 'jogos';
    if (path.startsWith('/jogo/')) return 'jogo-detalhes';
    if (path.startsWith('/redes-sociais')) return 'redes-sociais';
    if (path.startsWith('/links-uteis')) return 'links-uteis';
    if (path.startsWith('/contato')) return 'contato';
    return 'home';
  };

  const activePage = getActivePage(location.pathname);

  const navItems = [
    { id: 'home', label: 'Início', icon: Home, path: '/' },
    { id: 'jogos', label: 'Jogos', icon: Gamepad2, path: '/jogos' },
    { id: 'redes-sociais', label: 'Redes Sociais', icon: Share2, path: '/redes-sociais' },
    { id: 'links-uteis', label: 'Links Úteis', icon: LinkIcon, path: '/links-uteis' },
    { id: 'contato', label: 'Contato', icon: Mail, path: '/contato' }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090b10]/95 backdrop-blur-md border-b border-zinc-800/80 transition-all duration-200">
      {/* Top micro-bar for gamer notification */}
      <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-cyan-600/20 border-b border-amber-500/20 px-4 py-1 text-center text-xs font-medium text-amber-300/90 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Portal dedicado ao canal <strong className="text-amber-200">{brandName}</strong> • Novos guias de Albion Online e Lineage 2 adicionados!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 p-0.5 shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0d1017] rounded-[7px] flex items-center justify-center">
                <span className="font-cinzel text-xl font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-orange-400 bg-clip-text text-transparent">
                  J
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-xl font-bold tracking-wider text-white group-hover:text-amber-400 transition-colors">
                  {brandName}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                  PORTAL
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans tracking-wide">
                MMORPG &bull; RPG &bull; Guias
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id || (item.id === 'jogos' && activePage === 'jogo-detalhes');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://www.youtube.com/@JhotaGamerOficial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Youtube className="w-4 h-4 text-white" />
              <span>Canal no YouTube</span>
            </a>
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1017] border-b border-zinc-800 px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id || (item.id === 'jogos' && activePage === 'jogo-detalhes');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                    : 'text-zinc-300 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            );
          })}

          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
            <a
              href="https://www.youtube.com/@JhotaGamerOficial"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600"
            >
              <Youtube className="w-4 h-4 text-white" />
              <span>Inscrever-se no YouTube</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
