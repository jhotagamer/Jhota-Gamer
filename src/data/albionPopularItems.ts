import { AlbionItem, AlbionServer } from '../types/albionMarket';

export const SERVER_HOSTS: Record<AlbionServer, string> = {
  americas: "https://west.albion-online-data.com",
  asia: "https://east.albion-online-data.com",
  europe: "https://europe.albion-online-data.com"
};

export const MARKET_LOCATIONS: Record<AlbionServer, string[]> = {
  americas: [
    "Caerleon",
    "Bridgewatch",
    "Fort Sterling",
    "Lymhurst",
    "Martlock",
    "Thetford",
    "Brecilien",
    "Black Market"
  ],
  asia: [
    "Caerleon",
    "Bridgewatch",
    "Fort Sterling",
    "Lymhurst",
    "Martlock",
    "Thetford",
    "Brecilien",
    "Black Market"
  ],
  europe: [
    "Caerleon",
    "Bridgewatch",
    "Fort Sterling",
    "Lymhurst",
    "Martlock",
    "Thetford",
    "Brecilien",
    "Black Market"
  ]
};

export const AMERICAS_LOCATIONS = MARKET_LOCATIONS.americas;

export function getCityDisplayName(city: string): string {
  if (city === 'Black Market') {
    return 'Mercado Negro';
  }
  return city;
}

export function isBlackMarket(city: string): boolean {
  return city.toLowerCase() === 'black market';
}

export const ALBION_CATEGORIES = [
  'Todas',
  'Armas',
  'Armaduras',
  'Capacetes',
  'Botas',
  'Capas',
  'Bolsas',
  'Acessórios',
  'Ferramentas',
  'Recursos',
  'Materiais',
  'Consumíveis',
  'Alimentos',
  'Poções',
  'Montarias',
  'Artefatos',
  'Outros'
] as const;

export const ALBION_TIERS = [
  'Todos',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
  'T8'
] as const;

export const ALBION_ENCHANTMENTS = [
  'Todos',
  'Normal',
  '.1',
  '.2',
  '.3',
  '.4'
] as const;

export const ALBION_QUALITIES = [
  { value: 0, label: 'Todas' },
  { value: 1, label: 'Normal' },
  { value: 2, label: 'Good' },
  { value: 3, label: 'Outstanding' },
  { value: 4, label: 'Excellent' },
  { value: 5, label: 'Masterpiece' }
] as const;

export const ALBION_CITIES = [
  'Todas',
  'Caerleon',
  'Bridgewatch',
  'Fort Sterling',
  'Lymhurst',
  'Martlock',
  'Thetford',
  'Brecilien',
  'Black Market'
] as const;

