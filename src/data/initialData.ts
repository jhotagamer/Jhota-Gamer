import { BioData, Game, Guide, Build, NewsItem, VideoItem, SocialMedia, UsefulLink } from '../types';

export const OFFICIAL_BANNER_URL = "https://i.postimg.cc/L4W075s2/banner-limpo.png";

export const initialBio: BioData = {
  name: "Jhota",
  brandName: "Jhota Gamer",
  tagline: "Seu universo gamer começa aqui!",
  subTagline: "MMORPG • RPG • Sandbox • Guias • Builds • Notícias e Estratégias",
  avatarUrl: "https://i.postimg.cc/502CTWWH/foto-de-perfil.png",
  bannerUrl: OFFICIAL_BANNER_URL,
  bioParagraphs: [
    "Olá, guerreiros e aventureiros! Eu sou o Jhota, criador de conteúdo focado nos universos mais desafiadores e imersivos dos games. Desde as primeiras batalhas campais no Lineage 2 até as guerras impiedosas de guilda na Zona Negra de Albion Online, os jogos sempre foram minha maior paixão.",
    "O canal Jhota Gamer nasceu com o propósito de unir veteranos e iniciantes. Aqui você não encontra apenas gameplay comum: produzimos guias detalhados passo a passo, análises de meta em tempo real, rotas econômicas comprovadas e as melhores builds para você dominar qualquer servidor.",
  ],
  trajectoryIntro: "Comecei a jogar com 14 anos no ano de 2006, jogando em lan house com amigos, e de lá para cá nunca deixei de me aventurar em diversos jogos.",
  trajectory: [
    {
      year: "2006",
      title: "A Era de Ouro do Lineage 2",
      description: "O marco inicial da minha jornada como gamer, onde descobri a paixão pelo universo dos jogos online no Lineage 2. Atuei como líder de clã em diversos servidores — inclusive no oficial —, consolidando vasta experiência em todas as classes, quests complexas e na progressão avançada do jogo."
    },
    {
      year: "2019",
      title: "Domínio no Sandbox do Albion Online",
      description: "Especialização nas atividades mais dinâmicas e lucrativas do jogo: controle de economia, transporte de itens, métodos eficientes para fazer prata e estratégias de lucros com ilhas. Atuação constante nas Estradas de Avalon, além de PvP de alto impacto e farm consistente na Zona Negra (Black Zone)."
    }
  ],
  channelObjectives: [
    "Produzir os guias em português mais completos e didáticos do YouTube.",
    "Criar uma guilda/comunidade ativa e acolhedora no Discord para jogar junto com os inscritos.",
    "Realizar lives de guerras de território, análises de replays e eventos com premiações.",
    "Manter o portal sempre atualizado com as últimas notas de atualização de Albion Online e Lineage 2."
  ],
  favoriteGames: ["Albion Online", "Lineage 2", "World of Warcraft", "Elder Scrolls Online"],
  stats: {
    subscribers: "45.8K+",
    videos: "380+",
    yearsGaming: "18+ Anos",
    guildMembers: "3.200+"
  }
};

export const initialGames: Game[] = [
  {
    id: "albion-online",
    slug: "albion-online",
    name: "Albion Online",
    genre: "MMORPG Sandbox Hardcore",
    tagline: "Você é o que você veste. Economia 100% orientada por jogadores.",
    description: "Um clássico MMORPG medieval sem classes fixas onde a economia, as guerras de guildas na Zona Negra (Black Zone) e o PvP full-loot ditam o destino de cada império. Aqui no canal Jhota Gamer você aprende desde a economia básica e refino até as composições de ZvZ mais letais.",
    badge: "Builds & Dicas",
    themeColor: "amber",
    coverImage: "https://i.postimg.cc/ZR4x7N00/albion-online.jpg",
    bannerImage: "https://i.postimg.cc/ZR4x7N00/albion-online.jpg",
    status: "Em Destaque",
    stats: [
      { label: "Servidor Principal", value: "Albion Americas / Europa" },
      { label: "Foco Principal", value: "ZvZ & Economia T8" },
      { label: "Guias no Site", value: "18 Guias" },
      { label: "Comunidade", value: "Guilda Ativa" }
    ],
    features: [
      "Sistema de economia conduzido integralmente por jogadores",
      "PvP Full-Loot em Zonas Vermelhas e Pretas",
      "Liberdade total: alterne habilidades trocando de armadura e arma",
      "Guerras massivas territoriais Zerg vs Zerg com centenas de jogadores"
    ],
    guidesCount: 18,
    buildsCount: 13,
    videosCount: 45
  },
  {
    id: "lineage-2",
    slug: "lineage-2",
    name: "Lineage 2",
    genre: "MMORPG Fantasia Clássica",
    tagline: "A lenda dos cercos a castelos, dragões milenares e honra de clã.",
    description: "Um dos MMORPGs mais emblemáticos de todos os tempos. Batalhas ferozes pelas Grand Olympiads, caça a World Bosses como Antharas, Valakas e Baium, além dos lendários Castle Sieges que paravam servidores inteiros. Trazemos análises de servidores privados, oficiais e guias de evolução rápida.",
    badge: "Nostalgia & Épico",
    themeColor: "rose",
    coverImage: "https://i.postimg.cc/Mp63Thzt/lineage-2.png",
    bannerImage: "https://i.postimg.cc/Mp63Thzt/lineage-2.png",
    status: "Série Regular",
    stats: [
      { label: "Crônicas Focadas", value: "C4, Interlude & Classic" },
      { label: "Classes em Destaque", value: "Duelist / Mage / Dagger" },
      { label: "Conteúdos", value: "PvP & Sieges" },
      { label: "Status", value: "Temporadas Especiais" }
    ],
    features: [
      "Cercos lendários aos castelos de Giran, Goddard e Aden",
      "Grand Olympiad: disputas individuais para o título de Herói",
      "Craft complexo de armas Soulshots e armaduras Draconic/Imperial",
      "PvP de mundo aberto com sistema de Karma e PK eletrizante"
    ],
    guidesCount: 14,
    buildsCount: 0,
    videosCount: 32
  }
];

