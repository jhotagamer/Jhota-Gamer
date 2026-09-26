/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Game, Guide, Build, NewsItem, VideoItem, SocialMedia, UsefulLink, BioData } from './types';
import { 
  initialBio, 
  initialGames, 
  initialGuides, 
  initialBuilds, 
  initialNews, 
  initialVideos, 
  initialSocials, 
  initialUsefulLinks 
} from './data/initialData';
import { syncSocialMetrics } from './utils/socialSync';
import { syncYoutubeVideos } from './utils/youtubeSync';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { WhatYouFindSection } from './components/WhatYouFindSection';
import { FeaturedGamesSection } from './components/FeaturedGamesSection';
import { BioSection } from './components/BioSection';
import { RecentVideosSection } from './components/RecentVideosSection';
import { RecentNewsSection } from './components/RecentNewsSection';
import { GamesPage } from './components/GamesPage';
import { GameDetailPage } from './components/GameDetailPage';
import { GuidePage } from './components/GuidePage';
import { VideoPage } from './components/VideoPage';
import { SocialMediaPage } from './components/SocialMediaPage';
import { UsefulLinksPage } from './components/UsefulLinksPage';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { GuideReaderModal } from './components/GuideReaderModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { NewsReaderModal } from './components/NewsReaderModal';

