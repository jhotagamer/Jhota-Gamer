import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Newspaper, 
  TrendingUp, 
  Swords, 
  Radio, 
  ArrowRight 
} from 'lucide-react';
import { PageType } from '../types';

interface WhatYouFindSectionProps {
  onNavigate?: (page: PageType) => void;
}

export const WhatYouFindSection: React.FC<WhatYouFindSectionProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handlePillarClick = (actionPage: PageType) => {
    if (onNavigate) {
      onNavigate(actionPage);
    } else {
      navigate('/' + actionPage);
    }
  };
  const pillars = [
    {
      id: 'guias',
      title: 'Guias & Tutoriais',
      subtitle: 'Do básico ao avançado',
      description: 'Passo a passo didático e descomplicado para você dominar mecânicas complexas, rotas de coleta e rotações de combate.',
      icon: BookOpen,
      iconColor: 'text-amber-400',
      badge: 'Didático',
      bgGlow: 'hover:border-amber-500/50 group-hover:shadow-amber-500/10',
      actionPage: 'jogos' as PageType
    },
    {
      id: 'noticias',
      title: 'Notícias & Novidades',
      subtitle: 'Patches e notas oficiais',
      description: 'Cobertura completa de atualizações, novas temporadas, mudanças de itens, notas de patch e lançamentos do gênero.',
      icon: Newspaper,
      iconColor: 'text-cyan-400',
      badge: 'Atualizado',
      bgGlow: 'hover:border-cyan-500/50 group-hover:shadow-cyan-500/10',
      actionPage: 'jogos' as PageType
    },
    {
      id: 'dicas',
      title: 'Dicas de Evolução',
      subtitle: 'Acelere seu progresso',
      description: 'Métodos comprovados para farmar adena, prata, gerenciar Quadro de Destino e quebrar barreiras de elo nas ranqueadas.',
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      badge: 'Eficiência',
      bgGlow: 'hover:border-emerald-500/50 group-hover:shadow-emerald-500/10',
      actionPage: 'jogos' as PageType
    },
    {
      id: 'builds',
      title: 'Builds & Estratégias',
      subtitle: 'Composições do Meta',
      description: 'Equipamentos refinados, sinergias de runas, talentos de classe e táticas de ZvZ e Sieges testadas em alto nível.',
      icon: Swords,
      iconColor: 'text-rose-400',
      badge: 'Meta S-Tier',
      bgGlow: 'hover:border-rose-500/50 group-hover:shadow-rose-500/10',
      actionPage: 'jogos' as PageType
    },
    {
      id: 'canal',
      title: 'Novidades do Canal',
      subtitle: 'Lives, eventos e guilda',
      description: 'Cronograma de transmissões ao vivo, recrutamento da guilda no Discord, sorteios de skins e participação dos inscritos.',
      icon: Radio,
      iconColor: 'text-orange-400',
      badge: 'Comunidade',
      bgGlow: 'hover:border-orange-500/50 group-hover:shadow-orange-500/10',
      actionPage: 'redes-sociais' as PageType
    }
  ];

  return (
    <section className="py-16 bg-[#090b10] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Conteúdo Especializado
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mt-3 mb-3">
            O que você encontra aqui?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Tudo o que você precisa em um só portal gamer para se manter à frente em Albion Online e Lineage 2.
          </p>
        </div>

        {/* Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            // Center the 5th item nicely on large screens or span full width
            const isLast = index === 4;
            return (
              <div
                key={item.id}
                onClick={() => handlePillarClick(item.actionPage)}
                className={`group relative p-6 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800 transition-all duration-300 cursor-pointer shadow-lg ${item.bgGlow} ${
                  isLast ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {item.badge}
                  </span>
                </div>

                <div className="text-xs font-mono text-zinc-500 mb-1">{item.subtitle}</div>
                <h3 className="font-cinzel text-xl font-bold text-zinc-100 group-hover:text-amber-300 transition-colors mb-2">
                  {item.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300 pt-2 border-t border-zinc-800/80">
                  <span>Acessar seção</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