export const initialGuides: Guide[] = [
  {
    id: "guia-albion-iniciante-2026",
    gameId: "albion-online",
    gameName: "Albion Online",
    title: "Guia Definitivo do Iniciante: Do Tier 3 ao Tier 8 sem passar sufoco",
    summary: "Como começar com o pé direito, entender o Quadro de Destino e evitar perdas fatais na sua primeira ida à Zona Vermelha.",
    category: "Iniciante",
    readTime: "8 min de leitura",
    publishedDate: "12 de Setembro, 2026",
    author: "Jhota Gamer",
    recommendedLevel: "Tier 3 a Tier 6",
    tags: ["Albion", "Iniciante", "Farming", "Quadro de Destino", "Economia"],
    content: {
      intro: "Entrar no universo de Albion Online pela primeira vez pode ser intimidador devido à vastidão do Quadro de Destino e à ameaça constante do PvP full-loot. Neste guia prático, condensei anos de experiência para você evoluir rápido e com segurança.",
      sections: [
        {
          heading: "1. Dominando a Cidade Real e sua Ilha Pessoal",
          text: "Ao sair da ilha do tutorial, escolha uma cidade com mercado forte que combine com o recurso que você deseja coletar. Cidades como Martlock (pedra), Bridgewatch (couro) e Lymhurst (madeira) possuem bônus regionais de refino que aumentam seu retorno em até 36.7%.",
          bulletPoints: [
            "Não gaste seus Pontos de Aprendizagem (LP) em níveis baixos de maestria.",
            "Invista os primeiros 500k de prata comprando a Ilha Pessoal para criar hortas e trabalhadores.",
            "Use sempre montaria com bônus de peso proporcional à sua carga de coleta."
          ],
          tipBox: "Dica de Ouro do Jhota: Nunca viaje com itens que você não tenha condições de comprar novamente 3 vezes no mercado."
        },
        {
          heading: "2. Transição Segura para Zonas Amarelas e Vermelhas",
          text: "A Zona Amarela é o campo de treino perfeito para testar suas habilidades e combos sem perder seus pertences ao cair. Quando estiver com equipamento Tier 5 completo e maestria mínima de 30, monte um conjunto barato (T4.1) para desbravar Zonas Vermelhas.",
          bulletPoints: [
            "Fique sempre atento ao contador de PKs hostis no canto inferior direito da tela.",
            "Mantenha sua montaria por perto para recuperar a velocidade instantaneamente caso aviste nomes vermelhos.",
            "Coma ensopados ou tortas de porco para aumentar o rendimento dos mobs e coleta."
          ]
        },
        {
          heading: "3. Rotina de Especialização em Combate",
          text: "Focar em um único conjunto de armadura e arma é o segredo para atingir 100/100 de maestria. A diferença de poder de item (IP) entre um personagem especializado e um generalista é gigantesca durante os duelos."
        }
      ],
      conclusion: "Siga esses fundamentos com consistência e em menos de duas semanas você estará participando ativamente das frotas da guilda na Zona Negra com respeito e poder de fogo."
    }
  },
  {
    id: "guia-albion-transporte-milionario",
    gameId: "albion-online",
    gameName: "Albion Online",
    title: "Economia & Transporte: Como Lucrar Milhões de Prata entre Cidades",
    summary: "Estratégia comprovada de arbitragem de mercado e transporte de matérias-primas aproveitando taxas de retorno de refino.",
    category: "Economia",
    readTime: "11 min de leitura",
    publishedDate: "05 de Setembro, 2026",
    author: "Jhota Gamer",
    recommendedLevel: "Intermediário / Avançado",
    tags: ["Economia", "Trade", "Prata", "Transporte", "Mercado"],
    content: {
      intro: "A prata move o mundo de Albion. Se você não gosta de passar horas matando monstros mas quer encher os bolsos, o comércio interestadual nas Cidades Reais é uma das máquinas financeiras mais seguras se executada com método.",
      sections: [
        {
          heading: "1. O Ciclo das Cidades Reais",
          text: "Cada cidade tem escassez de determinados itens e abundância de outros. Transportar barras de ferro de Fort Sterling para Thetford ou tábuas de Lymhurst para Caerleon gera margens brutas entre 15% e 40% por viagem.",
          tipBox: "Atenção: Transportar para Caerleon exige atravessar zonas vermelhas. Faça isso apenas em grupos de batedores ou em horários de menor pico."
        },
        {
          heading: "2. Montarias Recomendadas para Cargas",
          text: "Para iniciantes no transporte, o Boi T5 ou T6 é suficiente dentro de zonas seguras (Azuis e Amarelas). Para rotas com risco de gank, dê preferência ao Mamute de Transporte (se tiver capital) ou ao Javali Selvagem Blindado, que mantém velocidade de corrida alta mesmo se você for desmontado."
        }
      ],
      conclusion: "Comece com 200k de investimento em barras de bronze e veja seu montante dobrar em poucas rotas bem calculadas."
    }
  },
  {
    id: "guia-lineage2-siege-giran",
    gameId: "lineage-2",
    gameName: "Lineage 2",
    title: "Guia Tático de Cerco a Castelos (Castle Siege): A Tomada de Giran",
    summary: "Posicionamento de catapultas, quebra dos portões externos, controle da Throne Room e cancelamento de Holy Artifact.",
    category: "Estratégia",
    readTime: "10 min de leitura",
    publishedDate: "28 de Agosto, 2026",
    author: "Jhota Gamer",
    recommendedLevel: "Clã Nível 5+",
    tags: ["Lineage 2", "Siege", "Giran", "PvP Massivo", "Estratégia"],
    content: {
      intro: "No Lineage 2, não há glória maior do que ver o brasão do seu clã hasteado na torre mais alta de Giran Castle. Um cerco dura 2 horas de pura adrenalina militar, onde a coordenação de voz vence qualquer número isolado.",
      sections: [
        {
          heading: "1. Composição Obrigatória das Partys (CPs)",
          text: "Você precisa de 3 grupos fundamentais: a Party de Rush Melee/Dagger (foco em matar Bishops e dano explosivo), a Party de Mages de Área (Sorcerer/Spellsinger lançando Slow e AoE) e a Party de Suporte com Bishop, Elven Elder, Warcryer e Swordsinger.",
          bulletPoints: [
            "Bishops devem ficar recuados com foco em Greater Group Heal e Balance Life.",
            "Swordsingers e Spectral Dancers mantêm Song of Wind e Dance of Fire sem interrupções.",
            "O líder do clã deve estar protegido por guarda de tanques (Paladin ou Dark Avenger) durante o cast do selo."
          ],
          tipBox: "Lembre-se: O cast da Holy Artifact leva 3 minutos sem sofrer nenhum interrupt ou dano direto. Proteja o líder com escudos defensivos!"
        }
      ],
      conclusion: "A vitória no Siege consolida o poder político da sua aliança por 14 dias inteiros com arrecadação de impostos das lojas da cidade."
    }
  }
];

