import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Gamepad2, UserCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { OFFICIAL_BANNER_URL } from '../data/initialData';

interface HeroBannerProps {
  brandName?: string;
  tagline?: string;
  subTagline?: string;
  bannerUrl?: string;
  onExploreGames?: () => void;
  onLearnMoreBio?: () => void;
  onNavigate?: (page: 'home' | 'jogos' | 'redes' | 'links' | 'sobre') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  brandName = "Jhota Gamer",
  tagline = "Seu universo gamer começa aqui!",
  subTagline = "MMORPG • RPG • Sandbox • Guias • Builds • Notícias e Estratégias",
  bannerUrl,
  onExploreGames,
  onLearnMoreBio,
  onNavigate,
}) => {
  const [imgError, setImgError] = useState(false);
  const bannerContainerRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number; isHovering: boolean }>({
    x: 50,
    y: 50,
    isHovering: false,
  });
  
  const [activeBanner, setActiveBanner] = useState<string>(() => {
    return bannerUrl || OFFICIAL_BANNER_URL;
  });

  useEffect(() => {
    if (bannerUrl) {
      setActiveBanner(bannerUrl);
    }
  }, [bannerUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bannerContainerRef.current) return;
    const rect = bannerContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y, isHovering: true });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovering: false }));
  };

  const fireEmbers = useMemo(() => [
    { id: 1, left: '8%', delay: 0, duration: 4.2, size: 4 },
    { id: 2, left: '16%', delay: 1.2, duration: 5.1, size: 3 },
    { id: 3, left: '25%', delay: 2.5, duration: 3.8, size: 5 },
    { id: 4, left: '33%', delay: 0.8, duration: 4.6, size: 3.5 },
  ], []);

  const iceSparkles = useMemo(() => [
    { id: 5, right: '8%', delay: 0.5, duration: 4.5, size: 4 },
    { id: 6, right: '18%', delay: 1.8, duration: 5.2, size: 3.5 },
    { id: 7, right: '28%', delay: 2.9, duration: 3.9, size: 4.5 },
    { id: 8, right: '36%', delay: 1.1, duration: 4.8, size: 3 },
  ], []);

  return (
    <section 
      id="hero-banner-section" 
      className="relative w-full bg-[#06080d] overflow-hidden border-b border-zinc-800/60"
    >
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[550px] h-[380px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 right-1/4 translate-x-1/2 w-[550px] h-[380px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-[1920px] mx-auto px-0 sm:px-2 md:px-4 pt-2 sm:pt-4 pb-4 sm:pb-6 relative z-10">
        <div className="relative w-full overflow-hidden">
          <div className="absolute -inset-1 sm:-inset-2 rounded-2xl bg-gradient-to-r from-amber-500/25 via-amber-400/10 to-sky-500/25 blur-xl pointer-events-none -z-10" aria-hidden="true" />

          <div
            ref={bannerContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative w-full overflow-hidden bg-[#06080d] sm:rounded-xl md:rounded-2xl border-y sm:border border-amber-500/25 hover:border-amber-400/40 transition-colors duration-500 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] select-none"
          >
            <div className="relative w-full aspect-[1279/476] min-h-[200px] sm:min-h-[280px] md:min-h-[380px] lg:min-h-[460px] xl:min-h-[540px] max-h-[85vh] overflow-hidden flex items-center justify-center">
              {!imgError ? (
                <img
                  id="official-jhota-banner-img"
                  src={activeBanner}
                  alt="Jhota Gamer - Banner Oficial"
                  className="w-full h-full object-contain md:object-cover object-center block transform transition-transform duration-700 group-hover:scale-[1.008]"
                  onError={() => {
                    const img = document.getElementById('official-jhota-banner-img') as HTMLImageElement | null;
                    if (img && !img.src.includes('banner-limpo.png')) {
                      img.src = '/banner-limpo.png';
                    } else if (img && !img.src.includes('banner.png')) {
                      img.src = '/banner.png';
                    } else {
                      setImgError(true);
                    }
                  }}
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-zinc-950 text-center">
                  <Sparkles className="w-12 h-12 text-amber-400 mb-3 animate-pulse" />
                  <h2 className="font-cinzel text-2xl font-bold text-amber-200">{brandName}</h2>
                  <p className="text-zinc-400 text-xs mt-1">Banner Oficial Jhota Gamer</p>
                </div>
              )}

              <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-75">
                <motion.div
                  className="w-[50%] h-[200%] absolute top-[-50%] bg-gradient-to-r from-transparent via-amber-100/15 to-transparent skew-x-[-25deg]"
                  animate={{ x: ['-150%', '350%'] }}
                  transition={{ repeat: Infinity, duration: 6, ease: [0.4, 0, 0.2, 1], repeatDelay: 2.5 }}
                />
              </div>

              <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none overflow-hidden mix-blend-screen" aria-hidden="true">
                <motion.div
                  className="w-full h-full bg-gradient-to-r from-orange-600/15 via-amber-500/10 to-transparent"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                />
                {fireEmbers.map((ember) => (
                  <motion.span
                    key={ember.id}
                    className="absolute rounded-full bg-gradient-to-t from-orange-500 to-amber-300 blur-[0.5px] shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                    style={{ left: ember.left, width: `${ember.size}px`, height: `${ember.size}px`, bottom: '-10px' }}
                    animate={{
                      y: ['0px', '-260px'],
                      x: ['0px', '15px', '-10px', '5px'],
                      opacity: [0, 0.8, 0.8, 0],
                      scale: [0.8, 1.2, 0.9, 0.4],
                    }}
                    transition={{ repeat: Infinity, duration: ember.duration, delay: ember.delay, ease: 'easeInOut' }}
                  />
                ))}
              </div>

              <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none overflow-hidden mix-blend-screen" aria-hidden="true">
                <motion.div
                  className="w-full h-full bg-gradient-to-l from-sky-500/15 via-cyan-400/10 to-transparent"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 4.5, delay: 1.5, ease: 'easeInOut' }}
                />
                {iceSparkles.map((sparkle) => (
                  <motion.span
                    key={sparkle.id}
                    className="absolute rounded-full bg-gradient-to-t from-sky-400 to-cyan-100 blur-[0.5px] shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                    style={{ right: sparkle.right, width: `${sparkle.size}px`, height: `${sparkle.size}px`, bottom: '-10px' }}
                    animate={{
                      y: ['0px', '-240px'],
                      x: ['0px', '-12px', '8px', '-4px'],
                      opacity: [0, 0.8, 0.8, 0],
                      scale: [0.8, 1.2, 0.9, 0.4],
                    }}
                    transition={{ repeat: Infinity, duration: sparkle.duration, delay: sparkle.delay, ease: 'easeInOut' }}
                  />
                ))}
              </div>

              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 mix-blend-screen"
                style={{
                  opacity: mousePos.isHovering ? 1 : 0,
                  background: `radial-gradient(circle 380px at ${mousePos.x}% ${mousePos.y}%, ${
                    mousePos.x < 35 
                      ? 'rgba(249, 115, 22, 0.18)' 
                      : mousePos.x > 65 
                      ? 'rgba(56, 189, 248, 0.18)' 
                      : 'rgba(251, 191, 36, 0.16)'
                  }, transparent 80%)`,
                }}
                aria-hidden="true"
              />

              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.45)] sm:rounded-xl md:rounded-2xl" aria-hidden="true" />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
          className="mt-6 sm:mt-8 text-center max-w-4xl mx-auto px-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3 tracking-wide uppercase shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Albion Online &bull; Lineage 2 &bull; MMORPGs & Sandbox</span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-black tracking-wide text-white mb-2 drop-shadow-md">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              {brandName}
            </span>
          </h1>

          <p className="text-base sm:text-xl lg:text-2xl font-rajdhani font-bold text-zinc-200 mb-2 tracking-wide">
            &ldquo;{tagline}&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto mb-6 font-sans leading-relaxed">
            {subTagline} — Análises de meta em tempo real, rotas econômicas comprovadas, builds otimizadas e conteúdos exclusivos para dominar qualquer servidor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {onExploreGames && (
              <motion.button
                id="hero-btn-explore-games"
                onClick={onExploreGames}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-cinzel font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-black" />
                <span>Explorar Jogos & Guias</span>
              </motion.button>
            )}

            {onLearnMoreBio && (
              <motion.button
                id="hero-btn-about-jhota"
                onClick={onLearnMoreBio}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 hover:border-amber-500/50 font-rajdhani font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Sobre Jhota</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