export default function App() {
  // --- ESTADOS DE DADOS (Mantidos conforme original com limpeza e persistência) ---
  const [bio, setBio] = useState<BioData>(() => {
    const saved = localStorage.getItem('jhota_bio');
    if (saved) {
      try {
        const parsed: BioData = JSON.parse(saved);
        if (parsed.bioParagraphs) {
          parsed.bioParagraphs = parsed.bioParagraphs.map(p =>
            p.replace(/,\s*e o ritmo tático de Summoner's Rift no League of Legends/gi, '')
             .replace(/e o ritmo tático de Summoner's Rift no League of Legends/gi, '')
             .replace(/no League of Legends/gi, '')
             .replace(/League of Legends/gi, '')
          );
        }
        return parsed;
      } catch { return initialBio; }
    }
    return initialBio;
  });

  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('jhota_games');
    if (saved) {
      try {
        const parsed: Game[] = JSON.parse(saved);
        return parsed.filter((g) => g.id !== 'league-of-legends');
      } catch { return initialGames; }
    }
    return initialGames;
  });

  const [socials, setSocials] = useState<SocialMedia[]>(() => {
    const saved = localStorage.getItem('jhota_socials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((s: SocialMedia) => s.platform !== 'tiktok').map((s: SocialMedia) => {
            if (s.platform === 'twitch') {
              return { ...s, url: 'https://www.twitch.tv/jhotagameroficial', username: 'twitch.tv/jhotagameroficial' };
            }
            if (s.platform === 'youtube' && (!s.url || s.url === 'https://youtube.com' || s.url.includes('@seucanal'))) {
              return { ...s, url: 'https://www.youtube.com/@JhotaGamerOficial', username: '@JhotaGamerOficial' };
            }
            return s;
          });
        }
      } catch {
        return initialSocials.filter((s) => s.platform !== 'tiktok');
      }
    }
    return initialSocials.filter((s) => s.platform !== 'tiktok');
  });

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

  const sanitizeUsefulLink = (link: UsefulLink): UsefulLink | null => {
    if (isLeagueOfLegendsLink(link)) return null;

    const url = (link.url || '').toLowerCase();
    const title = (link.title || '').toLowerCase();

    // Remove any official retail Lineage 2 links (NCSoft, 4game, lineage2.com)
    if (url.includes('lineage2.com') || url.includes('plaync.com') || url.includes('4game.com')) {
      return null;
    }
    if ((title.includes('lineage 2') || title.includes('lineage ii')) && title.includes('oficial') && !title.includes('exilium') && !url.includes('exiliumworld')) {
      return null;
    }

    // Ensure the official Exilium World link is correctly formatted
    if (link.id === 'link-exilium-official' || (url.includes('exiliumworld.com') && (link.category === 'sites_oficiais' || link.isOfficial))) {
      return {
        ...link,
        title: "Servidor Exilium World — Site Oficial & Download",
        url: "https://www.exiliumworld.com/",
        gameRelated: "Lineage 2 Exilium World",
        isOfficial: true
      };
    }

    return link;
  };

  const sanitizeAndEnsureLinks = (rawLinks: UsefulLink[]): UsefulLink[] => {
    const cleaned = rawLinks
      .map(sanitizeUsefulLink)
      .filter((l): l is UsefulLink => l !== null);

    const hasExiliumOfficial = cleaned.some(
      (l) => l.url === 'https://www.exiliumworld.com/' || (l.url.includes('exiliumworld.com') && l.isOfficial)
    );

    if (!hasExiliumOfficial) {
      const defaultExilium = initialUsefulLinks.find((l) => l.id === 'link-exilium-official');
      if (defaultExilium) {
        cleaned.unshift(defaultExilium);
      }
    }

    return cleaned;
  };

  const [usefulLinks, setUsefulLinks] = useState<UsefulLink[]>(() => {
    const saved = localStorage.getItem('jhota_useful_links');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return sanitizeAndEnsureLinks(parsed);
        }
      } catch {
        return sanitizeAndEnsureLinks(initialUsefulLinks);
      }
    }
    return sanitizeAndEnsureLinks(initialUsefulLinks);
  });

  const [guides] = useState<Guide[]>(initialGuides);
  const [builds] = useState<Build[]>(initialBuilds);
  const [news] = useState<NewsItem[]>(initialNews);
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('jhota_videos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return initialVideos;
      }
    }
    return initialVideos;
  });

  // --- AUTO-SINCRONIZAÇÃO GERAL (YOUTUBE & REDES SOCIAIS) ---
  useEffect(() => {
    // 1. Sincronizar dados ao vivo de redes sociais (Discord membros online, YouTube, Instagram, Facebook)
    syncSocialMetrics(socials, bio).then((res) => {
      if (res.socials && res.socials.length > 0) {
        setSocials(res.socials);
      }
      if (res.discordPresence !== undefined) {
        setBio((prev) => {
          const updated = {
            ...prev,
            stats: {
              ...prev.stats,
              guildMembers: `${res.discordPresence} Online`
            }
          };
          try {
            localStorage.setItem('jhota_bio', JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }
    }).catch(() => {
      // fallback
    });

    // 2. Sincronizar conteúdos recentes e vídeos do canal @JhotaGamerOficial
    syncYoutubeVideos(videos).then((res) => {
      if (res.videos && res.videos.length > 0) {
        setVideos(res.videos);
      }
    }).catch(() => {
      // fallback
    });
  }, []);

  // --- ESTADOS DE MODAIS ---
  const [readingGuide, setReadingGuide] = useState<Guide | null>(null);
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [readingNews, setReadingNews] = useState<NewsItem | null>(null);

  // --- FUNÇÕES DE ATUALIZAÇÃO ---
  const handleUpdateBio = (updatedBio: BioData) => {
    setBio(updatedBio);
    localStorage.setItem('jhota_bio', JSON.stringify(updatedBio));
  };

  const handleUpdateSocials = (updatedSocials: SocialMedia[]) => {
    setSocials(updatedSocials);
    localStorage.setItem('jhota_socials', JSON.stringify(updatedSocials));
  };

  const handleUpdateVideos = (updatedVideos: VideoItem[]) => {
    setVideos(updatedVideos);
    try {
      localStorage.setItem('jhota_videos', JSON.stringify(updatedVideos));
    } catch {
      // ignore
    }
  };

  const handleUpdateUsefulLinks = (updatedLinks: UsefulLink[]) => {
    const cleanLinks = sanitizeAndEnsureLinks(updatedLinks);
    setUsefulLinks(cleanLinks);
    localStorage.setItem('jhota_useful_links', JSON.stringify(cleanLinks));
  };

  const handleResetDefaults = () => {
    setBio(initialBio);
    setGames(initialGames);
    setSocials(initialSocials);
    setUsefulLinks(sanitizeAndEnsureLinks(initialUsefulLinks));
    setVideos(initialVideos);
    localStorage.removeItem('jhota_bio');
    localStorage.removeItem('jhota_games');
    localStorage.removeItem('jhota_socials');
    localStorage.removeItem('jhota_useful_links');
    localStorage.removeItem('jhota_videos');
    localStorage.removeItem('jhota_youtube_last_sync');
    localStorage.removeItem('jhota_social_last_sync');
    setIsCustomizerOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#090b10] text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
        
        {/* Navbar agora usa as rotas do Router */}
        <Navbar
          brandName={bio.brandName}
        />

        <main className="flex-1">
          <Routes>
            {/* PÁGINA INICIAL (HOME) */}
<Route path="/" element={
  <>
    <HeroBanner
      brandName={bio.brandName}
      tagline={bio.tagline}
      subTagline={bio.subTagline}
      bannerUrl={bio.bannerUrl}
      onUpdateBannerUrl={(newUrl) => handleUpdateBio({ ...bio, bannerUrl: newUrl })}
      onLearnMoreBio={() => {
        const el = document.getElementById('secao-biografia');
        el?.scrollIntoView({ behavior: 'smooth' });
      }}
    />
    <WhatYouFindSection />
    
    {/* ADICIONE ESTA LINHA ABAIXO PARA A BIO VOLTAR */}
    <BioSection bio={bio} /> 

    <FeaturedGamesSection
      games={games}
    />
    <RecentVideosSection
      videos={videos}
      onPlayVideo={(v) => setPlayingVideo(v)}
      onUpdateVideos={handleUpdateVideos}
    />
    <RecentNewsSection
      news={news}
      onSelectNews={(item) => setReadingNews(item)}
    />
  </>
} />


            {/* PÁGINA DE LISTA DE JOGOS */}
            <Route path="/jogos" element={
              <GamesPage 
                games={games} 
              />
            } />

            {/* PÁGINA DE DETALHES DO JOGO (URL DINÂMICA: /jogo/albion-online) */}
            <Route path="/jogo/:gameId" element={
              <GameDetailPageWrapper 
                games={games} 
                guides={guides} 
                builds={builds} 
                news={news} 
                videos={videos} 
                setReadingGuide={setReadingGuide}
                setPlayingVideo={setPlayingVideo}
                setReadingNews={setReadingNews}
              />
            } />
            <Route path="/jogo/:gameId/guia/:guideId" element={<GuidePage />} />
            <Route path="/jogo/:gameId/video/:videoId" element={<VideoPage />} />
            {/* Redirecionamento de rotas legadas do marketplace */}
            <Route path="/marketplace-l2" element={<Navigate to="/jogo/lineage-2" replace />} />
            <Route path="/l2-rules" element={<Navigate to="/jogo/lineage-2" replace />} />
            <Route path="/regras-l2" element={<Navigate to="/jogo/lineage-2" replace />} />
            <Route path="/request-shop" element={<Navigate to="/jogo/lineage-2" replace />} />
            <Route path="/denuncia" element={<Navigate to="/jogo/lineage-2" replace />} />
            <Route path="/report" element={<Navigate to="/jogo/lineage-2" replace />} />
            <Route path="/painel-vendedor" element={<Navigate to="/jogo/lineage-2" replace />} />
            <Route path="/vendor-dashboard" element={<Navigate to="/jogo/lineage-2" replace />} />
            <Route path="/loja/:shopId" element={<Navigate to="/jogo/lineage-2" replace />} />
            <Route path="/shop/:shopId" element={<Navigate to="/jogo/lineage-2" replace />} />

            {/* OUTRAS PÁGINAS */}
            <Route path="/redes-sociais" element={
              <SocialMediaPage 
                socials={socials} 
                bio={bio} 
                onUpdateSocials={setSocials} 
                onUpdateBio={setBio} 
              />
            } />
            
            <Route path="/links-uteis" element={
              <UsefulLinksPage 
                links={usefulLinks} 
              />
            } />

            <Route path="/contato" element={
              <ContactSection brandName={bio.brandName} />
            } />

            {/* REDIRECIONAMENTO PARA HOME CASO A URL NÃO EXISTA */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* ADICIONE ESTA LINHA ABAIXO PARA O RODAPÉ VOLTAR */}
        <Footer brandName={bio.brandName} />

        {/* Modais Globais */}
        <GuideReaderModal guide={readingGuide} onClose={() => setReadingGuide(null)} />
        <VideoPlayerModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
        <NewsReaderModal news={readingNews} onClose={() => setReadingNews(null)} />
      </div>
    </Router>

  );
}

// --- COMPONENTE AUXILIAR PARA PEGAR O ID DO JOGO DA URL ---
function GameDetailPageWrapper(props: any) {
  const { gameId, guideId, videoId } = useParams();
  const navigate = useNavigate();
  const currentGame = props.games.find((g: any) => g.id === gameId);

  React.useEffect(() => {
    if (guideId && props.guides) {
      const guide = props.guides.find((g: any) => g.id === guideId);
      if (guide) props.setReadingGuide(guide);
    }
  }, [guideId, props.guides]);

  React.useEffect(() => {
    if (videoId && props.videos) {
      const video = props.videos.find((v: any) => v.id === videoId);
      if (video) props.setPlayingVideo(video);
    }
  }, [videoId, props.videos]);

  if (!currentGame) return <Navigate to="/jogos" />;

  return (
    <GameDetailPage 
      game={currentGame}
      guides={props.guides}
      builds={props.builds}
      news={props.news}
      videos={props.videos}
      onBackToGames={() => navigate('/jogos')}
      onSelectGuide={(g: any) => props.setReadingGuide(g)}
      onPlayVideo={(v: any) => props.setPlayingVideo(v)}
      onSelectNews={(item: any) => props.setReadingNews(item)}
    />
  );
}
