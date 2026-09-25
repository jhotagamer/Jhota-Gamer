export type PageType = 
  | 'home' 
  | 'jogos' 
  | 'jogo-detalhes' 
  | 'redes-sociais' 
  | 'links-uteis' 
  | 'contato'
  | 'guia-detalhes';

export type GameId = 'albion-online' | 'lineage-2' | string;

export interface Guide {
  id: string;
  gameId: string;
  gameName: string;
  title: string;
  summary: string;
  category: 'Iniciante' | 'Avançado' | 'Estratégia' | 'PvP' | 'PvE' | 'Economia';
  readTime: string;
  publishedDate: string;
  author: string;
  recommendedLevel: string;
  tags: string[];
  content: {
    intro: string;
    sections: {
      heading: string;
      text: string;
      bulletPoints?: string[];
      tipBox?: string;
    }[];
    conclusion: string;
  };
}

export interface Build {
  id: string;
  gameId: string;
  gameName: string;
  title: string;
  role: string;
  tier: 'S-Tier' | 'A-Tier' | 'Meta';
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
  description: string;
  gear: {
    slot: string;
    item: string;
    englishName?: string;
    iconUrl?: string;
    details?: string;
  }[];
  skills?: {
    slot: string;
    skill: string;
    englishName?: string;
    iconUrl?: string;
    details?: string;
  }[];
  consumables?: {
    type: string;
    item: string;
    englishName?: string;
    iconUrl?: string;
    note?: string;
  }[];
  pros: string[];
  cons: string[];
  playstyleTip: string;
}

export interface NewsItem {
  id: string;
  gameId?: string;
  gameName?: string;
  title: string;
  snippet: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  badgeColor?: string;
  officialUrl?: string;
  officialLabel?: string;
}

export interface VideoItem {
  id: string;
  gameId: string;
  gameName: string;
  title: string;
  duration: string;
  views: string;
  date: string;
  youtubeId: string;
  thumbnail: string;
  category: 'Dicas' | 'Gameplay' | 'Guia' | 'PvP' | 'Highlights';
  description?: string;
  url?: string;
}

export interface Game {
  id: string;
  slug: string;
  name: string;
  genre: string;
  tagline: string;
  description: string;
  badge: string;
  themeColor: 'amber' | 'blue' | 'rose' | 'orange';
  coverImage: string;
  bannerImage: string;
  status: 'Ativo no Canal' | 'Em Destaque' | 'Série Regular';
  stats: {
    label: string;
    value: string;
  }[];
  features: string[];
  guidesCount: number;
  buildsCount: number;
  videosCount: number;
}

export interface SocialMedia {
  id: string;
  name: string;
  username: string;
  url: string;
  platform: 'youtube' | 'instagram' | 'tiktok' | 'discord' | 'facebook' | 'twitch' | 'twitter';
  icon: string;
  themeColor: string;
  description: string;
  followers: string;
  ctaText: string;
  featured?: boolean;
}

export interface UsefulLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'sites_oficiais' | 'wikis_databases' | 'ferramentas' | 'comunidades' | 'downloads' | 'servidores';
  gameRelated?: string;
  isOfficial?: boolean;
  tags: string[];
}

export interface BioData {
  name: string;
  brandName: string;
  tagline: string;
  subTagline: string;
  avatarUrl: string;
  bannerUrl?: string;
  bioParagraphs: string[];
  trajectoryIntro?: string;
  trajectory: {
    year: string;
    title: string;
    description: string;
  }[];
  channelObjectives: string[];
  favoriteGames: string[];
  stats: {
    subscribers: string;
    videos: string;
    yearsGaming: string;
    guildMembers: string;
  };
}
