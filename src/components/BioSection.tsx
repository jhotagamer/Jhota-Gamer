import React from 'react';
import { BioData } from '../types';
import { 
  User, 
  Trophy, 
  Calendar, 
  Target, 
  Edit3, 
  CheckCircle2, 
  Youtube, 
  Shield, 
  Flame 
} from 'lucide-react';

interface BioSectionProps {
  bio: BioData;
  onOpenCustomizer: () => void;
}

export const BioSection: React.FC<BioSectionProps> = ({
  bio,
  onOpenCustomizer
}) => {
  return (
    <section id="secao-biografia" className="relative py-16 lg:py-20 bg-[#0c0f17] border-b border-zinc-800/80">
      
      {/* Background accents */}
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5" />
              <span>Apresentação & Trajetória</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Conheça o <span className="text-amber-400">{bio.brandName}</span>
            </h2>
          </div>

          {/* Notice & Quick Edit Trigger */}
          <button
            id="bio-edit-shortcut-btn"
            onClick={onOpenCustomizer}
            className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-xs font-semibold text-amber-300 border border-amber-500/30 transition-all cursor-pointer shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Editar Minha Biografia & Foto</span>
          </button>
        </div>

        {/* Main Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Avatar Card & Channel Stats */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Avatar Frame */}
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-amber-500/30 via-zinc-800/80 to-zinc-900 shadow-2xl shadow-black/80">
              <div className="rounded-[15px] overflow-hidden bg-zinc-950 flex flex-col">
                {/* Photo Display - Square (1:1) to match 800x800 image perfectly with zero zoom/cropping */}
                <div className="relative w-full aspect-square overflow-hidden bg-[#090b10] flex items-center justify-center">
                  <img
                    src={bio.avatarUrl}
                    alt={bio.brandName}
                    className="w-full h-full object-contain object-center transition-transform duration-500 hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://i.postimg.cc/502CTWWH/foto-de-perfil.png";
                    }}
                  />
                </div>

                {/* Info Bar positioned cleanly BELOW the photo so it does not block the avatar */}
                <div className="p-4 bg-zinc-900/95 border-t border-zinc-800/90 flex items-center justify-between">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                      {bio.brandName}
                      <Shield className="w-4 h-4 text-amber-400 inline" />
                    </h3>
                    <p className="text-xs text-zinc-400">Criador de Conteúdo & Estrategista</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 uppercase tracking-wider">
                    PRO GAMER
                  </span>
                </div>
              </div>
            </div>

            {/* Channel Quick Stats Bento */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 text-center">
                <div className="text-2xl font-bold font-rajdhani text-amber-400">{bio.stats.subscribers}</div>
                <div className="text-xs text-zinc-400 font-medium">Inscritos no YouTube</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 text-center">
                <div className="text-2xl font-bold font-rajdhani text-rose-400">{bio.stats.videos}</div>
                <div className="text-xs text-zinc-400 font-medium">Vídeos & Guias</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 text-center">
                <div className="text-2xl font-bold font-rajdhani text-cyan-400">{bio.stats.yearsGaming}</div>
                <div className="text-xs text-zinc-400 font-medium">Experiência Gamer</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 text-center">
                <div className="text-2xl font-bold font-rajdhani text-emerald-400">{bio.stats.guildMembers}</div>
                <div className="text-xs text-zinc-400 font-medium">Membros no Discord</div>
              </div>
            </div>

          </div>

          {/* Right Column: Bio Narrative, Trajectory & Objectives */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Biography Paragraphs */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="font-cinzel text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>História e Propósito do Canal</span>
                </h3>
                <span className="text-[11px] font-semibold text-amber-400/80 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  Texto Editável
                </span>
              </div>

              <div className="space-y-3.5 text-zinc-300 leading-relaxed font-sans text-sm sm:text-base">
                {bio.bioParagraphs.map((paragraph, idx) => {
                  const cleaned = paragraph
                    .replace(/,\s*e o ritmo tático de Summoner's Rift no League of Legends/gi, '')
                    .replace(/e o ritmo tático de Summoner's Rift no League of Legends/gi, '')
                    .replace(/no League of Legends/gi, '')
                    .replace(/League of Legends/gi, '');
                  return (
                    <p key={idx} className={idx === bio.bioParagraphs.length - 1 ? "text-xs text-amber-400/80 italic font-mono pt-2" : ""}>
                      {cleaned}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Trajectory Timeline */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <h3 className="font-cinzel text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-400" />
                  <span>Trajetória Gamer</span>
                </h3>
                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Desde 2006 • 18+ Anos de Estrada</span>
                </span>
              </div>

              {/* Introdução da Trajetória */}
              <div className="mb-6 p-4 sm:p-5 rounded-xl bg-zinc-950/70 border border-amber-500/20 text-zinc-300 text-sm sm:text-base leading-relaxed relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 via-orange-500 to-rose-500" />
                <p className="font-sans pl-1.5 text-zinc-200">
                  {bio.trajectoryIntro || "Comecei a jogar com 14 anos no ano de 2006, jogando em lan house com amigos, e de lá para cá nunca deixei de me aventurar em diversos jogos."}
                </p>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-zinc-800">
                {bio.trajectory
                  .filter(item => 
                    !item.title.toLowerCase().includes('summoner') && 
                    !item.description.toLowerCase().includes('summoner') &&
                    !item.description.toLowerCase().includes('league of legends') &&
                    !item.title.toLowerCase().includes('rift') &&
                    !item.title.toLowerCase().includes('criação de conteúdo') &&
                    item.year !== '2015'
                  )
                  .map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-4 border-[#0c0f17] shadow-sm" />
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-zinc-800 text-amber-400 mb-1 border border-zinc-700">
                        {item.year}
                      </span>
                      <h4 className="font-rajdhani text-base sm:text-lg font-bold text-white">
                        {item.year === '2006' ? 'A Era de Ouro do Lineage 2' : item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel Objectives */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <h3 className="font-cinzel text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span>Objetivos com o Canal & Comunidade</span>
              </h3>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bio.channelObjectives
                  .filter(obj =>
                    !obj.toLowerCase().includes('league of legends') &&
                    !obj.toLowerCase().includes('lol') &&
                    !obj.toLowerCase().includes('diamante') &&
                    !obj.toLowerCase().includes('summoner') &&
                    !obj.toLowerCase().includes('riot')
                  )
                  .map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs sm:text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
