import { ArsenalBuild, ArsenalKind } from '../types/albionArsenal';

export interface ActivityOption {
  id: ArsenalKind;
  label: string;
  apiKind: ArsenalKind;
}

export interface ActivityGroup {
  label: string;
  options: ActivityOption[];
}

// The source only classifies fight size. Locations, dungeons and PvE cannot
// be identified from its build endpoint and must not appear as filters.
export const ALBION_ACTIVITY_GROUPS: ActivityGroup[] = [
  {
    label: 'TIPO DE COMBATE',
    options: [
      { id: 'all', label: 'Todos os combates', apiKind: 'all' },
      { id: '1v1', label: 'Solo (1v1)', apiKind: '1v1' },
      { id: 'gank', label: 'Pequenos grupos (2–9)', apiKind: 'gank' },
      { id: 'zvz', label: 'ZvZ (10+ jogadores)', apiKind: 'zvz' }
    ]
  }
];

const activityOptions = ALBION_ACTIVITY_GROUPS.flatMap(group => group.options);
const optionsById = new Map(activityOptions.map(option => [option.id, option]));

export function isValidActivityId(id: string): boolean {
  return optionsById.has(id as ArsenalKind);
}

export function getActivityOption(id: string): ActivityOption {
  return optionsById.get(id as ArsenalKind) || activityOptions[0];
}

export function getArsenalKindForActivity(activityId: string): ArsenalKind {
  return getActivityOption(activityId).apiKind;
}

export function isBuildMatchingActivity(
  build: ArsenalBuild,
  activityId: string,
  apiFilterKind?: ArsenalKind
): boolean {
  const kind = getArsenalKindForActivity(activityId);
  if (kind === 'all') return true;
  return (build.provenanceKind || apiFilterKind) === kind;
}
