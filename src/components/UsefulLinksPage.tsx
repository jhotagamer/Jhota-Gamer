import React from 'react';
import { UsefulLink } from '../types';
import { 
  Link as LinkIcon, 
  ExternalLink, 
  Globe, 
  Database, 
  ShieldCheck,
} from 'lucide-react';

interface UsefulLinksPageProps {
  links: UsefulLink[];
}

export const UsefulLinksPage: React.FC<UsefulLinksPageProps> = ({
  links,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sites_oficiais':
        return <Globe className="w-5 h-5 text-amber-400" />;
      case 'wikis_databases':
        return <Database className="w-5 h-5 text-cyan-400" />;
      default:
        return <LinkIcon className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="py-12 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Sites e wikis</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white mb-4">
            Links Úteis para a <span className="text-amber-400">Comunidade Gamer</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Acesse os sites oficiais e as wikis de Albion Online e Exilium World.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {links.map((link) => (
            <div
              key={link.id}
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
                  <span>Acessar site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
