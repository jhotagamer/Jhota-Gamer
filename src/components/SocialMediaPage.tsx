import React from 'react';
import { SocialMedia, BioData } from '../types';
import { 
  Share2, 
  Youtube, 
  MessageSquare, 
  Instagram, 
  Tv, 
  Facebook, 
  ExternalLink, 
  Sparkles, 
  Users, 
  Bell,
  ArrowUpRight,
  CheckCircle2,
  Radio
} from 'lucide-react';

interface SocialMediaPageProps {
  socials: SocialMedia[];
  bio?: BioData;
  onUpdateSocials?: (socials: SocialMedia[]) => void;
  onUpdateBio?: (bio: BioData) => void;
}

interface PlatformConfig {
  name: string;
  brandColor: string;
  gradient: string;
  ambientGradient: string;
  borderHover: string;
  glowHover: string;
  badgeBorder: string;
  badgeDot: string;
  actionText: string;
  actionBg: string;
  accentText: string;
}

const platformConfigs: Record<string, PlatformConfig> = {
  instagram: {
    name: 'Instagram',
    brandColor: '#E1306C',
    gradient: 'from-purple-600 via-pink-600 to-amber-500',
    ambientGradient: 'from-pink-600/25 via-purple-600/15 to-transparent',
    borderHover: 'hover:border-pink-500/70',
    glowHover: 'hover:shadow-[0_12px_45px_-10px_rgba(236,72,153,0.4)]',
    badgeBorder: 'group-hover:border-pink-500/40 group-hover:text-pink-300',
    badgeDot: 'bg-pink-400',
    actionText: 'Seguir no Instagram',
    actionBg: 'group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-rose-600',
    accentText: 'group-hover:text-pink-400'
  },
  youtube: {
    name: 'YouTube',
    brandColor: '#FF0000',
    gradient: 'from-red-600 via-red-600 to-rose-700',
    ambientGradient: 'from-red-600/25 via-red-800/15 to-transparent',
    borderHover: 'hover:border-red-500/70',
    glowHover: 'hover:shadow-[0_12px_45px_-10px_rgba(239,68,68,0.4)]',
    badgeBorder: 'group-hover:border-red-500/40 group-hover:text-red-300',
    badgeDot: 'bg-red-400',
    actionText: 'Inscrever-se no Canal',
    actionBg: 'group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-rose-600',
    accentText: 'group-hover:text-red-400'
  },
  discord: {
    name: 'Discord',
    brandColor: '#5865F2',
    gradient: 'from-indigo-600 via-indigo-600 to-blue-700',
    ambientGradient: 'from-indigo-600/25 via-blue-800/15 to-transparent',
    borderHover: 'hover:border-indigo-500/70',
    glowHover: 'hover:shadow-[0_12px_45px_-10px_rgba(99,102,241,0.4)]',
    badgeBorder: 'group-hover:border-indigo-500/40 group-hover:text-indigo-300',
    badgeDot: 'bg-indigo-400',
    actionText: 'Entrar no Servidor',
    actionBg: 'group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-600',
    accentText: 'group-hover:text-indigo-400'
  },
  twitch: {
    name: 'Twitch',
    brandColor: '#9146FF',
    gradient: 'from-purple-600 via-purple-700 to-violet-900',
    ambientGradient: 'from-purple-600/25 via-violet-800/15 to-transparent',
    borderHover: 'hover:border-purple-500/70',
    glowHover: 'hover:shadow-[0_12px_45px_-10px_rgba(168,85,247,0.4)]',
    badgeBorder: 'group-hover:border-purple-500/40 group-hover:text-purple-300',
    badgeDot: 'bg-purple-400',
    actionText: 'Acompanhar Lives',
    actionBg: 'group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-violet-600',
    accentText: 'group-hover:text-purple-400'
  },
  facebook: {
    name: 'Facebook',
    brandColor: '#1877F2',
    gradient: 'from-blue-600 via-blue-700 to-blue-900',
    ambientGradient: 'from-blue-600/25 via-blue-800/15 to-transparent',
    borderHover: 'hover:border-blue-500/70',
    glowHover: 'hover:shadow-[0_12px_45px_-10px_rgba(59,130,246,0.4)]',
    badgeBorder: 'group-hover:border-blue-500/40 group-hover:text-blue-300',
    badgeDot: 'bg-blue-400',
    actionText: 'Curtir Página',
    actionBg: 'group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700',
    accentText: 'group-hover:text-blue-400'
  }
};

