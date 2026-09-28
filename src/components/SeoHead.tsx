import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initialGames, initialGuides } from '../data/initialData';

const SITE_URL = 'https://jhotagamer.com.br';
const IMAGE_URL = `${SITE_URL}/banner-limpo.png`;
const HOME = {
  title: 'Jhota Gamer | Guias de Albion Online e Lineage 2',
  description: 'Guias de Albion Online e Lineage 2 Exilium, builds, calculadoras de refino e transporte e vídeos da comunidade Jhota Gamer.'
};

const pages: Record<string, { title: string; description: string }> = {
  '/': HOME,
  '/jogos': {
    title: 'Jogos: Albion Online e Lineage 2 | Jhota Gamer',
    description: 'Explore guias, vídeos, builds e ferramentas do Jhota Gamer para Albion Online e Lineage 2.'
  },
  '/redes-sociais': {
    title: 'Redes sociais e comunidade | Jhota Gamer',
    description: 'Encontre o Jhota Gamer no YouTube, Twitch, Instagram, Facebook e Discord.'
  },
  '/links-uteis': {
    title: 'Sites oficiais e wikis de Albion e Exilium | Jhota Gamer',
    description: 'Acesse os sites oficiais e as wikis de Albion Online e Exilium World em uma só página.'
  },
  '/contato': {
    title: 'Contato e parcerias | Jhota Gamer',
    description: 'Envie uma proposta de parceria ou patrocínio diretamente ao Jhota Gamer pelo formulário de contato.'
  },
  '/apoie': {
    title: 'Apoie o Jhota Gamer | Apoio voluntário',
    description: 'Conheça as formas de apoiar a produção de guias, vídeos e ferramentas gratuitas do Jhota Gamer.'
  },
  '/privacidade': {
    title: 'Política de privacidade | Jhota Gamer',
    description: 'Saiba como o Jhota Gamer usa dados locais, conteúdos incorporados e serviços externos.'
  }
};

function getPage(path: string) {
  if (pages[path]) return pages[path];

  const guideMatch = path.match(/^\/jogo\/([^/]+)\/guia\/([^/]+)$/);
  if (guideMatch) {
    const guide = initialGuides.find(g => g.gameId === guideMatch[1] && g.id === guideMatch[2]);
    if (guide) return { title: `${guide.title} | Jhota Gamer`, description: guide.summary };
  }

  const gameMatch = path.match(/^\/jogo\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?$/);
  if (gameMatch) {
    const game = initialGames.find(g => g.id === gameMatch[1]);
    if (game) {
      const [, , section, tool] = gameMatch;
      if (game.id === 'albion-online' && section === 'calculadoras') {
        const subject = tool === 'refino' ? 'refino' : tool === 'transporte' ? 'transporte' : 'refino e transporte';
        return {
          title: `Calculadora de ${subject} no Albion Online | Jhota Gamer`,
          description: `Use as ferramentas de ${subject} do Jhota Gamer para comparar custos e planejar suas atividades no Albion Online.`
        };
      }
      if (game.id === 'albion-online' && section === 'mercado') {
        return {
          title: 'Preços do mercado de Albion Online | Jhota Gamer',
          description: 'Consulte preços de compra e venda de itens do Albion Online por cidade e qualidade. Verifique a atualização dos dados antes de negociar.'
        };
      }
      if (game.id === 'lineage-2' && section === 'classes') {
        return {
          title: 'Árvore de classes de Lineage 2 por raça | Jhota Gamer',
          description: 'Veja os caminhos de evolução das classes de Lineage 2, com filtros por raça e busca por profissão ou função.'
        };
      }
      return { title: `${game.name}: guias, vídeos e builds | Jhota Gamer`, description: game.description };
    }
  }

  return HOME;
}

function setMeta(attribute: 'name' | 'property', key: string, value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = value;
}

export function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
    const { title, description } = getPage(path);
    const canonical = `${SITE_URL}${path}`;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', path.includes('/guia/') ? 'article' : 'website');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', IMAGE_URL);

    let canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = canonical;
  }, [pathname]);

  return null;
}
