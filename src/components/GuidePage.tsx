import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Share2, 
  MessageCircle, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Gamepad2,
  Check
} from 'lucide-react';
import { Guide } from '../types';
import { initialGuides } from '../data/initialData';

export const GuidePage: React.FC = () => {
  const { gameId, guideId } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Busca o guia baseado no ID da URL
    const foundGuide = initialGuides.find(g => g.id === guideId);
    setGuide(foundGuide || null);

    // Rola para o topo ao carregar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [guideId]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#090b10] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
        <h1 className="font-cinzel text-2xl font-bold text-white mb-2">Guia não encontrado</h1>
        <p className="text-zinc-400 mb-6">O conteúdo que você procura pode ter sido movido ou removido.</p>
        <button 
          onClick={() => navigate('/jogos')}
          className="px-6 py-2 bg-amber-500 text-zinc-950 font-bold rounded-full hover:bg-amber-400 transition-colors cursor-pointer"
        >
          Voltar para Jogos
        </button>
      </div>
    );
  }

  // Busca outros guias do mesmo jogo
  const relatedGuides = initialGuides
    .filter(g => g.gameId === (gameId || guide.gameId) && g.id !== guide.id)
    .slice(0, 2);

  const gameDisplayName = (gameId || guide.gameId).replace('-', ' ');

  return (
    <div className="bg-[#090b10] min-h-screen text-zinc-100 font-sans pb-20">
      
      {/* Top Navigation / Breadcrumbs */}
      <nav className="bg-zinc-950/80 border-b border-zinc-800 sticky top-18 z-30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate(`/jogo/${gameId || guide.gameId}`)}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Portal do Jogo</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              title="Copiar link do guia"
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer relative"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <a 
              href="https://discord.gg/Uq9pnCwDkq"
              target="_blank"
              rel="noopener noreferrer"
              title="Tirar dúvidas no Discord"
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <article className="max-w-4xl mx-auto px-4 pt-8 sm:pt-12">
        
        {/* Header do Artigo */}
        <header className="mb-10 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {guide.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
              <Clock className="w-3 h-3" />
              <span>{guide.readTime} de leitura</span>
            </div>
            <span className="text-xs text-zinc-500 font-mono">&bull; {guide.gameName}</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white leading-tight mb-6">
            {guide.title}
          </h1>

          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-zinc-950 text-xl">
              J
            </div>
            <div>
              <p className="text-sm font-bold text-white">{guide.author || 'Jhota Gamer'}</p>
              <p className="text-xs text-zinc-500">Especialista em MMORPGs</p>
            </div>
            <div className="ml-auto hidden sm:block text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter block">Publicado: {guide.publishedDate}</span>
              <span className="text-[10px] text-amber-400 font-mono">Nível: {guide.recommendedLevel}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar: Sumário (Só aparece em telas grandes) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800">
              <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Neste Guia
              </h3>
              <ul className="space-y-3 text-xs text-zinc-400">
                <li 
                  onClick={() => document.getElementById('guia-introducao')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-amber-300 cursor-pointer transition-colors"
                >
                  Introdução
                </li>
                {guide.content?.sections?.map((sec, idx) => (
                  <li 
                    key={idx}
                    onClick={() => document.getElementById(`guia-secao-${idx}`)?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-amber-300 cursor-pointer transition-colors truncate"
                  >
                    {sec.heading}
                  </li>
                ))}
                <li 
                  onClick={() => document.getElementById('guia-conclusao')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-amber-300 cursor-pointer transition-colors"
                >
                  Conclusão
                </li>
              </ul>
            </div>
          </aside>

          {/* Texto do Guia */}
          <div className="lg:col-span-9 max-w-none">
            
            <div className="text-zinc-300 leading-relaxed space-y-6 text-base sm:text-lg">
              
              {/* Introdução & Resumo */}
              <div id="guia-introducao" className="space-y-4">
                <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left text-zinc-200">
                  {guide.summary}
                </p>
                {guide.content?.intro && (
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                    {guide.content.intro}
                  </p>
                )}
              </div>

              {/* Dica do Jhota de Destaque */}
              <div className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 flex gap-3 my-8">
                <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                  <strong className="text-amber-300 block mb-1">Dica do Jhota:</strong>
                  <p className="text-sm text-zinc-300">
                    Não tente pular etapas! O segredo para evoluir rápido no {gameDisplayName} é a consistência.
                  </p>
                </div>
              </div>

              {/* Seções Reais do Guia */}
              {guide.content?.sections?.map((section, idx) => (
                <div key={idx} id={`guia-secao-${idx}`} className="pt-6 border-t border-zinc-800/80 mt-8 space-y-4">
                  <h2 className="font-cinzel text-2xl font-bold text-white flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <span>{section.heading}</span>
                  </h2>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {section.text}
                  </p>

                  {/* Bullet points da seção */}
                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="space-y-2.5 my-4">
                      {section.bulletPoints.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tip box se houver */}
                  {section.tipBox && (
                    <div className="p-4 rounded-xl bg-cyan-950/20 border-l-4 border-cyan-400 text-cyan-200 text-xs sm:text-sm">
                      <strong className="block text-cyan-300 mb-1">Anotação Tática:</strong>
                      {section.tipBox}
                    </div>
                  )}
                </div>
              ))}

              {/* Conclusão / Checklist Final */}
              <div id="guia-conclusao" className="pt-8 border-t border-zinc-800/80 mt-10">
                <h2 className="font-cinzel text-2xl font-bold text-white mb-4">
                  Conclusão & Checklist Final
                </h2>
                {guide.content?.conclusion && (
                  <p className="text-sm sm:text-base text-zinc-300 mb-6 leading-relaxed">
                    {guide.content.conclusion}
                  </p>
                )}

                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Checklist Final para a Missão
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Equipamento correto revisado', 'Consumíveis comprados no inventário', 'Rota ou objetivo traçado', 'Buffs e grupo alinhados'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                        <div className="w-4 h-4 rounded border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer do Artigo: Guias Relacionados */}
            <section className="mt-16 pt-8 border-t border-zinc-800">
              <h3 className="font-cinzel text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-amber-400" />
                Você também pode gostar:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedGuides.length > 0 ? (
                  relatedGuides.map(related => (
                    <Link 
                      key={related.id}
                      to={`/jogo/${related.gameId}/guia/${related.id}`}
                      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">{related.category}</span>
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white line-clamp-1">{related.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors shrink-0 ml-2" />
                    </Link>
                  ))
                ) : (
                  [1, 2].map(i => (
                    <Link 
                      key={i}
                      to={`/jogo/${gameId || guide.gameId}`}
                      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all group flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Explorar mais conteúdos de {gameDisplayName}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                    </Link>
                  ))
                )}
              </div>
            </section>

          </div>
        </div>
      </article>

      {/* Botão Flutuante para Discord (CTA) */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://discord.gg/Uq9pnCwDkq" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#5865F2] text-white font-bold shadow-xl hover:bg-[#4752C4] transition-all transform hover:scale-105"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Entrar na Comunidade</span>
        </a>
      </div>

    </div>
  );
};
