import { ArsenalBuild, ArsenalKind } from '../types/albionArsenal';

export interface ActivityOption {
  id: string;
  label: string;
  apiKind?: ArsenalKind;
}

export interface ActivityGroup {
  label: string;
  options: ActivityOption[];
}

/**
 * Organização visual completa do filtro Atividade por grupos sem duplicatas visuais.
 * Cada opção possui um ID único, estável e descritivo.
 */
export const ALBION_ACTIVITY_GROUPS: ActivityGroup[] = [
  {
    label: 'GERAL',
    options: [
      { id: 'all', label: 'Todas as Atividades', apiKind: 'all' }
    ]
  },
  {
    label: 'SOLO / PEQUENA ESCALA',
    options: [
      { id: 'solo_1v1', label: 'Solo / Duelos (1v1)', apiKind: '1v1' },
      { id: 'open_world_solo', label: 'Open World Solo', apiKind: '1v1' },
      { id: 'pve_solo', label: 'PvE Solo', apiKind: 'all' },
      { id: 'pvp_solo', label: 'PvP Solo', apiKind: '1v1' },
      { id: 'corrupted_dungeons', label: 'Corrupted Dungeons', apiKind: '1v1' },
      { id: 'corrupted_dungeons_solo', label: 'Corrupted Dungeons Solo', apiKind: '1v1' }
    ]
  },
  {
    label: 'GANK / OPEN WORLD',
    options: [
      { id: 'gank', label: 'Gank', apiKind: 'gank' },
      { id: 'gank_solo', label: 'Gank Solo', apiKind: 'gank' },
      { id: 'gank_small_group', label: 'Gank Pequeno Grupo', apiKind: 'gank' },
      { id: 'open_world', label: 'Open World', apiKind: 'all' },
      { id: 'open_world_pvp', label: 'Open World PvP', apiKind: 'all' },
      { id: 'open_world_pve', label: 'Open World PvE', apiKind: 'all' },
      { id: 'player_hunt', label: 'Caça a Jogadores', apiKind: 'gank' },
      { id: 'ambush', label: 'Emboscada', apiKind: 'gank' },
      { id: 'transport_escort', label: 'Transporte / Escolta', apiKind: 'all' }
    ]
  },
  {
    label: 'BRUMAS / MISTS',
    options: [
      { id: 'mists', label: 'Brumas / Mists', apiKind: 'all' },
      { id: 'mists_solo', label: 'Brumas Solo', apiKind: '1v1' },
      { id: 'mists_duo', label: 'Brumas Duo', apiKind: 'gank' },
      { id: 'mists_pvp', label: 'Brumas PvP', apiKind: 'all' },
      { id: 'mists_pve', label: 'Brumas PvE', apiKind: 'all' },
      { id: 'mists_royal', label: 'Brumas Real', apiKind: 'all' },
      { id: 'mists_enchanted', label: 'Brumas Encantadas', apiKind: 'all' }
    ]
  },
  {
    label: 'PEQUENOS GRUPOS',
    options: [
      { id: 'small_groups', label: 'Pequenos Grupos (2-9)', apiKind: 'gank' },
      { id: 'duo', label: 'Duo (2 jogadores)', apiKind: 'gank' },
      { id: 'trio', label: 'Trio (3 jogadores)', apiKind: 'gank' },
      { id: '2v2', label: '2v2', apiKind: 'gank' },
      { id: '3v3', label: '3v3', apiKind: 'gank' },
      { id: '5v5', label: '5v5', apiKind: 'gank' },
      { id: '5v5_pvp', label: '5v5 PvP', apiKind: 'gank' },
      { id: 'hellgates', label: 'Hellgates', apiKind: 'all' },
      { id: 'hellgates_2v2', label: 'Hellgates 2v2', apiKind: 'gank' },
      { id: 'hellgates_5v5', label: 'Hellgates 5v5', apiKind: 'gank' },
      { id: 'small_scale', label: 'Pequena Escala', apiKind: 'gank' }
    ]
  },
  {
    label: 'GRANDES GRUPOS',
    options: [
      { id: 'large_battles', label: 'Grandes Batalhas', apiKind: 'zvz' },
      { id: 'zvz', label: 'ZvZ (Zerg vs Zerg)', apiKind: 'zvz' },
      { id: 'zvz_open', label: 'ZvZ Aberto', apiKind: 'zvz' },
      { id: 'zvz_guild', label: 'ZvZ Guilda', apiKind: 'zvz' },
      { id: 'territory_war', label: 'Guerra de Território', apiKind: 'zvz' },
      { id: 'territory_attack', label: 'Ataque a Território', apiKind: 'zvz' },
      { id: 'territory_defense', label: 'Defesa de Território', apiKind: 'zvz' },
      { id: 'large_groups', label: 'Grandes Grupos', apiKind: 'zvz' }
    ]
  },
  {
    label: 'AVALONIAN',
    options: [
      { id: 'avalon', label: 'Avalon', apiKind: 'all' },
      { id: 'roads_avalon', label: 'Estradas de Avalon (Roads of Avalon)', apiKind: 'all' },
      { id: 'avalon_solo', label: 'Avalon Solo', apiKind: '1v1' },
      { id: 'avalon_small_group', label: 'Avalon Pequeno Grupo', apiKind: 'gank' },
      { id: 'avalon_pve', label: 'Avalon PvE', apiKind: 'all' },
      { id: 'avalon_pvp', label: 'Avalon PvP', apiKind: 'all' },
      { id: 'avalon_gank', label: 'Avalon Gank', apiKind: 'gank' },
      { id: 'avalon_group_content', label: 'Conteúdo de Grupo Avalon', apiKind: 'all' }
    ]
  },
  {
    label: 'PVE',
    options: [
      { id: 'pve', label: 'PvE Geral', apiKind: 'all' },
      { id: 'pve_group', label: 'PvE Grupo', apiKind: 'all' },
      { id: 'dungeons', label: 'Masmorras', apiKind: 'all' },
      { id: 'dungeons_solo', label: 'Masmorras Solo', apiKind: 'all' },
      { id: 'dungeons_group', label: 'Masmorras de Grupo', apiKind: 'all' },
      { id: 'dungeon_diving', label: 'Dungeon Diving', apiKind: 'all' },
      { id: 'elite_dungeons', label: 'Elite Dungeons', apiKind: 'all' },
      { id: 'avalonian_dungeons', label: 'Avalonian Dungeons', apiKind: 'all' },
      { id: 'static_dungeons', label: 'Static Dungeons', apiKind: 'all' },
      { id: 'faction_warfare_pve', label: 'Faction Warfare PvE', apiKind: 'all' }
    ]
  },
  {
    label: 'PVP',
    options: [
      { id: 'pvp', label: 'PvP Geral', apiKind: 'all' },
      { id: 'pvp_small_group', label: 'PvP Pequeno Grupo', apiKind: 'gank' },
      { id: 'pvp_group', label: 'PvP Grupo', apiKind: 'zvz' },
      { id: 'full_loot_pvp', label: 'Full Loot PvP', apiKind: 'all' },
      { id: 'arena', label: 'Arena', apiKind: 'all' },
      { id: 'crystal_league', label: 'Crystal League', apiKind: 'all' }
    ]
  },
  {
    label: 'FAÇÕES',
    options: [
      { id: 'faction_warfare', label: 'Faction Warfare', apiKind: 'all' },
      { id: 'faction_pvp', label: 'Faction PvP', apiKind: 'all' },
      { id: 'faction_open_world', label: 'Faction Open World', apiKind: 'all' },
      { id: 'faction_transport', label: 'Faction Transport', apiKind: 'all' },
      { id: 'faction_defense', label: 'Faction Defense', apiKind: 'all' },
      { id: 'faction_offense', label: 'Faction Offense', apiKind: 'all' }
    ]
  },
  {
    label: 'OUTRAS ATIVIDADES',
    options: [
      { id: 'guild', label: 'Guilda', apiKind: 'all' },
      { id: 'solo_general', label: 'Solo (Geral)', apiKind: '1v1' },
      { id: 'group_general', label: 'Grupo (Geral)', apiKind: 'all' }
    ]
  }
];

