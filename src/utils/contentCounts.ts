import { Game, Guide, Build, VideoItem } from '../types';

// Deriva os totais das listas carregadas, inclusive após a sincronização de vídeos.
export function getGamesWithContentCounts(
  games: Game[], guides: Guide[], builds: Build[], videos: VideoItem[]
): Game[] {
  return games.map(game => {
    const guidesCount = guides.filter(item => item.gameId === game.id).length;
    return {
      ...game,
      guidesCount,
      buildsCount: game.id === 'lineage-2' ? 0 : builds.filter(item => item.gameId === game.id).length,
      videosCount: videos.filter(item => item.gameId === game.id).length,
      stats: game.stats.map(stat => stat.label === 'Guias no Site'
        ? { ...stat, value: `${guidesCount} ${guidesCount === 1 ? 'guia' : 'guias'}` }
        : stat),
    };
  });
}