export const SocialMediaPage: React.FC<SocialMediaPageProps> = ({
  socials,
  bio,
  onUpdateSocials,
  onUpdateBio
}) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <Youtube className="w-7 h-7 text-white" />;
      case 'discord': return <MessageSquare className="w-7 h-7 text-white" />;
      case 'twitch': return <Tv className="w-7 h-7 text-white" />;
      case 'instagram': return <Instagram className="w-7 h-7 text-white" />;
      case 'facebook': return <Facebook className="w-7 h-7 text-white" />;
      default: return <Share2 className="w-7 h-7 text-white" />;
    }
  };

  const activeSocials = socials.filter((s) => s.platform !== 'tiktok');
  const featuredYouTube = activeSocials.find((s) => s.platform === 'youtube');
  const discordSocial = activeSocials.find((s) => s.platform === 'discord');

  return (
    <div className="py-12 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Comunidade & Conexão Oficial</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white mb-4">
            Redes Sociais do <span className="text-amber-400">Jhota Gamer</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Faça parte da nossa comunidade gamer! Clique em qualquer rede para ser direcionado ao perfil oficial.
          </p>
        </div>

        {featuredYouTube && (
          <div className="mb-12 relative rounded-3xl p-1 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 shadow-2xl shadow-red-950/40">
            <div className="relative rounded-[22px] bg-gradient-to-br from-[#12080a] to-[#1c0e12] p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-600/40 shrink-0">
                  <Youtube className="w-12 h-12" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Canal Principal &bull; Destaque Oficial</span>
                  </div>
                  <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white mb-2">
                    Canal Jhota Gamer no YouTube
                  </h2>
                  <p className="text-sm text-zinc-300 max-w-xl leading-relaxed mb-4">
                    {featuredYouTube.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-zinc-400">
                    <span className="text-amber-300 font-bold text-sm bg-red-950/60 px-3 py-1 rounded-lg border border-red-800/40">
                      Acesse o canal
                    </span>
                    <span>&bull;</span>
                    <span>Vídeos do canal</span>
                    <span>&bull;</span>
                    <span>Lives de Albion e Lineage 2</span>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-auto shrink-0">
                <a
                  href={featuredYouTube.url || 'https://www.youtube.com/@JhotaGamerOficial'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-red-600 hover:bg-red-500 flex items-center justify-center gap-2.5 shadow-xl shadow-red-600/30 transition-all transform hover:-translate-y-1 active:scale-98 cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span>Inscrever-se & Ativar Notificações</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-800">
          <div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Todas as Redes Sociais
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Clique em qualquer card para ser direcionado à rede social correspondente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSocials.map((social) => {
            const cfg = platformConfigs[social.platform] || {
              name: social.name,
              brandColor: '#F59E0B',
              gradient: social.themeColor || 'from-amber-500 to-orange-600',
              ambientGradient: 'from-amber-500/25 to-transparent',
              borderHover: 'hover:border-amber-500/70',
              glowHover: 'hover:shadow-[0_12px_45px_-10px_rgba(245,158,11,0.4)]',
              badgeBorder: 'group-hover:border-amber-500/40 group-hover:text-amber-300',
              badgeDot: 'bg-amber-400',
              actionText: social.ctaText || 'Acessar Rede Social',
              actionBg: 'group-hover:bg-amber-500 group-hover:text-black',
              accentText: 'group-hover:text-amber-400'
            };

            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative p-6 sm:p-7 rounded-2xl bg-[#0c1017]/95 border border-zinc-800/90 ${cfg.borderHover} ${cfg.glowHover} transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.99] flex flex-col justify-between overflow-hidden cursor-pointer select-none shadow-xl`}
              >
                <div className={`absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br ${cfg.ambientGradient} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none`} />
                <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
                  <div className="relative">
                    <div className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-br ${cfg.gradient} opacity-30 group-hover:opacity-85 blur-md transition-all duration-300`} />
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      {getPlatformIcon(social.platform)}
                    </div>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-3 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 text-zinc-300 ${cfg.badgeBorder} transition-colors flex items-center gap-2 shadow-sm`}>
                    <span className={`w-2 h-2 rounded-full ${cfg.badgeDot} animate-pulse`} />
                    <span>Perfil do Jhota Gamer</span>
                  </span>
                </div>
                <div className="mb-2.5 relative z-10">
                  <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-white group-hover:text-white transition-colors flex items-center gap-2">
                    <span>{social.name}</span>
                  </h4>
                  <div className={`text-xs font-mono font-semibold text-zinc-400 ${cfg.accentText} transition-colors mt-0.5`}>
                    {social.username}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-300 leading-relaxed mb-6 transition-colors line-clamp-2 relative z-10">
                  {social.description}
                </p>
                <div className="pt-4 border-t border-zinc-800/80 group-hover:border-zinc-700/80 flex items-center justify-between text-xs font-bold transition-all relative z-10">
                  <span className={`text-zinc-300 ${cfg.accentText} transition-colors font-medium flex items-center gap-1.5`}>
                    <span>{social.ctaText || cfg.actionText}</span>
                  </span>
                  <div className={`w-8 h-8 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 ${cfg.actionBg} group-hover:text-white flex items-center justify-center shadow transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-0.5`}>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {discordSocial && (
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-zinc-900 to-zinc-950 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/30">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h3 className="font-cinzel text-xl font-bold text-white">
                    Comunidade Oficial no Discord
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    Participe da comunidade
                  </span>
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                  Salas de voz para guerras territoriais no Albion, parties de raid e PvP no Lineage 2 e recrutamento para a guilda oficial.
                </p>
              </div>
            </div>
            <a
              href={discordSocial.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Entrar no Discord Agora</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
};
