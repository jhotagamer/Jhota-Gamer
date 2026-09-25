import React from 'react';
import { Guide } from '../types';
import { X, Clock, Calendar, BookOpen, CheckCircle2, AlertTriangle, User, Share2, Youtube } from 'lucide-react';

interface GuideReaderModalProps {
  guide: Guide | null;
  onClose: () => void;
}

export const GuideReaderModal: React.FC<GuideReaderModalProps> = ({ guide, onClose }) => {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0c0f17] border border-amber-500/30 shadow-2xl my-8 overflow-hidden">
        
        {/* Header bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {guide.category}
            </span>
            <span className="text-xs text-zinc-400 font-semibold">{guide.gameName}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar guia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-mono mb-3">
              <span className="flex items-center gap-1 text-amber-400">
                <User className="w-3.5 h-3.5" />
                <span>Por {guide.author}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{guide.readTime}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{guide.publishedDate}</span>
              </span>
            </div>

            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
              {guide.title}
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 italic border-l-2 border-amber-400 pl-4 py-1 mb-6 bg-zinc-900/40">
              {guide.summary}
            </p>
          </div>

          {/* Intro */}
          <div className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            {guide.content.intro}
          </div>

          {/* Sections */}
          <div className="space-y-8 pt-4">
            {guide.content.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-amber-300">
                  {sec.heading}
                </h3>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {sec.text}
                </p>

                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className="space-y-2 pl-2">
                    {sec.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sec.tipBox && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>{sec.tipBox}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <h4 className="font-cinzel text-base font-bold text-white">
              Conclusão & Próximos Passos
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {guide.content.conclusion}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
            {guide.tags.map((t, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-zinc-900 text-xs text-zinc-400 border border-zinc-800 font-mono">
                #{t}
              </span>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-600/20 via-amber-500/20 to-zinc-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-300 text-center sm:text-left">
              Gostou deste guia? Inscreva-se no canal para acompanhar os tutoriais em vídeo!
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.youtube.com/@JhotaGamerOficial"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>Canal no YouTube</span>
              </a>
              <button
                onClick={onClose}
                className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 cursor-pointer"
              >
                Concluir Leitura
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
