import React, { useState } from 'react';
import { UsefulLink } from '../types';
import { 
  Link as LinkIcon, 
  Search, 
  ExternalLink, 
  Globe, 
  Database, 
  Wrench, 
  Users, 
  Download, 
  Server, 
  PlusCircle, 
  Sliders, 
  ShieldCheck,
  Tag
} from 'lucide-react';

interface UsefulLinksPageProps {
  links: UsefulLink[];
  onOpenCustomizer: () => void;
}

export const UsefulLinksPage: React.FC<UsefulLinksPageProps> = ({
  links,
  onOpenCustomizer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todos os Links', icon: LinkIcon },
    { id: 'sites_oficiais', label: 'Sites Oficiais', icon: Globe },
    { id: 'wikis_databases', label: 'Wikis & Databases', icon: Database },
    { id: 'ferramentas', label: 'Ferramentas & Calculadoras', icon: Wrench },
    { id: 'comunidades', label: 'Comunidades & Fóruns', icon: Users },
    { id: 'servidores', label: 'Servidores & Recursos', icon: Server }
  ];

  const isLeagueOfLegendsLink = (link: UsefulLink) => {
    const text = `${link.title} ${link.description} ${link.gameRelated || ''} ${link.tags?.join(' ') || ''} ${link.url}`.toLowerCase();
    return (
      text.includes('league of legends') ||
      text.includes('riot games') ||
      text.includes('summoner') ||
      text.includes('op.gg') ||
      text.includes('u.gg') ||
      text.includes('lolalytics') ||
      /\b(lol|moba|rift)\b/i.test(text)
    );
  };

  const isInvalidLink = (link: UsefulLink) => {
    if (isLeagueOfLegendsLink(link)) return true;
    const url = (link.url || '').toLowerCase();
    const title = (link.title || '').toLowerCase();

    // Filter out official retail Lineage 2 sites (NCSoft / 4game / lineage2.com)
    if (url.includes('lineage2.com') || url.includes('plaync.com') || url.includes('4game.com')) {
      return true;
    }
    if ((title.includes('lineage 2') || title.includes('lineage ii')) && title.includes('oficial') && !title.includes('exilium') && !url.includes('exiliumworld')) {
      return true;
    }

    return false;
  };

  const filteredLinks = links
    .filter((link) => !isInvalidLink(link))
    .filter((link) => {
      const matchesSearch = 
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = 
        selectedCategory === 'todos' || 
        link.category === selectedCategory;

      const matchesGame = 
        selectedGameFilter === 'todos' || 
        link.gameRelated === selectedGameFilter ||
        (selectedGameFilter.includes('Lineage') && (link.gameRelated?.includes('Lineage') || link.gameRelated?.includes('Exilium')));

      return matchesSearch && matchesCategory && matchesGame;
    });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sites_oficiais':
        return <Globe className="w-5 h-5 text-amber-400" />;
      case 'wikis_databases':
        return <Database className="w-5 h-5 text-cyan-400" />;
      case 'ferramentas':
        return <Wrench className="w-5 h-5 text-emerald-400" />;
      case 'comunidades':
        return <Users className="w-5 h-5 text-indigo-400" />;
      case 'servidores':
        return <Server className="w-5 h-5 text-rose-400" />;
      default:
        return <LinkIcon className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="py-12 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Ferramentas & Recursos</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white mb-4">
            Links Úteis para a <span className="text-amber-400">Comunidade Gamer</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Coletânea verificada de bancos de dados, calculadoras de crafting, estatísticas de PvP, rankings e portais oficiais recomendados pelo Jhota Gamer.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 space-y-4">
          
          {/* Top Search and Add Link Button */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar link por nome, descrição ou tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950/80 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <select
                value={selectedGameFilter}
                onChange={(e) => setSelectedGameFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-amber-500"
              >
                <option value="todos">Todos os Jogos</option>
                <option value="Albion Online">Albion Online</option>
                <option value="Lineage 2 Exilium World">Lineage 2 Exilium World</option>
              </select>

              <button
                onClick={onOpenCustomizer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Adicionar / Editar Links</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`link-category-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link) => (
            <div
              key={link.id}
              id={`useful-link-card-${link.id}`}
              className="group p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                    {getCategoryIcon(link.category)}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {link.isOfficial && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Oficial</span>
                      </span>
                    )}
                    {link.gameRelated && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-amber-300 border border-zinc-700">
                        {link.gameRelated}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2 leading-snug">
                  {link.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                  {link.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {link.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-zinc-950 text-[10px] font-mono text-zinc-400 border border-zinc-800/80">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Acessar Recurso / Ferramenta</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredLinks.length === 0 && (
          <div className="p-12 rounded-2xl bg-zinc-900/30 border border-zinc-800 text-center">
            <p className="text-zinc-400 text-sm mb-3">Nenhum link encontrado para esta pesquisa ou filtro.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('todos'); setSelectedGameFilter('todos'); }}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-xs font-semibold text-amber-400 hover:bg-zinc-700"
            >
              Limpar Filtros
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