export const initialBuilds: Build[] = [
  {
    id: "build-albion-bloodmoon",
    gameId: "albion-online",
    gameName: "Albion Online",
    title: "Cajado da Lua Sangrenta - Masmorra de Grupo Solo (Bloodmoon Staff)",
    role: "Masmorra de Grupo Solo / Metamorfo",
    tier: "S-Tier",
    difficulty: "Avançado",
    description: "Build especializada para solar masmorras de grupo (Group Dungeons) com Cajado da Lua Sangrenta (Bloodmoon Staff). Altíssima auto-cura através da sinergia entre Werewolf Transformation e Bloodlust do Casaco de Mercenário.",
    gear: [
      {
        slot: "Arma",
        item: "Cajado da Lua Sangrenta",
        englishName: "Bloodmoon Staff",
        iconUrl: "https://render.albiononline.com/v1/item/T8_2H_SHAPESHIFTER_MORGANA.png",
        details: "Cajado Metamorfo (Shapeshifter) para transfiguração em Lobisomem"
      },
      {
        slot: "Yelmo",
        item: "Capuz do Perseguidor",
        englishName: "Stalker Hood",
        iconUrl: "https://render.albiononline.com/v1/item/T8_HEAD_LEATHER_MORGANA.png",
        details: "Agonia Mortal (Mortal Agony) / Mente Equilibrada (Balanced Mind)"
      },
      {
        slot: "Armadura",
        item: "Casaco de Mercenário",
        englishName: "Mercenary Jacket",
        iconUrl: "https://render.albiononline.com/v1/item/T8_ARMOR_LEATHER_SET1.png",
        details: "Sede de Sangue (Bloodlust) / Mente Equilibrada (Balanced Mind)"
      },
      {
        slot: "Botas",
        item: "Sandálias da Pureza",
        englishName: "Sandals of Purity",
        iconUrl: "https://render.albiononline.com/v1/item/T8_SHOES_CLOTH_AVALON.png",
        details: "Disparada Energética (Energetic Sprint) / Eficiência (Efficiency)"
      },
      {
        slot: "Capa",
        item: "Capa de Caerleon",
        englishName: "Caerleon Cape",
        iconUrl: "https://render.albiononline.com/v1/item/T8_CAPEITEM_FW_CAERLEON.png",
        details: "Alternativa: Capa de Avalon (Avalonian Cape)"
      }
    ],
    skills: [
      {
        slot: "Q",
        skill: "Fissura na Realidade",
        englishName: "Reality Fissure",
        details: "Dano principal em área e geração de cargas de transfiguração"
      },
      {
        slot: "W",
        skill: "Distorção",
        englishName: "Distortion",
        details: "Controle de área e redução de resistências dos inimigos"
      },
      {
        slot: "E",
        skill: "Transformação em Lobisomem",
        englishName: "Werewolf Transformation",
        details: "Transfiguração veloz com roubo de vida passivo brutal nas garras"
      },
      {
        slot: "Passiva",
        skill: "Fera Alterada",
        englishName: "Altered Beast",
        details: "Aumento de dano de ataque e sustentação contínua na forma de fera"
      }
    ],
    consumables: [
      {
        type: "Poção",
        item: "Poção de Invisibilidade",
        englishName: "Invisibility Potion",
        iconUrl: "https://render.albiononline.com/v1/item/T8_POTION_CLEANSE.png",
        note: "Para resetar agro dos monstros ou reposicionar em segurança"
      },
      {
        type: "Comida",
        item: "Porco Assado",
        englishName: "Roast Pork",
        iconUrl: "https://render.albiononline.com/v1/item/T7_MEAL_ROAST.png",
        note: "Alternativa: Pargo de Névoa Pura Assado (Roasted Puremist Snapper)"
      }
    ],
    pros: [
      "Capacidade incomparável de solar chefes de Masmorra de Grupo (Group Dungeons)",
      "Auto-cura massiva combinando Sede de Sangue (Bloodlust) com os ataques do Lobisomem",
      "Excelente dano em área (AoE) para limpar pacotes inteiros de monstros"
    ],
    cons: [
      "Requer gerenciamento de energia e timing para alternar entre forma humana e lobo",
      "Equipamento de maior custo em zonas com saque total (Full Loot)"
    ],
    playstyleTip: "Use o Q (Fissura na Realidade) e W (Distorção) para juntar os monstros e gerar cargas. Convoque a Transformação em Lobisomem (E) e ative a Sede de Sangue do Casaco para encher toda a sua barra de vida em segundos!"
  },
  {
    id: "build-albion-bloodletter",
    gameId: "albion-online",
    gameName: "Albion Online",
    title: "Bloodletter Gank & Escape (Zona Negra Solo)",
    role: "Solo PvP / Escape",
    tier: "S-Tier",
    difficulty: "Médio",
    description: "A montagem mais ágil e confiável para sobrevivência e assassinatos rápidos em masmorras corrompidas e rotas abertas da Black Zone.",
    gear: [
      {
        slot: "Arma Principal",
        item: "Sanguinária",
        englishName: "Bloodletter",
        iconUrl: "https://render.albiononline.com/v1/item/T8_MAIN_SCIMITAR_MORGANA.png",
        details: "Skill Q2 de dano e W de corrida ou silêncio"
      },
      {
        slot: "Mão Secundária",
        item: "Brumário",
        englishName: "Mistcaller",
        iconUrl: "https://render.albiononline.com/v1/item/T8_OFF_HORN_KEEPER.png",
        details: "Redução maciça de tempo de recarga (CDR)"
      },
      {
        slot: "Capuz",
        item: "Capuz de Assassino",
        englishName: "Assassin Hood",
        iconUrl: "https://render.albiononline.com/v1/item/T8_HEAD_LEATHER_SET3.png",
        details: "Meditação para reiniciar as habilidades de corrida"
      },
      {
        slot: "Armadura",
        item: "Casaco de Assassino",
        englishName: "Assassin Jacket",
        iconUrl: "https://render.albiononline.com/v1/item/T8_ARMOR_LEATHER_SET3.png",
        details: "Emboscada para invisibilidade tática em emboscadas"
      },
      {
        slot: "Botas",
        item: "Sapatos de Mineiro",
        englishName: "Miner Boots",
        iconUrl: "https://render.albiononline.com/v1/item/T8_SHOES_GATHERER_ORE.png",
        details: "Fuga desesperada com velocidade máxima"
      },
      {
        slot: "Capa",
        item: "Capa de Fort Sterling",
        englishName: "Fort Sterling Cape",
        iconUrl: "https://render.albiononline.com/v1/item/T8_CAPEITEM_FW_FORTSTERLING.png",
        details: "Purifica o primeiro atordoamento ou lentidão sofrido"
      }
    ],
    pros: [
      "Mobilidade incomparável com dash duplo",
      "Execução automática em alvos abaixo de 40% de vida",
      "Altíssima taxa de fuga contra grupos de gankers"
    ],
    cons: [
      "Dano sustentado moderado em lutas longas",
      "Custo elevado da arma nos tiers superiores (T8+)"
    ],
    playstyleTip: "Use a skill E da Bloodletter apenas para finalizar ou como terceiro dash de emergência se estiver sem montaria."
  },
  {
    id: "build-l2-duelist",
    gameId: "lineage-2",
    gameName: "Lineage 2",
    title: "Duelist (Gladiador) - Dual Swords Full Critical & Burst",
    role: "Melee DPS Burst",
    tier: "S-Tier",
    difficulty: "Avançado",
    description: "Uma verdadeira máquina de combate com espadas duplas, causando dano crítico massivo através do combo Triple Sonic Slash e Sonic Buster.",
    gear: [
      { slot: "Arma", item: "Dual Keshanberk*Keshanberk +16 (ou Dual Tallum)", details: "SA Critical Focus ou Health" },
      { slot: "Set de Armadura", item: "Tallum Heavy Set (ou Draconic Light)", details: "+8% Atk Speed e resistência a debuffs" },
      { slot: "Jóias Épicas", item: "Necklace of Valakas + Ring of Baium", details: "+15% P.Atk e dano crítico adicional" },
      { slot: "Tatuagens (Dyes)", item: "+4 STR / -4 CON e +4 DEX / -4 CON", details: "Maximizar velocidade e dano bruto" }
    ],
    pros: [
      "Capacidade de deletar inimigos de armadura leve em menos de 3 segundos",
      "Excelente performance nas 1v1 da Grand Olympiad",
      "Estilo visual imponente com lâminas duplas flamejantes"
    ],
    cons: [
      "Consumo altíssimo de Soulshots e poções de mana",
      "Falta de habilidades de gap-close à distância contra arqueiros velozes"
    ],
    playstyleTip: "Mantenha sempre os Sonic Focus carregados no nível 7 antes de abrir o combate para disparar Sonic Buster e Triple Slash em sequência."
  }
];

