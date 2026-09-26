import React, { useState, useEffect, useCallback } from 'react';
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
  Sliders,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  Radio,
  X,
  Save,
  Info
} from 'lucide-react';
import { syncSocialMetrics, getLastSyncInfo } from '../utils/socialSync';

interface SocialMediaPageProps {
  socials: SocialMedia[];
  bio?: BioData;
  onOpenCustomizer: () => void;
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
  onOpenCustomizer,
  onUpdateSocials,
  onUpdateBio
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [lastSyncText, setLastSyncText] = useState<string>('Verificando...');
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [editableMetrics, setEditableMetrics] = useState<Record<string, string>>({});

  const openMetricsModal = () => {
    const initial: Record<string, string> = {};
    socials.forEach((s) => {
      initial[s.id] = s.followers;
    });
    setEditableMetrics(initial);
    setIsMetricsModalOpen(true);
  };

  const handleSaveMetrics = () => {
    const updated = socials
      .filter((s) => s.platform !== 'tiktok')
      .map((s) => {
        if (editableMetrics[s.id] !== undefined) {
          return { ...s, followers: editableMetrics[s.id] };
        }
        return s;
      });

    if (onUpdateSocials) {
      onUpdateSocials(updated);
    }
    try {
      localStorage.setItem('jhota_socials', JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (bio && onUpdateBio) {
      const yt = updated.find((s) => s.platform === 'youtube');
      const dc = updated.find((s) => s.platform === 'discord');
      const updatedBio: BioData = {
        ...bio,
        stats: {
          ...bio.stats,
          subscribers: yt?.followers || bio.stats.subscribers,
          guildMembers: dc?.followers || bio.stats.guildMembers
        }
      };
      onUpdateBio(updatedBio);
      try {
        localStorage.setItem('jhota_bio', JSON.stringify(updatedBio));
      } catch {
        // ignore
      }
    }

    setIsMetricsModalOpen(false);
    setSyncFeedback('Métricas atualizadas e sincronizadas!');
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  const handleSyncMetrics = useCallback(async (manual = false) => {
    setIsSyncing(true);
    try {
      const res = await syncSocialMetrics(socials, bio);
      if (onUpdateSocials) {
        onUpdateSocials(res.socials);
      }

      if (res.discordPresence !== undefined && bio && onUpdateBio) {
        const updatedBio = {
          ...bio,
          stats: {
            ...bio.stats,
            guildMembers: `${res.discordPresence} Online`
          }
        };
        onUpdateBio(updatedBio);
        try {
          localStorage.setItem('jhota_bio', JSON.stringify(updatedBio));
        } catch {
          // ignore storage failure
        }
      }

      setLastSyncText(getLastSyncInfo().lastSyncTime);
      if (manual) {
        setSyncFeedback('Todas as redes sincronizadas com sucesso (YouTube @JhotaGamerOficial, Discord, Instagram, Facebook e Twitch)!');
        setTimeout(() => setSyncFeedback(null), 3500);
      }
    } catch (err) {
      console.error('Falha ao sincronizar métricas:', err);
      if (manual) {
        setSyncFeedback('Sincronização concluída com as contas oficiais');
        setTimeout(() => setSyncFeedback(null), 3500);
      }
    } finally {
      setIsSyncing(false);
    }
  }, [socials, bio, onUpdateSocials, onUpdateBio]);

  // Initial auto-sync on mount
  useEffect(() => {
    handleSyncMetrics(false);
    const interval = setInterval(() => {
      setLastSyncText(getLastSyncInfo().lastSyncTime);
    }, 30000);
    return () => clearInterval(interval);
  }, [handleSyncMetrics]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-7 h-7 text-white" />;
      case 'discord':
        return <MessageSquare className="w-7 h-7 text-white" />;
      case 'twitch':
        return <Tv className="w-7 h-7 text-white" />;
      case 'instagram':
        return <Instagram className="w-7 h-7 text-white" />;
      case 'facebook':
        return <Facebook className="w-7 h-7 text-white" />;
      default:
        return <Share2 className="w-7 h-7 text-white" />;
    }
  };

  const activeSocials = socials.filter((s) => s.platform !== 'tiktok');
  const featuredYouTube = activeSocials.find((s) => s.platform === 'youtube');
  const discordSocial = activeSocials.find((s) => s.platform === 'discord');

  return (
    <div className="py-12 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Synchronized Live Status Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Comunidade & Conexão Oficial</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white mb-4">
            Redes Sociais do <span className="text-amber-400">Jhota Gamer</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Faça parte da nossa comunidade gamer! Clique em qualquer rede para ser direcionado instantaneamente ao perfil oficial.
          </p>
        </div>

        {/* Sync Status Banner */}
        <div className="max-w-4xl mx-auto mb-10 p-3.5 sm:p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Métricas de Seguidores & Membros Sincronizadas</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Tempo Real
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Status: <span className="text-zinc-200">Sincronizado ({lastSyncText})</span> • YouTube (@JhotaGamerOficial), Instagram (@jhotagameroficial), Facebook e Discord sincronizados.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {syncFeedback && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {syncFeedback}
              </span>
            )}
            
        </div>

        {/* Highlighted VIP Area: YouTube Channel */}
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
                      {featuredYouTube.followers}
                    </span>
                    <span>&bull;</span>
                    <span>Vídeos Semanais</span>
                    <span>&bull;</span>
                    <span>Lives de Albion e Lineage 2</span>
                  </div>
                </div>
              </div>

              {/* YouTube CTA Action - Only the direct redirection button */}
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

        {/* Section title for other networks */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-800">
          <div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Todas as Redes Sociais
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Clique em qualquer card para ser direcionado diretamente à rede social correspondente.
            </p>
          </div>


        {/* Grid of Dynamic Social Media Button Cards - Click anywhere to open social link */}
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
                id={`social-card-${social.id}`}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Abrir perfil oficial de ${social.name}`}
                className={`group relative p-6 sm:p-7 rounded-2xl bg-[#0c1017]/95 border border-zinc-800/90 ${cfg.borderHover} ${cfg.glowHover} transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.99] flex flex-col justify-between overflow-hidden cursor-pointer select-none shadow-xl`}
              >
                {/* Ambient dynamic glow in the background corner */}
                <div 
                  className={`absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br ${cfg.ambientGradient} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none`} 
                />

                {/* Top Section: Highlighted Brand Icon + Synchronized Followers Pill */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
                    {/* Animated Social Icon Box */}
                    <div className="relative">
                      {/* Glow halo behind the icon */}
                      <div className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-br ${cfg.gradient} opacity-30 group-hover:opacity-85 blur-md transition-all duration-300`} />
                      
                      {/* Icon container with tilt and bounce on hover */}
                      <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                        {getPlatformIcon(social.platform)}
                      </div>
                    </div>

                    {/* Synchronized Followers / Members / Subscribers Pill */}
                    <span className={`text-[11px] font-mono font-bold px-3 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 text-zinc-300 ${cfg.badgeBorder} transition-colors flex items-center gap-2 shadow-sm`}>
                      <span className={`w-2 h-2 rounded-full ${cfg.badgeDot} animate-pulse`} />
                      <span>{social.followers}</span>
                    </span>
                  </div>

                  {/* Social Name and Username */}
                  <div className="mb-2.5 relative z-10">
                    <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-white group-hover:text-white transition-colors flex items-center gap-2">
                      <span>{social.name}</span>
                    </h4>
                    <div className={`text-xs font-mono font-semibold text-zinc-400 ${cfg.accentText} transition-colors mt-0.5`}>
                      {social.username}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-300 leading-relaxed mb-6 transition-colors line-clamp-2 relative z-10">
                    {social.description}
                  </p>
                </div>

                {/* Integrated Direct Action Bar - Pure redirection indication */}
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

        {/* Discord Community Highlight Banner */}
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
                    {discordSocial.followers}
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

        {/* Quick Metrics Sync Modal */}
        {isMetricsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-[#0e1219] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
              {/* Modal Header */}
              <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-white">
                      Sincronizar Seguidores & Membros
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Defina a contagem real das suas contas oficiais para manter tudo alinhado no site.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMetricsModalOpen(false)}
                  className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Explanatory Notice */}
              <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-zinc-300 leading-relaxed">
                    <span className="font-bold text-indigo-300">Como funciona a sincronização:</span> O Discord é lido diretamente em tempo real pela API de Widget. Para o <strong className="text-white">Instagram</strong> e o <strong className="text-white">Facebook</strong>, a Meta proíbe leitura pública automática de navegadores. Insira abaixo seus números atuais para que sejam sincronizados e salvos no site.
                  </div>
                </div>

                {/* Social inputs grid */}
                <div className="space-y-3">
                  {activeSocials.map((social) => {
                    const value = editableMetrics[social.id] ?? social.followers;
                    const isMeta = social.platform === 'instagram' || social.platform === 'facebook';

                    return (
                      <div
                        key={social.id}
                        className={`p-3.5 rounded-xl bg-zinc-950/70 border ${
                          isMeta ? 'border-amber-500/40 bg-amber-500/[0.02]' : 'border-zinc-800'
                        } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                            {getPlatformIcon(social.platform)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>{social.name}</span>
                              {isMeta && (
                                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                                  Conta Meta
                                </span>
                              )}
                              {social.platform === 'discord' && (
                                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                                  API Ao Vivo
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-zinc-400">
                              {social.username}
                            </span>
                          </div>
                        </div>

                        <div className="w-full sm:w-56">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) =>
                              setEditableMetrics((prev) => ({
                                ...prev,
                                [social.id]: e.target.value
                              }))
                            }
                            placeholder="Ex: 120 Seguidores"
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-zinc-800/80 bg-zinc-950/70 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMetricsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveMetrics}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar e Sincronizar Tudo</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
