// --- CONFIGURAÇÕES DE NOMENCLATURA ---
export const MATERIAL_NAMES: Record<string, { raw: string; refined: string }> = {
  'Madeira': { raw: 'Tronco', refined: 'Tábua' },
  'Minério': { raw: 'Minério', refined: 'Barra de Metal' },
  'Pelego': { raw: 'Pelego', refined: 'Couro' },
  'Pedra': { raw: 'Pedra', refined: 'Bloco de Pedra' },
  'Fibra': { raw: 'Fibra', refined: 'Tecido' },
};

// --- ESPECIALIZAÇÕES DE CIDADES ---
export const CITY_SPECIALIZATIONS: Record<string, string> = {
  'Martlock': 'Pelego',
  'Fort Sterling': 'Madeira',
  'Lymhurst': 'Fibra',
  'Bridgewatch': 'Pedra',
  'Thetford': 'Minério',
};

// --- PROPORÇÕES DE REFINO (Tabelas fornecidas por você) ---
export const TIER_RATIOS: Record<number, number> = {
  3: 2, // 2x Bruto T3 + 1x Refinado T2
  4: 2, // 2x Bruto T4 + 1x Refinado T3
  5: 3, // 3x Bruto T5 + 1x Refinado T4
  6: 4, // 4x Bruto T6 + 1x Refinado T5
  7: 5, // 5x Bruto T7 + 1x Refinado T6
  8: 5, // 5x Bruto T8 + 1x Refinado T7
};

// --- BANCO DE DADOS DE RECEITAS DE CRAFT ---
// Aqui é onde a "mágica" da explosão acontece. 
// Para adicionar mais itens, basta seguir este padrão de objeto.
export const CRAFT_RECIPES: Record<string, { materials: { name: string; qty: number }[] }> = {
  // --- ARMAS ---
  'Espada Larga': { materials: [{ name: 'Tábua T4', qty: 12 }, { name: 'Barra T4', qty: 6 }] },
  'Espada de Uma Mão': { materials: [{ name: 'Tábua T4', qty: 8 }, { name: 'Barra T4', qty: 4 }] },
  'Claymore': { materials: [{ name: 'Tábua T4', qty: 15 }, { name: 'Barra T4', qty: 8 }] },
  'Espada Curva': { materials: [{ name: 'Tábua T4', qty: 10 }, { name: 'Barra T4', qty: 5 }] },
  'Machado de Batalha': { materials: [{ name: 'Tábua T4', qty: 10 }, { name: 'Barra T4', qty: 5 }] },
  'Machado de Guerra': { materials: [{ name: 'Tábua T4', qty: 12 }, { name: 'Barra T4', qty: 6 }] },
  'Machado Duplo': { materials: [{ name: 'Tábua T4', qty: 14 }, { name: 'Barra T4', qty: 7 }] },
  'Maça de Guerra': { materials: [{ name: 'Barra T4', qty: 12 }, { name: 'Tábua T4', qty: 6 }] },
  'Maça de Uma Mão': { materials: [{ name: 'Barra T4', qty: 8 }, { name: 'Tábua T4', qty: 4 }] },
  'Maça Pesada': { materials: [{ name: 'Barra T4', qty: 16 }] },
  'Lança': { materials: [{ name: 'Tábua T4', qty: 12 }, { name: 'Barra T4', qty: 4 }] },
  'Lança de Cavalaria': { materials: [{ name: 'Tábua T4', qty: 14 }, { name: 'Barra T4', qty: 6 }] },
  'Lança de Batalha': { materials: [{ name: 'Tábua T4', qty: 16 }, { name: 'Barra T4', qty: 8 }] },
  'Arco Longo': { materials: [{ name: 'Tábua T4', qty: 20 }] },
  'Arco Curto': { materials: [{ name: 'Tábua T4', qty: 16 }] },
  'Arco Composto': { materials: [{ name: 'Tábua T4', qty: 18 }] },
  'Besta de Mão': { materials: [{ name: 'Tábua T4', qty: 10 }, { name: 'Barra T4', qty: 4 }] },
  'Besta Pesada': { materials: [{ name: 'Tábua T4', qty: 14 }, { name: 'Barra T4', qty: 6 }] },
  'Besta de Repetição': { materials: [{ name: 'Tábua T4', qty: 16 }, { name: 'Barra T4', qty: 8 }] },
  'Cajado de Fogo': { materials: [{ name: 'Tábua T4', qty: 12 }, { name: 'Barra T4', qty: 4 }] },
  'Cajado de Gelo': { materials: [{ name: 'Tábua T4', qty: 12 }, { name: 'Barra T4', qty: 4 }] },
  'Cajado Natureza': { materials: [{ name: 'Tábua T4', qty: 16 }] },
  'Cajado Sagrado': { materials: [{ name: 'Tábua T4', qty: 12 }, { name: 'Barra T4', qty: 4 }] },
  'Adaga': { materials: [{ name: 'Barra T4', qty: 8 }, { name: 'Couro T4', qty: 4 }] },
  'Adaga Dupla': { materials: [{ name: 'Barra T4', qty: 12 }, { name: 'Couro T4', qty: 6 }] },
  'Espada Curta': { materials: [{ name: 'Barra T4', qty: 8 }, { name: 'Tábua T4', qty: 4 }] },

  // ARMADURAS
  'Bota do Soldado': { materials: [{ name: 'Couro T4', qty: 8 }, { name: 'Tecido T4', qty: 4 }] },
  'Bota do Guardião': { materials: [{ name: 'Couro T4', qty: 10 }, { name: 'Placa T4', qty: 6 }] },
  'Bota de Couro': { materials: [{ name: 'Couro T4', qty: 8 }] },
  'Bota de Tecido': { materials: [{ name: 'Tecido T4', qty: 8 }] },
  'Casaco de Mercenário': { materials: [{ name: 'Couro T4', qty: 16 }, { name: 'Tecido T4', qty: 5 }] },
  'Casaco do Assassino': { materials: [{ name: 'Couro T4', qty: 16 }] },
  'Casaco de Placas': { materials: [{ name: 'Placa T4', qty: 16 }] },
  'Casaco de Tecido': { materials: [{ name: 'Tecido T4', qty: 16 }] },
  'Capacete de Soldado': { materials: [{ name: 'Placa T4', qty: 8 }] },
  'Capacete de Guardião': { materials: [{ name: 'Placa T4', qty: 8 }] },
  'Capacete de Tecido': { materials: [{ name: 'Tecido T4', qty: 8 }] },
  'Capacete de Couro': { materials: [{ name: 'Couro T4', qty: 8 }] },

  // CONSUMÍVEIS
  'Poção de Veneno': { materials: [{ name: 'Erva T4', qty: 20 }, { name: 'Água T4', qty: 5 }] },
  'Poção da Invisibilidade': { materials: [{ name: 'Erva T4', qty: 24 }, { name: 'Água T4', qty: 8 }] },
  'Poção Calmante': { materials: [{ name: 'Erva T4', qty: 16 }, { name: 'Água T4', qty: 4 }] },
  'Poção de Cura': { materials: [{ name: 'Erva T4', qty: 15 }, { name: 'Água T4', qty: 5 }] },
  'Assado de Porco': { materials: [{ name: 'Carne de Porco T4', qty: 10 }, { name: 'Vegetal T4', qty: 5 }] },
  'Sopa de Vegetais': { materials: [{ name: 'Vegetal T4', qty: 12 }] },
  'Peixe Assado': { materials: [{ name: 'Peixe T4', qty: 8 }, { name: 'Vegetal T4', qty: 4 }] },
  'Sanduíche de Carne': { materials: [{ name: 'Carne T4', qty: 10 }, { name: 'Pão T4', qty: 5 }] },
};