export const initialNews: NewsItem[] = [
  // ALBION ONLINE
  {
    id: "news-albion-1",
    gameId: "albion-online",
    gameName: "Albion Online",
    title: "Notas de Atualização Oficiais: Atualização Dragonfire & Changelog",
    snippet: "Página oficial da grande atualização Dragonfire com os novos dragões, Terras Antigas, balanceamento de combate e notas completas.",
    content: "A Sandbox Interactive publicou no site oficial todos os detalhes e notas de lançamento da atualização Dragonfire, trazendo novos chefes de raide, armaduras forjadas de dragão e otimizações gerais de jogabilidade.",
    category: "Patch Notes",
    date: "Atualização Dragonfire",
    readTime: "Site Oficial Albion",
    imageUrl: "https://i.postimg.cc/ZR4x7N00/albion-online.jpg",
    badgeColor: "amber",
    officialUrl: "https://albiononline.com/pt/update/dragonfire",
    officialLabel: "Ver Atualização no Site Oficial"
  },
  {
    id: "news-albion-2",
    gameId: "albion-online",
    gameName: "Albion Online",
    title: "Notas de Atualização Oficiais: Atualização Paths to Glory & Diário de Albion",
    snippet: "Página oficial da atualização Paths to Glory: introdução ao Diário de Albion com recompensas dinâmicas, novas armas de cristal e balanceamento.",
    content: "Página dedicada da expansão Paths to Glory detalhando o sistema de conquistas do Diário de Albion, novas armas de cristal para ZvZ e combates de pequena escala, e melhorias de interface.",
    category: "Patch Notes",
    date: "Atualização Paths to Glory",
    readTime: "Site Oficial Albion",
    imageUrl: "https://i.postimg.cc/ZR4x7N00/albion-online.jpg",
    badgeColor: "amber",
    officialUrl: "https://albiononline.com/pt/update/paths-to-glory",
    officialLabel: "Ver Atualização no Site Oficial"
  },
  {
    id: "news-albion-3",
    gameId: "albion-online",
    gameName: "Albion Online",
    title: "Notas de Atualização Oficiais: Atualização Foundations & Fortificações",
    snippet: "Página oficial da atualização Foundations: novo sistema de fortificações de territórios de guilda, estandartes de cerco e modo espectador.",
    content: "Apresentação oficial completa da atualização Foundations no site do Albion Online, trazendo fortificações aprimoráveis para territórios, novas armas de cristal e baús de atividade de território.",
    category: "Patch Notes",
    date: "Atualização Foundations",
    readTime: "Site Oficial Albion",
    imageUrl: "https://i.postimg.cc/ZR4x7N00/albion-online.jpg",
    badgeColor: "amber",
    officialUrl: "https://albiononline.com/pt/update/foundations",
    officialLabel: "Ver Atualização no Site Oficial"
  },
  {
    id: "news-albion-4",
    gameId: "albion-online",
    gameName: "Albion Online",
    title: "Notas de Atualização Oficiais: Atualização Wild Blood & Armas Transmorfas",
    snippet: "Página oficial da atualização Wild Blood: armas metamorfas com transformação de combate, rastreamento de monstros, itens despertados e poções.",
    content: "Página oficial com todos os recursos da expansão Wild Blood: a nova linha de armas transmorfas (Shapeshifter), sistema de rastreamento de criaturas raras no mundo aberto e reestruturação de ilhas pessoais.",
    category: "Patch Notes",
    date: "Atualização Wild Blood",
    readTime: "Site Oficial Albion",
    imageUrl: "https://i.postimg.cc/ZR4x7N00/albion-online.jpg",
    badgeColor: "amber",
    officialUrl: "https://albiononline.com/pt/update/wild-blood",
    officialLabel: "Ver Atualização no Site Oficial"
  },

  // LINEAGE 2 EXILIUM WORLD
  {
    id: "news-l2-1",
    gameId: "lineage-2",
    gameName: "Lineage 2 Exilium World",
    title: "Faris - 17/09/2026: Uma Nova Jornada Começa no Exilium!",
    snippet: "Novo sistema de tutorial completo com Agathion companheiro, modos Campanha (do nível 1 ao 80) e Jornada Livre, recompensas renovadas e guia de navegação.",
    content: "Uma nova jornada começa no Exilium World! Começar um personagem agora ficou muito mais completo e imersivo com o novo sistema de tutorial guiado por um Agathion companheiro com interface própria. Os jogadores agora podem escolher entre dois caminhos: a Campanha (ideal para iniciantes do nível 1 ao 80, com jornada guiada por regiões, NPCs com bússola e teleporte quando o destino estiver distante) ou a Jornada Livre (para veteranos evoluírem no seu próprio ritmo com EXP padrão de monstros). O sistema conta ainda com a skill Open Journey Guide, atalhos F11/F12 para gerenciar o Agathion e revisão completa de recompensas de quests incluindo armaduras, joias, poções e shots.",
    category: "Grande Atualização",
    date: "17/09/2026",
    readTime: "Exilium World",
    imageUrl: "https://i.postimg.cc/Mp63Thzt/lineage-2.png",
    badgeColor: "rose",
    officialUrl: "https://www.exiliumworld.com/news/281?lang=pt_BR",
    officialLabel: "Ver Patch no Exilium World"
  },
  {
    id: "news-l2-2",
    gameId: "lineage-2",
    gameName: "Lineage 2 Exilium World",
    title: "Novidades no Site: Skills na Wiki e Melhorias no Suporte de IA",
    snippet: "A plataforma oficial do Exilium World ganhou busca de habilidades na Wiki com tabelas de enchant, requisitos de classes e assistente de IA para dúvidas.",
    content: "A Wiki oficial do Exilium World ganhou uma nova aba exclusiva de Skills! Agora você pode pesquisar qualquer habilidade do jogo e consultar suas descrições completas, níveis, propriedades mágicas ou físicas, classes que as aprendem e opções de enchant com os valores numéricos exatos. O portal também implementou otimizações substanciais no suporte ao jogador com inteligência artificial para sanar dúvidas instantaneamente.",
    category: "Wiki & Suporte",
    date: "16/09/2026",
    readTime: "Exilium World",
    imageUrl: "https://i.postimg.cc/Mp63Thzt/lineage-2.png",
    badgeColor: "rose",
    officialUrl: "https://www.exiliumworld.com/news/280?lang=pt_BR",
    officialLabel: "Ver Novidades da Wiki"
  },
  {
    id: "news-l2-3",
    gameId: "lineage-2",
    gameName: "Lineage 2 Exilium World",
    title: "Faris - 14/09/2026: Ajustes na Olympiad e Movimentação WASD",
    snippet: "Pontos iniciais da Olympiad aumentados para 15, proporcionalidade de tokens e desativação do WASD para aperfeiçoar o geodata em combates.",
    content: "Notas de manutenção e calibragem do servidor Faris: os pontos iniciais de entrada na Grand Olympiad foram aumentados de 10 para 15. As recompensas em Olympiad Tokens ao final do ciclo foram ajustadas para acompanhar a duração reduzida semanal. Além disso, a movimentação pelas teclas WASD foi desabilitada para eliminar falhas de geodata e garantir combates PvP limpos.",
    category: "Patch Notes",
    date: "14/09/2026",
    readTime: "Exilium World",
    imageUrl: "https://i.postimg.cc/Mp63Thzt/lineage-2.png",
    badgeColor: "rose",
    officialUrl: "https://www.exiliumworld.com/news/279?lang=pt_BR",
    officialLabel: "Ver Notas da Olympiad"
  },
  {
    id: "news-l2-4",
    gameId: "lineage-2",
    gameName: "Lineage 2 Exilium World",
    title: "Faris - 12/09/2026: Oito Novas Capas Lendárias e Habilidades Ocultas",
    snippet: "Chegada de 8 novas capas exclusivas (Dawn Sovereign, Dragonlord, Hellfire e outras) com bônus de HP/MP, defesa PvP e skills secretas de classe.",
    content: "Grande expansão de equipamentos no servidor Faris com o lançamento de oito novas capas: Dawn Sovereign’s Cloak, Dragonlord’s Cloak, Dreadknight’s Cloak, Ivory Crown Cloak, Hellfire Cloak e outras. Cada capa concede regeneração de HP (+9), MP (+0.6), defesa PvP (+1.2%), capacidade de carga (+36.000) e 8 slots de inventário. Exigem 50.000 de Fame e, ao alcançar 100.000 de Fame, desbloqueiam uma habilidade oculta exclusiva da classe.",
    category: "Equipamentos",
    date: "12/09/2026",
    readTime: "Exilium World",
    imageUrl: "https://i.postimg.cc/Mp63Thzt/lineage-2.png",
    badgeColor: "rose",
    officialUrl: "https://www.exiliumworld.com/news/278?lang=pt_BR",
    officialLabel: "Ver Coleção de Capas"
  },
  {
    id: "news-l2-5",
    gameId: "lineage-2",
    gameName: "Lineage 2 Exilium World",
    title: "Faris - 07/09/2026: Ciclo Semanal da Olympiad e Coroação dos Heroes",
    snippet: "As Grand Olympiads passam a ter ciclos semanais com entregas de Heroes toda segunda-feira às 08h, acelerando a disputa do servidor.",
    content: "Reestruturação das Grand Olympiads no servidor Faris: a competição passa a funcionar em ciclos dinâmicos semanais (de segunda a domingo), com a coroação e renovação semanal dos Heroes ocorrendo pontualmente toda segunda-feira às 08:00h da manhã.",
    category: "Olympiad",
    date: "07/09/2026",
    readTime: "Exilium World",
    imageUrl: "https://i.postimg.cc/Mp63Thzt/lineage-2.png",
    badgeColor: "rose",
    officialUrl: "https://www.exiliumworld.com/news/275?lang=pt_BR",
    officialLabel: "Ver Regras da Olympiad"
  },
  {
    id: "news-l2-6",
    gameId: "lineage-2",
    gameName: "Lineage 2 Exilium World",
    title: "Novo Marketplace de Personagens e Pagamentos com Binance Pay",
    snippet: "Marketplace totalmente renovado com segurança aprimorada, interface limpa de negociação e suporte a pagamentos via Binance Pay.",
    content: "O Marketplace de personagens do Exilium World foi completamente reformulado: agora os jogadores contam com mais opções para recebimento de vendas, novos métodos de pagamento incluindo suporte a criptoativos via Binance Pay e interface moderna para acompanhamento de anúncios e compras.",
    category: "Economia",
    date: "04/09/2026",
    readTime: "Exilium World",
    imageUrl: "https://i.postimg.cc/Mp63Thzt/lineage-2.png",
    badgeColor: "rose",
    officialUrl: "https://www.exiliumworld.com/news/274?lang=pt_BR",
    officialLabel: "Ver Notícia Oficial"
  }
];