export const ALL_ACTIVITY_OPTIONS: ActivityOption[] = ALBION_ACTIVITY_GROUPS.flatMap(g => g.options);

export const ACTIVITY_OPTIONS_MAP = new Map<string, ActivityOption>(
  ALL_ACTIVITY_OPTIONS.map(opt => [opt.id, opt])
);

export function isValidActivityId(id: string): boolean {
  return ACTIVITY_OPTIONS_MAP.has(id);
}

export function getActivityOption(id: string): ActivityOption {
  return ACTIVITY_OPTIONS_MAP.get(id) || { id, label: 'Todas as Atividades', apiKind: 'all' };
}

/**
 * Retorna o parâmetro kind correspondente na API Albion Arsenal
 */
export function getArsenalKindForActivity(activityId: string): ArsenalKind {
  const opt = ACTIVITY_OPTIONS_MAP.get(activityId);
  return opt?.apiKind || 'all';
}

/**
 * Camada de classificação: activityClassifier
 * 
 * Analisa APENAS dados confiáveis disponíveis:
 * 1. Atividade explicitamente fornecida pela API (provenanceKind ou campo kind);
 * 2. Categoria fornecida pela fonte (URL da build);
 * 3. Metadado confiável da build (nome, notas, tags);
 * 4. Somente então regras de classificação transparentes.
 * 
 * Se não for possível determinar a atividade, retorna ['unspecified'].
 * NÃO inventa estatísticas nem força uma build a pertencer a uma atividade.
 */