export const CRAFT_CATEGORIES: Record<string, Record<string, string[]>> = {
  'Armas': {
    'Espadas': ['Espada Larga', 'Espada de Uma Mão', 'Claymore', 'Espada Curva'],
    'Machados': ['Machado de Batalha', 'Machado de Guerra', 'Machado Duplo'],
    'Maças': ['Maça de Guerra', 'Maça de Uma Mão', 'Maça Pesada'],
    'Lanças': ['Lança', 'Lança de Cavalaria', 'Lança de Batalha'],
    'Arcos': ['Arco Longo', 'Arco Curto', 'Arco Composto'],
    'Bestas': ['Besta de Mão', 'Besta Pesada', 'Besta de Repetição'],
    'Cajados': ['Cajado de Fogo', 'Cajado de Gelo', 'Cajado Natureza', 'Cajado Sagrado'],
    'Adagas': ['Adaga', 'Adaga Dupla', 'Espada Curta'],
  },
  'Armaduras': {
    'Capacetes': ['Capacete de Soldado', 'Capacete de Guardião', 'Capacete de Tecido', 'Capacete de Couro'],
    'Casacos': ['Casaco de Mercenário', 'Casaco do Assassino', 'Casaco de Placas', 'Casaco de Tecido'],
    'Botas': ['Bota do Soldado', 'Bota do Guardião', 'Bota de Couro', 'Bota de Tecido'],
  },
  'Consumíveis': {
    'Poções': ['Poção de Veneno', 'Poção da Invisibilidade', 'Poção Calmante', 'Poção de Cura'],
    'Comidas': ['Assado de Porco', 'Sopa de Vegetais', 'Peixe Assado', 'Sanduíche de Carne'],
  }
};