export const initialVideos: VideoItem[] = [
  {
    id: "video-1",
    gameId: "albion-online",
    gameName: "Albion Online",
    title: "COMO FAZER 10 MILHÕES DE PRATA POR DIA EM ALBION ONLINE (SEM RISCO!)",
    duration: "18:42",
    views: "24.5K visualizações",
    date: "Há 3 dias",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    category: "Guia"
  },
  {
    id: "video-2",
    gameId: "lineage-2",
    gameName: "Lineage 2",
    title: "O CERCO DE GIRAN MAIS INSANO DA HISTÓRIA! (Lineage 2 PvP Massivo)",
    duration: "24:15",
    views: "19.8K visualizações",
    date: "Há 1 semana",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop",
    category: "PvP"
  },
  {
    id: "video-3",
    gameId: "lineage-2",
    gameName: "Lineage 2",
    title: "GUIA COMPLETO DE SUB-CLASSES & CERTIFICAÇÕES (Lineage 2 Passo a Passo)",
    duration: "19:30",
    views: "27.4K visualizações",
    date: "Há 2 semanas",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    category: "Guia"
  },
  {
    id: "video-4",
    gameId: "albion-online",
    gameName: "Albion Online",
    title: "SOLO GANK NA ZONA NEGRA: 3 HORAS DE CAÇADA E MILHÕES EM LOOT!",
    duration: "21:05",
    views: "16.4K visualizações",
    date: "Há 3 semanas",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    category: "Gameplay"
  }
];