export function classifyBuild(
  build: ArsenalBuild, 
  apiFilterKind?: ArsenalKind
): string[] {
  const activities = new Set<string>();

  const explicitKind = build.provenanceKind || apiFilterKind;

  // PRIORIDADE 1: Atividade explicitamente fornecida pela API
  if (explicitKind === '1v1') {
    activities.add('solo_1v1');
    activities.add('pvp_solo');
    activities.add('solo_general');
    activities.add('pvp');
  } else if (explicitKind === 'gank') {
    activities.add('gank');
    activities.add('small_groups');
    activities.add('small_scale');
    activities.add('pvp_small_group');
    activities.add('pvp');
  } else if (explicitKind === 'zvz') {
    activities.add('zvz');
    activities.add('large_battles');
    activities.add('large_groups');
    activities.add('pvp_group');
    activities.add('pvp');
  }

  // PRIORIDADE 2: Categoria fornecida pela fonte (URL de origem)
  const urlLower = (build.url || '').toLowerCase();
  if (urlLower.includes('/1v1')) {
    activities.add('solo_1v1');
    activities.add('pvp_solo');
    activities.add('solo_general');
  }
  if (urlLower.includes('/gank')) {
    activities.add('gank');
    activities.add('small_groups');
  }
  if (urlLower.includes('/zvz')) {
    activities.add('zvz');
    activities.add('large_battles');
    activities.add('large_groups');
  }

  // PRIORIDADE 3: Metadado confiável da build (nome e tags)
  const nameLower = (build.name || '').toLowerCase();

  // Brumas / Mists
  if (nameLower.includes('mist') || nameLower.includes('bruma')) {
    activities.add('mists');
    if (nameLower.includes('solo')) activities.add('mists_solo');
    if (nameLower.includes('duo')) activities.add('mists_duo');
    if (nameLower.includes('pvp')) activities.add('mists_pvp');
    if (nameLower.includes('pve')) activities.add('mists_pve');
    if (nameLower.includes('real') || nameLower.includes('royal')) activities.add('mists_royal');
    if (nameLower.includes('encantada') || nameLower.includes('enchanted')) activities.add('mists_enchanted');
  }

  // Corrupted Dungeons
  if (nameLower.includes('corrupted') || nameLower.includes('corrompida') || nameLower.includes(' cd ')) {
    activities.add('corrupted_dungeons');
    activities.add('corrupted_dungeons_solo');
    activities.add('solo_general');
  }

  // Hellgates
  if (nameLower.includes('hellgate') || nameLower.includes(' hg ') || nameLower.includes('hg 2v2') || nameLower.includes('hg 5v5')) {
    activities.add('hellgates');
    if (nameLower.includes('2v2')) activities.add('hellgates_2v2');
    if (nameLower.includes('5v5')) activities.add('hellgates_5v5');
  }

  // Avalon / Roads of Avalon
  if (nameLower.includes('avalon') || nameLower.includes('roads')) {
    activities.add('avalon');
    activities.add('roads_avalon');
    if (nameLower.includes('solo')) activities.add('avalon_solo');
    if (nameLower.includes('group') || nameLower.includes('grupo')) activities.add('avalon_group_content');
    if (nameLower.includes('gank')) activities.add('avalon_gank');
    if (nameLower.includes('pve')) activities.add('avalon_pve');
    if (nameLower.includes('pvp')) activities.add('avalon_pvp');
  }

  // Faction Warfare
  if (nameLower.includes('faction') || nameLower.includes('facção') || nameLower.includes(' fw ')) {
    activities.add('faction_warfare');
    activities.add('faction_pvp');
  }

  // Arena & Crystal League
  if (nameLower.includes('arena')) {
    activities.add('arena');
    activities.add('pvp');
  }
  if (nameLower.includes('crystal') || nameLower.includes('cristal')) {
    activities.add('crystal_league');
    activities.add('pvp');
  }

  // Open World
  if (nameLower.includes('open world') || nameLower.includes('mundo aberto')) {
    activities.add('open_world');
    if (nameLower.includes('solo')) activities.add('open_world_solo');
    if (nameLower.includes('pvp')) activities.add('open_world_pvp');
    if (nameLower.includes('pve')) activities.add('open_world_pve');
  }

  // PvE & Dungeons
  if (nameLower.includes('pve') || nameLower.includes('dungeon') || nameLower.includes('masmorra') || nameLower.includes('hce')) {
    activities.add('pve');
    activities.add('dungeons');
    if (nameLower.includes('solo')) {
      activities.add('pve_solo');
      activities.add('dungeons_solo');
    }
    if (nameLower.includes('static')) activities.add('static_dungeons');
    if (nameLower.includes('elite')) activities.add('elite_dungeons');
    if (nameLower.includes('avalonian')) activities.add('avalonian_dungeons');
  }

  // PRIORIDADE 4: Se o Arsenal for uma fonte estritamente de dados de PvP (kills e mortes):
  // Todas as builds obtidas com combate registrado são classificadas como PvP
  if (build.kills > 0 || build.deaths > 0) {
    activities.add('pvp');
  }

  // Se nada confiável pôde ser determinado
  if (activities.size === 0) {
    activities.add('unspecified');
  }

  return Array.from(activities);
}

/**
 * Verifica se a build corresponde à atividade selecionada.
 * Se atividade for 'all', aceita qualquer build.
 */
export function isBuildMatchingActivity(
  build: ArsenalBuild, 
  activityId: string,
  apiFilterKind?: ArsenalKind
): boolean {
  if (!activityId || activityId === 'all') {
    return true;
  }

  const tags = build.activityTags || classifyBuild(build, apiFilterKind);
  return tags.includes(activityId);
}
