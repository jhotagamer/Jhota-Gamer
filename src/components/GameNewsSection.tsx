import React from 'react';
import { ArrowUpRight, Calendar, ExternalLink } from 'lucide-react';
import { NewsItem } from '../types';

export function GameNewsSection({ news, gameId }: { news: NewsItem[]; gameId: string }) {
  const albion = gameId === 'albion-online';
  const source = albion ? 'Albion Online' : 'Exilium World';
  const ordered = [...news].sort((a, b) => {
    const key = (date: string) => date.split('/').reverse().join('-');
    return key(b.date).localeCompare(key(a.date));
  });
  return (
    <section className="space-y-7">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-zinc-800 pb-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">Radar Jhota Gamer</p>
          <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold">{albion ? 'Notícias de Albion Online' : 'Comunicados do Exilium World'}</h2>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">Resumos do Jhota Gamer com links para as fontes. {albion ? '' : 'Cobertura do servidor privado Exilium World.'}</p>
          <p className="text-xs text-zinc-500 mt-2">Seleção revisada em 26/09/2026 • Atualização manual</p>
        </div>
        <a href={albion ? 'https://albiononline.com/news' : 'https://www.exiliumworld.com/news'} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex gap-2 items-center rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-200 hover:border-amber-400 hover:text-amber-300 transition-colors">Ver mural da fonte <ExternalLink className="w-4 h-4" /></a>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ordered.map((item, index) => (
          <article key={item.id} className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#10131c] hover:border-amber-500/50 transition-colors shadow-lg">
            <div className="relative aspect-video overflow-hidden bg-zinc-950">
              <img src={item.imageUrl} alt={`Arte ilustrativa da cobertura de ${source}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: albion ? '45% 40%' : '45% 20%' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10131c] via-transparent to-black/20" />
              <span className="absolute top-4 left-4 rounded-lg bg-zinc-950/90 px-3 py-1.5 text-xs font-bold text-amber-300">{item.category}</span>
              {index === 0 && <span className="absolute top-4 right-4 rounded-lg bg-amber-400 px-2 py-1.5 text-[10px] font-bold text-zinc-950 uppercase">Destaque</span>}
              <span className="absolute bottom-3 right-4 text-[10px] text-zinc-300">Arte ilustrativa • Jhota Gamer</span>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3"><Calendar className="w-3.5 h-3.5" /><span>Publicado em {item.date}</span></div>
              <h3 className="font-rajdhani text-2xl font-bold text-white leading-tight mb-3">{item.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">{item.snippet}</p>
              <div className="mt-auto border-t border-zinc-800 pt-4">
                <p className="text-xs text-zinc-500 mb-3">Fonte: {source}{albion ? ' • site oficial' : ' • servidor privado'}</p>
                {item.officialUrl && <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between gap-3 w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-zinc-950 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 transition-colors" aria-label={`${item.officialLabel || 'Ler na fonte'}: ${item.title} (nova aba)`}>{item.officialLabel || 'Ler na fonte'}<ArrowUpRight className="w-4 h-4 shrink-0" /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
      {!ordered.length && <p className="text-zinc-400 py-8">Nenhuma notícia selecionada para este jogo.</p>}
    </section>
  );
}