export const initialSocials: SocialMedia[] = [
  {
    id: "social-youtube",
    name: "YouTube",
    username: "@JhotaGamerOficial",
    url: "https://www.youtube.com/@JhotaGamerOficial",
    platform: "youtube",
    icon: "Youtube",
    themeColor: "from-red-600 to-rose-700",
    description: "Canal principal com guias completos, vídeos de análise de meta, gravações de guerras de guildas e tutoriais passo a passo.",
    followers: "45.8K Inscritos",
    ctaText: "Inscrever-se no Canal",
    featured: true
  },
  {
    id: "social-discord",
    name: "Discord",
    username: "discord.gg/Uq9pnCwDkq",
    url: "https://discord.gg/Uq9pnCwDkq",
    platform: "discord",
    icon: "MessageSquare",
    themeColor: "from-indigo-600 to-blue-700",
    description: "Nossa comunidade oficial para trocar ideias, recrutar membros para a guilda, tirar dúvidas de builds e jogar em grupo.",
    followers: "8.400 Membros Ativos",
    ctaText: "Entrar no Servidor",
    featured: true
  },
  {
    id: "social-twitch",
    name: "Twitch",
    username: "twitch.tv/jhotagamer",
    url: "https://twitch.tv",
    platform: "twitch",
    icon: "Tv",
    themeColor: "from-purple-600 to-violet-800",
    description: "Transmissões ao vivo semanais com gameplay sem cortes, drop de recompensas e interação direta pelo chat.",
    followers: "12.3K Seguidores",
    ctaText: "Acompanhar Lives"
  },
  {
    id: "social-instagram",
    name: "Instagram",
    username: "@jhotagameroficial",
    url: "https://www.instagram.com/jhotagameroficial/",
    platform: "instagram",
    icon: "Instagram",
    themeColor: "from-pink-600 via-rose-600 to-amber-500",
    description: "Bastidores das gravações, novidades rápidas em stories, enquetes de novos vídeos e avisos de lançamentos.",
    followers: "1.8K Seguidores",
    ctaText: "Seguir no Instagram"
  },
  {
    id: "social-facebook",
    name: "Facebook",
    username: "facebook.com/profile.php?id=61594432231685",
    url: "https://www.facebook.com/profile.php?id=61594432231685",
    platform: "facebook",
    icon: "Facebook",
    themeColor: "from-blue-600 to-blue-800",
    description: "Página oficial para compartilhamento de artigos, avisos à comunidade e grupos de discussão sobre MMORPG.",
    followers: "1.2K Seguidores",
    ctaText: "Curtir Página"
  }
];