export const POPULAR_ALBION_ITEMS: AlbionItem[] = [
  // Bolsas
  { id: 'T4_BAG', name: 'Bolsa do Adepto (T4)', nameEn: "Adept's Bag", tier: 4, category: 'Bolsas' },
  { id: 'T5_BAG', name: 'Bolsa do Perito (T5)', nameEn: "Expert's Bag", tier: 5, category: 'Bolsas' },
  { id: 'T6_BAG', name: 'Bolsa do Mestre (T6)', nameEn: "Master's Bag", tier: 6, category: 'Bolsas' },
  { id: 'T7_BAG', name: 'Bolsa do Grão-Mestre (T7)', nameEn: "Grandmaster's Bag", tier: 7, category: 'Bolsas' },
  { id: 'T8_BAG', name: 'Bolsa do Ancião (T8)', nameEn: "Elder's Bag", tier: 8, category: 'Bolsas' },

  // Capas
  { id: 'T4_CAPE', name: 'Capa do Adepto (T4)', nameEn: "Adept's Cape", tier: 4, category: 'Capas' },
  { id: 'T6_CAPE', name: 'Capa do Mestre (T6)', nameEn: "Master's Cape", tier: 6, category: 'Capas' },
  { id: 'T8_CAPE', name: 'Capa do Ancião (T8)', nameEn: "Elder's Cape", tier: 8, category: 'Capas' },
  { id: 'T4_CAPEITEM_FW_BRIDGEWATCH', name: 'Capa de Bridgewatch (T4)', nameEn: "Bridgewatch Cape", tier: 4, category: 'Capas' },
  { id: 'T4_CAPEITEM_FW_CAERLEON', name: 'Capa de Caerleon (T4)', nameEn: "Caerleon Cape", tier: 4, category: 'Capas' },
  { id: 'T4_CAPEITEM_FW_FORTSTERLING', name: 'Capa de Fort Sterling (T4)', nameEn: "Fort Sterling Cape", tier: 4, category: 'Capas' },
  { id: 'T4_CAPEITEM_FW_THETFORD', name: 'Capa de Thetford (T4)', nameEn: "Thetford Cape", tier: 4, category: 'Capas' },
  { id: 'T4_CAPEITEM_FW_LYMHURST', name: 'Capa de Lymhurst (T4)', nameEn: "Lymhurst Cape", tier: 4, category: 'Capas' },
  { id: 'T4_CAPEITEM_FW_MARTLOCK', name: 'Capa de Martlock (T4)', nameEn: "Martlock Cape", tier: 4, category: 'Capas' },

  // Armas - Espadas
  { id: 'T4_MAIN_SWORD', name: 'Espada Larga (T4)', nameEn: "Broadsword", tier: 4, category: 'Armas' },
  { id: 'T5_MAIN_SWORD', name: 'Espada Larga (T5)', nameEn: "Broadsword", tier: 5, category: 'Armas' },
  { id: 'T6_MAIN_SWORD', name: 'Espada Larga (T6)', nameEn: "Broadsword", tier: 6, category: 'Armas' },
  { id: 'T8_MAIN_SWORD', name: 'Espada Larga (T8)', nameEn: "Broadsword", tier: 8, category: 'Armas' },
  { id: 'T4_2H_DUALSWORD', name: 'Espadas Duplas (T4)', nameEn: "Dual Swords", tier: 4, category: 'Armas' },
  { id: 'T6_2H_DUALSWORD', name: 'Espadas Duplas (T6)', nameEn: "Dual Swords", tier: 6, category: 'Armas' },
  { id: 'T4_2H_CLAYMORE', name: 'Claymore (T4)', nameEn: "Claymore", tier: 4, category: 'Armas' },

  // Armas - Machados & Adagas
  { id: 'T4_MAIN_AXE', name: 'Machado de Batalha (T4)', nameEn: "Battleaxe", tier: 4, category: 'Armas' },
  { id: 'T5_MAIN_AXE', name: 'Machado de Batalha (T5)', nameEn: "Battleaxe", tier: 5, category: 'Armas' },
  { id: 'T6_MAIN_AXE', name: 'Machado de Batalha (T6)', nameEn: "Battleaxe", tier: 6, category: 'Armas' },
  { id: 'T4_2H_HALBERD', name: 'Alabarda (T4)', nameEn: "Halberd", tier: 4, category: 'Armas' },
  { id: 'T4_MAIN_DAGGER', name: 'Adaga (T4)', nameEn: "Dagger", tier: 4, category: 'Armas' },
  { id: 'T4_2H_DAGGERPAIR', name: 'Adagas Duplas (T4)', nameEn: "Dagger Pair", tier: 4, category: 'Armas' },
  { id: 'T4_2H_CLAWPAIR', name: 'Garras (T4)', nameEn: "Claws", tier: 4, category: 'Armas' },
  { id: 'T4_2H_BOW', name: 'Arco do Adepto (T4)', nameEn: "Bow", tier: 4, category: 'Armas' },
  { id: 'T6_2H_BOW', name: 'Arco do Mestre (T6)', nameEn: "Bow", tier: 6, category: 'Armas' },
  { id: 'T4_2H_WARBOW', name: 'Arco de Guerra (T4)', nameEn: "Warbow", tier: 4, category: 'Armas' },
  { id: 'T4_2H_CROSSBOW', name: 'Besta (T4)', nameEn: "Crossbow", tier: 4, category: 'Armas' },
  { id: 'T4_MAIN_1HCROSSBOW', name: 'Besta Leve (T4)', nameEn: "Light Crossbow", tier: 4, category: 'Armas' },

  // Cajados
  { id: 'T4_MAIN_HOLYSTAFF', name: 'Cajado Sagrado (T4)', nameEn: "Holy Staff", tier: 4, category: 'Armas' },
  { id: 'T4_2H_FIRESTAFF', name: 'Cajado de Fogo (T4)', nameEn: "Great Fire Staff", tier: 4, category: 'Armas' },
  { id: 'T4_MAIN_CURSEDSTAFF', name: 'Cajado Amaldiçoado (T4)', nameEn: "Cursed Staff", tier: 4, category: 'Armas' },
  { id: 'T4_2H_FROSTSTAFF', name: 'Cajado de Gelo (T4)', nameEn: "Great Frost Staff", tier: 4, category: 'Armas' },

  // Armaduras
  { id: 'T4_ARMOR_CLOTH_SET2', name: 'Hábito de Clérigo (T4)', nameEn: "Cleric Robe", tier: 4, category: 'Armaduras' },
  { id: 'T6_ARMOR_CLOTH_SET2', name: 'Hábito de Clérigo (T6)', nameEn: "Cleric Robe", tier: 6, category: 'Armaduras' },
  { id: 'T4_ARMOR_CLOTH_SET3', name: 'Hábito de Mago (T4)', nameEn: "Mage Robe", tier: 4, category: 'Armaduras' },
  { id: 'T4_ARMOR_LEATHER_SET1', name: 'Jaqueta de Mercenário (T4)', nameEn: "Mercenary Jacket", tier: 4, category: 'Armaduras' },
  { id: 'T5_ARMOR_LEATHER_SET1', name: 'Jaqueta de Mercenário (T5)', nameEn: "Mercenary Jacket", tier: 5, category: 'Armaduras' },
  { id: 'T6_ARMOR_LEATHER_SET1', name: 'Jaqueta de Mercenário (T6)', nameEn: "Mercenary Jacket", tier: 6, category: 'Armaduras' },
  { id: 'T4_ARMOR_LEATHER_SET3', name: 'Jaqueta de Assassino (T4)', nameEn: "Assassin Jacket", tier: 4, category: 'Armaduras' },
  { id: 'T4_ARMOR_PLATE_SET1', name: 'Armadura de Soldado (T4)', nameEn: "Soldier Armor", tier: 4, category: 'Armaduras' },
  { id: 'T6_ARMOR_PLATE_SET1', name: 'Armadura de Soldado (T6)', nameEn: "Soldier Armor", tier: 6, category: 'Armaduras' },
  { id: 'T4_ARMOR_PLATE_SET3', name: 'Armadura de Guardião (T4)', nameEn: "Guardian Armor", tier: 4, category: 'Armaduras' },

  // Capacetes & Botas
  { id: 'T4_HEAD_CLOTH_SET2', name: 'Capuz de Clérigo (T4)', nameEn: "Cleric Cowl", tier: 4, category: 'Capacetes' },
  { id: 'T4_HEAD_LEATHER_SET1', name: 'Capuz de Mercenário (T4)', nameEn: "Mercenary Hood", tier: 4, category: 'Capacetes' },
  { id: 'T4_HEAD_LEATHER_SET2', name: 'Capuz de Caçador (T4)', nameEn: "Hunter Hood", tier: 4, category: 'Capacetes' },
  { id: 'T4_HEAD_PLATE_SET1', name: 'Elmo de Soldado (T4)', nameEn: "Soldier Helmet", tier: 4, category: 'Capacetes' },
  { id: 'T4_SHOES_CLOTH_SET1', name: 'Sandálias de Erudito (T4)', nameEn: "Scholar Sandals", tier: 4, category: 'Botas' },
  { id: 'T4_SHOES_LEATHER_SET1', name: 'Sapatos de Mercenário (T4)', nameEn: "Mercenary Shoes", tier: 4, category: 'Botas' },
  { id: 'T4_SHOES_PLATE_SET1', name: 'Botas de Soldado (T4)', nameEn: "Soldier Boots", tier: 4, category: 'Botas' },

  // Montarias
  { id: 'T3_MOUNT_HORSE', name: 'Cavalo de Montar (T3)', nameEn: "Riding Horse", tier: 3, category: 'Montarias' },
  { id: 'T4_MOUNT_HORSE', name: 'Cavalo de Montar (T4)', nameEn: "Riding Horse", tier: 4, category: 'Montarias' },
  { id: 'T5_MOUNT_HORSE', name: 'Cavalo de Montar (T5)', nameEn: "Riding Horse", tier: 5, category: 'Montarias' },
  { id: 'T3_MOUNT_OX', name: 'Boi de Transporte (T3)', nameEn: "Transport Ox", tier: 3, category: 'Montarias' },
  { id: 'T4_MOUNT_OX', name: 'Boi de Transporte (T4)', nameEn: "Transport Ox", tier: 4, category: 'Montarias' },
  { id: 'T5_MOUNT_OX', name: 'Boi de Transporte (T5)', nameEn: "Transport Ox", tier: 5, category: 'Montarias' },
  { id: 'T5_MOUNT_DIREWOLF', name: 'Lobo-vil Manso (T5)', nameEn: "Tame Direwolf", tier: 5, category: 'Montarias' },
  { id: 'T6_MOUNT_DIREWOLF', name: 'Lobo-vil de Montar (T6)', nameEn: "Direwolf", tier: 6, category: 'Montarias' },
  { id: 'T8_MOUNT_MAMMOTH_TRANSPORT', name: 'Mamute de Comando de Transporte (T8)', nameEn: "Command Mammoth", tier: 8, category: 'Montarias' },

  // Consumíveis & Alimentos & Poções
  { id: 'T4_POTION_HEAL', name: 'Poção de Cura Menor (T4)', nameEn: "Minor Healing Potion", tier: 4, category: 'Poções' },
  { id: 'T6_POTION_HEAL', name: 'Poção de Cura Maior (T6)', nameEn: "Major Healing Potion", tier: 6, category: 'Poções' },
  { id: 'T4_POTION_ENERGY', name: 'Poção de Energia (T4)', nameEn: "Energy Potion", tier: 4, category: 'Poções' },
  { id: 'T6_POTION_ENERGY', name: 'Poção de Energia Maior (T6)', nameEn: "Major Energy Potion", tier: 6, category: 'Poções' },
  { id: 'T7_MEAL_PORK_OMELETTE', name: 'Omelete de Porco (T7)', nameEn: "Pork Omelette", tier: 7, category: 'Alimentos' },
  { id: 'T7_MEAL_PORK_PIE', name: 'Torta de Porco (T7)', nameEn: "Pork Pie", tier: 7, category: 'Alimentos' },
  { id: 'T7_MEAL_ROAST_PORK', name: 'Carne Assada de Porco (T7)', nameEn: "Roast Pork", tier: 7, category: 'Alimentos' },
  { id: 'T8_MEAL_STEW', name: 'Gisado de Carne de Vaca (T8)', nameEn: "Beef Stew", tier: 8, category: 'Alimentos' },

  // Recursos & Materiais
  { id: 'T4_ORE', name: 'Minério de Ferro (T4)', nameEn: "Iron Ore", tier: 4, category: 'Recursos' },
  { id: 'T4_METALBAR', name: 'Barra de Aço (T4)', nameEn: "Steel Bar", tier: 4, category: 'Materiais' },
  { id: 'T5_METALBAR', name: 'Barra de Titânio (T5)', nameEn: "Titanium Steel Bar", tier: 5, category: 'Materiais' },
  { id: 'T4_LEATHER', name: 'Couro Trabalhado (T4)', nameEn: "Medium Leather", tier: 4, category: 'Materiais' },
  { id: 'T5_LEATHER', name: 'Couro Pesado (T5)', nameEn: "Heavy Leather", tier: 5, category: 'Materiais' },
  { id: 'T4_PLANKS', name: 'Tábuas de Pinheiro (T4)', nameEn: "Pine Planks", tier: 4, category: 'Materiais' },
  { id: 'T5_PLANKS', name: 'Tábuas de Cedro (T5)', nameEn: "Cedar Planks", tier: 5, category: 'Materiais' },
  { id: 'T4_RUNE', name: 'Runa do Adepto (T4)', nameEn: "Adept's Rune", tier: 4, category: 'Materiais' },
  { id: 'T5_RUNE', name: 'Runa do Perito (T5)', nameEn: "Expert's Rune", tier: 5, category: 'Materiais' },
  { id: 'T6_RUNE', name: 'Runa do Mestre (T6)', nameEn: "Master's Rune", tier: 6, category: 'Materiais' },
  { id: 'T4_SOUL', name: 'Alma do Adepto (T4)', nameEn: "Adept's Soul", tier: 4, category: 'Materiais' },
  { id: 'T5_SOUL', name: 'Alma do Perito (T5)', nameEn: "Expert's Soul", tier: 5, category: 'Materiais' },
  { id: 'T6_SOUL', name: 'Alma do Mestre (T6)', nameEn: "Master's Soul", tier: 6, category: 'Materiais' },
  { id: 'T4_RELIC', name: 'Relíquia do Adepto (T4)', nameEn: "Adept's Relic", tier: 4, category: 'Materiais' },
  { id: 'T5_RELIC', name: 'Relíquia do Perito (T5)', nameEn: "Expert's Relic", tier: 5, category: 'Materiais' },

  // Ferramentas
  { id: 'T4_2H_TOOL_PICK', name: 'Picareta do Adepto (T4)', nameEn: "Adept's Pickaxe", tier: 4, category: 'Ferramentas' },
  { id: 'T4_2H_TOOL_AXE', name: 'Machado de Lenhador do Adepto (T4)', nameEn: "Adept's Woodchopper Axe", tier: 4, category: 'Ferramentas' },
  { id: 'T4_2H_TOOL_SKINNINGKNIFE', name: 'Faca de Esfolar do Adepto (T4)', nameEn: "Adept's Skinning Knife", tier: 4, category: 'Ferramentas' }
];