export const initialUsefulLinks: UsefulLink[] = [
  {
    id: "link-albion-official",
    title: "Albion Online — Site Oficial & Download",
    description: "Portal oficial da Sandbox Interactive para download do jogo, registro de conta e notícias do servidor.",
    url: "https://albiononline.com",
    category: "sites_oficiais",
    gameRelated: "Albion Online",
    isOfficial: true,
    tags: ["Oficial", "Download", "Albion"]
  },
  {
    id: "link-albion-2d",
    title: "Albion 2D Database & Calculadora de Crafting",
    description: "Banco de dados completo de itens, cálculo de custo de refino, taxas de retorno e simulações de mercado.",
    url: "https://albiononline2d.com",
    category: "ferramentas",
    gameRelated: "Albion Online",
    tags: ["Database", "Calculadora", "Crafting"]
  },
  {
    id: "link-albion-murderledger",
    title: "MurderLedger — Ranking & Meta de 1v1 Corrupted",
    description: "Estatísticas em tempo real das builds mais fortes em masmorras corrompidas, taxas de vitória e histórico de abates.",
    url: "https://murderledger.com",
    category: "ferramentas",
    gameRelated: "Albion Online",
    tags: ["Meta", "1v1", "PvP", "Corrupted"]
  },
  {
    id: "link-exilium-official",
    title: "Servidor Exilium World — Site Oficial & Download",
    description: "Portal oficial do servidor Exilium World High Five x100. Registro de contas, download do cliente completo, launcher oficial, status dos servidores e eventos.",
    url: "https://www.exiliumworld.com/",
    category: "sites_oficiais",
    gameRelated: "Lineage 2 Exilium World",
    isOfficial: true,
    tags: ["Exilium World", "Oficial", "Download", "High Five", "Lineage 2"]
  },
  {
    id: "link-exilium-forum",
    title: "Fórum Oficial Exilium World — Guias, Classes & Economia",
    description: "Fórum oficial da comunidade Exilium World com guias avançados de classes High Five, discussões de Olympiad, Sieges e recrutamento de clãs.",
    url: "https://forum.exiliumworld.com",
    category: "comunidades",
    gameRelated: "Lineage 2 Exilium World",
    isOfficial: true,
    tags: ["Fórum", "Guias", "Comunidade", "Exilium World"]
  },
  {
    id: "link-exilium-panel",
    title: "Exilium World — Painel de Controle, Serviços & VIP",
    description: "Painel do jogador para gerenciamento de personagens, histórico de doações, status de VIP, serviços de conta e mercado in-game do Exilium World.",
    url: "https://www.exiliumworld.com/account",
    category: "ferramentas",
    gameRelated: "Lineage 2 Exilium World",
    isOfficial: true,
    tags: ["Painel", "Conta", "Serviços", "VIP", "Exilium World"]
  },
  {
    id: "link-exilium-rankings",
    title: "Exilium World — Rankings, Top PvP/PK & Heróis da Olympiad",
    description: "Classificação em tempo real do servidor Exilium World: líderes de PvP, contagem de PKs, castelos conquistados e heróis ativos da Grand Olympiad.",
    url: "https://www.exiliumworld.com/rankings",
    category: "ferramentas",
    gameRelated: "Lineage 2 Exilium World",
    isOfficial: true,
    tags: ["Rankings", "PvP", "Olympiad", "Heróis", "Exilium World"]
  },
  {
    id: "link-exilium-news",
    title: "Exilium World — Notícias & Atualizações do Servidor",
    description: "Histórico de correções, notas de manutenções semanais, eventos sazonais e cronograma de Sieges do servidor Exilium World.",
    url: "https://www.exiliumworld.com/news",
    category: "sites_oficiais",
    gameRelated: "Lineage 2 Exilium World",
    isOfficial: true,
    tags: ["Notícias", "Patch Notes", "Exilium World", "Manutenção"]
  },
  {
    id: "link-exilium-database",
    title: "Database High Five (Exilium World) — Drops, Spoil & Quests",
    description: "Base de dados completa da crônica High Five usada no Exilium World para consulta de drops de raid bosses (Antharas, Valakas), spoilers de monstros e receitas de craft.",
    url: "https://lineage.pmfun.com",
    category: "wikis_databases",
    gameRelated: "Lineage 2 Exilium World",
    tags: ["Database", "High Five", "Exilium World", "Drops", "Spoil"]
  },
  {
    id: "link-discord-guild",
    title: "Discord da Guilda Jhota Gamer",
    description: "Comunidade principal para jogar em grupo, call para Albion ZvZ, parties de farm e Sieges no L2.",
    url: "https://discord.gg/Uq9pnCwDkq",
    category: "comunidades",
    tags: ["Guilda", "Voz", "Comunidade", "Eventos"]
  }
];
