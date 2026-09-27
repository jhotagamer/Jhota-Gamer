import type { Guide } from '../types';

// Conteúdo editorial Jhota Gamer. Valores de mercado devem ser conferidos antes de viajar.
export const editorialGuides: Guide[] = [
  {
    id: 'guia-albion-transporte-milionario',
    gameId: 'albion-online',
    gameName: 'Albion Online',
    title: 'Transporte para Caerleon: como vender no Mercado Negro e calcular o lucro',
    summary: 'Compare ordens do Mercado Negro, custos em outras cidades e risco da viagem antes de transportar equipamentos.',
    category: 'Economia',
    readTime: '8 min de leitura',
    publishedDate: '27 de setembro de 2026',
    author: 'Jhota Gamer',
    recommendedLevel: 'Iniciante em comércio',
    tags: ['Albion', 'Caerleon', 'Mercado Negro', 'Transporte', 'Prata'],
    content: {
      intro: 'Os mercados de Albion têm preços locais. Você pode encontrar equipamentos à venda em uma cidade por menos do que o Mercado Negro oferece em Caerleon. A diferença só vira lucro quando cobre taxas, tempo e o risco de atravessar zonas vermelhas. Este guia ensina a fazer a conta antes de comprar a carga.',
      highlight: 'Compare sempre o mesmo item, tier, encantamento e qualidade. Preço alto no Mercado Negro não significa lucro se a ordem comprar só uma unidade ou mudar antes da chegada.',
      sections: [
        {
          heading: 'Encontre uma oportunidade real',
          text: 'Comece pela ordem de compra do Mercado Negro em Caerleon. Anote o preço oferecido, a quantidade procurada e as características exatas do equipamento. Depois veja o menor preço de venda desse mesmo item nos mercados das cidades onde você pode comprá-lo.',
          paragraphs: [
            'Compare também a oferta disponível na cidade de origem. Uma diferença atraente para uma única unidade não deve ser multiplicada por uma carga inteira se você não conseguir comprar tudo pelo mesmo preço ou vender tudo na ordem atual.',
            'As cotações mudam enquanto você viaja. Confira novamente as ordens antes de sair e comece com poucos itens para medir o resultado real.'
          ],
          bulletPoints: [
            'Mesma qualidade, tier e encantamento nos dois lados da comparação.',
            'Quantidade disponível na origem e quantidade que o Mercado Negro aceita.',
            'Receita líquida após taxas, comparada ao custo total e ao tempo de viagem.'
          ]
        },
        {
          heading: 'Calcule o lucro líquido antes de carregar',
          text: 'Lucro estimado = receita que você espera receber após taxas − custo da compra − demais despesas da viagem. Divida pelo tempo gasto para comparar rotas. Anote quanto realmente recebeu após vender: a estimativa serve para decidir, não promete resultado.',
          paragraphs: [
            'Exemplo hipotético: 20 itens comprados a 10.000 pratas custam 200.000. Se os 20 forem vendidos por 13.000, a receita bruta será 260.000. Supondo 15.000 em taxas e 5.000 em outros custos, o lucro estimado é 40.000 pratas. Esses valores apenas demonstram a conta; não são cotações do jogo.',
            'Uma venda demorada ou uma viagem perdida pode consumir o ganho de várias operações. Use a calculadora de transporte do site e confira os preços no servidor em que você joga.'
          ],
          tipBox: 'Faça uma viagem pequena primeiro. Só aumente a carga depois de ver preço de venda, volume e tempo para concluir a operação.',
        },
        {
          heading: 'Invasão dos Bandidos e trajeto sem bandeira',
          text: 'Alguns transportadores escolhem a Invasão dos Bandidos para viajar perto de Caerleon porque há mais jogadores circulando pelas zonas vermelhas. É possível seguir a movimentação sem usar bandeira de facção e sem participar das batalhas. Observe mapa, portais e direção do grupo antes de avançar.',
          paragraphs: [
            'Estar próximo de uma facção não torna o transportador sem bandeira protegido. Os grupos podem se dividir, a passagem pode congestionar e jogadores hostis podem esperar a caravana. Caerleon passou a participar do evento em uma atualização de 2026; confira o funcionamento atual dentro do jogo.',
            'Se a rota estiver perigosa, adie a viagem. Leve uma carga que você consegue repor, mantenha uma alternativa de saída e não confie em uma montaria como garantia contra ganks.'
          ],
          bulletPoints: ['Viaje sem bandeira de facção se seu objetivo é apenas transportar.', 'Observe o número de jogadores hostis e a movimentação nas entradas dos mapas.', 'Considere quanto uma perda apagaria dos lucros anteriores.']
        }
      ],
      conclusion: 'Caerleon pode oferecer margens interessantes até para quem está começando no comércio, desde que a comparação seja feita item por item e o risco da rota entre na conta. Comece com pouca prata, registre os resultados e aumente a operação aos poucos.',
      checklist: ['Preço e quantidade da ordem de compra conferidos', 'Mesmo item, qualidade, tier e encantamento na origem', 'Custos, taxas e risco incluídos na conta', 'Rota e valor máximo que posso perder definidos'],
      relatedTool: { label: 'Abrir calculadora de transporte', path: '/jogo/albion-online/calculadoras/transporte' },
      sources: [
        { label: 'Guia oficial de Caerleon e Mercado Negro', url: 'https://albiononline.com/news/guide-caerleon' },
        { label: 'Mudanças de facções de fevereiro de 2026', url: 'https://forum.albiononline.com/index.php/Thread/220739-23-February-2026-Realm-Divided-Part-II/' }
      ]
    }
  },
  {
    id: 'guia-albion-gestao-ilha',
    gameId: 'albion-online',
    gameName: 'Albion Online',
    title: 'Gestão de ilha em Albion: foco, montarias T4 e trabalhadores',
    summary: 'Quando usar foco em plantações e criação, como comparar cavalo e gamo T4 e avaliar casas com trabalhadores T8.',
    category: 'Economia',
    readTime: '9 min de leitura',
    publishedDate: '27 de setembro de 2026',
    author: 'Jhota Gamer',
    recommendedLevel: 'Ilha pessoal',
    tags: ['Albion', 'Ilha', 'Premium', 'Foco', 'Trabalhadores'],
    content: {
      intro: 'Uma ilha pode produzir recursos regularmente, mas sementes, filhotes, comida, diários e construções custam prata. Para começar, evite montar uma grande produção agrícola sem Premium e sem foco contando com lucro. Essa é uma regra prática de gestão, não uma proibição: preços específicos podem permitir lucro sem foco.',
      highlight: 'Calcule cada lote e cada casa. Acompanhar custos e retornos por alguns ciclos vale mais do que supor que toda produção da ilha dá lucro.',
      sections: [
        {
          heading: 'Plantações e hortas com foco',
          text: 'Confira os bônus agrícolas associados à cidade da ilha. Comece por um produto que você consiga colher, usar ou vender com frequência. Anote custo das sementes, quantidade colhida, preço efetivo e taxas.',
          paragraphs: ['Use foco onde a economia de sementes ou o retorno extra justifiquem os pontos gastos. Compare o ganho por ponto de foco com outras atividades do personagem. Sem Premium e sem foco, teste a operação em pequena escala antes de investir em muitos lotes.'],
          bulletPoints: ['Custo dos insumos e quantidade produzida por lote.', 'Receita após taxas e resultado de vender ou processar a colheita.', 'Lucro adicional obtido para cada ponto de foco usado.']
        },
        {
          heading: 'Cavalo T4: venda da montaria e retorno de potros',
          text: 'Compare preço do potro, alimento, tempo e custo para selar com o valor recebido pelo cavalo pronto. Ao cuidar do animal com foco, há chance de receber outro filhote: isso pode reduzir a necessidade de comprar novos potros.',
          paragraphs: ['A chance não garante um potro em cada criação. Registre vários ciclos para conhecer o retorno médio. Quando houver estoque suficiente para manter a produção, compare se vale vender potros excedentes ou criar e selar mais montarias.']
        },
        {
          heading: 'Gamo T4: duas vendas e ordens de compra',
          text: 'Para o gamo ou cervo T4, acompanhe separadamente o preço do filhote e da montaria selada. Se os preços sustentarem a estratégia, venda montarias e filhotes por ordens de venda e tente recomprar filhotes por ordens de compra abaixo dos anúncios.',
          paragraphs: ['Uma ordem abaixo do preço anunciado pode demorar para ser atendida. Inclua taxas, alimento e custo de selar antes de decidir entre vender o filhote ou a montaria. O gamo T4 e o alce são animais diferentes.']
        },
        {
          heading: 'Trabalhadores T8 sem gastar foco',
          text: 'Casas com trabalhadores são outra forma de usar os terrenos. Você fornece diários preenchidos e recolhe recursos de acordo com a profissão, o tier do diário e a produtividade. A rotina não consome foco, mas exige uma casa adequada, móveis, troféus e investimento alto para desenvolver os trabalhadores.',
          paragraphs: [
            'Comece com uma casa e confira a felicidade dos trabalhadores na interface. Um trabalhador T8 não assegura retorno máximo com qualquer diário, mobília ou tier da casa.',
            'Lucro diário estimado = valor esperado dos recursos recebidos − custo dos diários − taxas e outros gastos. Divida o investimento inicial pelo lucro líquido médio diário para estimar o prazo de recuperação. Trata-se de uma renda recorrente com manutenção diária: alguém ainda precisa entregar diários e recolher os itens.'
          ],
          tipBox: 'Compre ou preencha os diários pelo preço que cabe na conta. Uma casa T8 cara pode demorar a se pagar quando a margem diária está pequena.'
        }
      ],
      conclusion: 'O melhor uso da ilha depende de mercado, foco disponível, tempo e investimento inicial. Comece pequeno, anote resultados reais e só amplie a produção após comparar margem e trabalho diário.',
      checklist: ['Custo de semente ou filhote registrado', 'Preço líquido da montaria ou colheita conferido', 'Foco e bônus local considerados', 'Para trabalhadores, diário e prazo de retorno calculados'],
      sources: [
        { label: 'Guia oficial de agricultura e criação', url: 'https://albiononline.com/news/guide-farming' },
        { label: 'Guia oficial de montarias', url: 'https://albiononline.com/news/guide-mounts' },
        { label: 'Guia oficial de trabalhadores', url: 'https://albiononline.com/news/laborers-in-albion-online-a-guide' }
      ]
    }
  },
  {
    id: 'guia-albion-estradas-avalon',
    gameId: 'albion-online',
    gameName: 'Albion Online',
    title: 'Estradas de Avalon: guia de exploração para iniciantes',
    summary: 'Planeje entrada, coleta, baús e volta pelas conexões dinâmicas das Estradas de Avalon.',
    category: 'Iniciante',
    readTime: '6 min de leitura',
    publishedDate: '27 de setembro de 2026',
    author: 'Jhota Gamer',
    recommendedLevel: 'Exploradores iniciantes',
    tags: ['Albion', 'Avalon', 'PvP', 'Coleta', 'Exploração'],
    content: {
      intro: 'As Estradas de Avalon ligam regiões por portais que mudam. Elas oferecem recursos, encontros PvE e trajetos alternativos, mas seguem regras de PvP com saque total. Uma expedição só dá resultado quando você consegue sair com o que coletou.',
      highlight: 'O portal de retorno pode desaparecer. Antes de avançar, confira o tempo das conexões e mantenha outra opção de saída.',
      sections: [
        {
          heading: 'Prepare uma primeira expedição curta',
          text: 'Use um conjunto que você consegue repor e deixe capacidade de carga para a volta. Defina uma meta simples: reconhecer os caminhos, coletar, fazer um acampamento ou procurar um baú adequado ao seu grupo.',
          bulletPoints: ['Anote por onde entrou e observe cada novo portal.', 'Confira o tempo restante exibido pelo jogo antes de seguir.', 'Leve apenas a carga que você aceita arriscar em PvP.']
        },
        {
          heading: 'Decida quando voltar',
          text: 'Reavalie o valor do inventário após cada objetivo. Quando o que você carrega já vale mais do que deseja arriscar, procure a saída em vez de buscar mais um baú. Evite sobrepeso, que dificulta reagir ao encontrar adversários.',
          paragraphs: ['Em grupo, combine comunicação, funções e ponto de encontro antes de entrar. Portais e destinos são dinâmicos, então não planeje a volta como se o mapa fosse permanente.']
        },
        {
          heading: 'Erros que custam uma carga',
          text: 'Entrar com equipamento caro sem plano de fuga, confiar que o mesmo portal ficará aberto, coletar até perder mobilidade e iniciar uma luta sem observar os arredores são erros comuns. A rota mais curta nem sempre é a de menor risco.',
          tipBox: 'Faça uma viagem só de reconhecimento. Aprender a ler os portais sem uma carga valiosa torna a próxima expedição mais fácil de planejar.'
        }
      ],
      conclusion: 'Explore em etapas: reconheça, escolha um objetivo, acompanhe as conexões e estabeleça seu próprio limite de risco para voltar. Com mais experiência, compare o tempo e os resultados de diferentes tipos de atividade nas Estradas.',
      checklist: ['Equipamento que consigo repor', 'Espaço na montaria reservado', 'Portais e tempo anotados', 'Valor limite para iniciar o retorno definido'],
      sources: [
        { label: 'Guia oficial das Estradas de Avalon', url: 'https://albiononline.com/news/guide-roads' },
        { label: 'Guia oficial do mundo de Albion', url: 'https://albiononline.com/news/guide-world-albion' }
      ]
    }
  },
  {
    id: 'guia-lineage2-escolha-classes',
    gameId: 'lineage-2',
    gameName: 'Lineage 2',
    title: 'Como escolher sua classe no Lineage 2: estilos e caminhos por raça',
    summary: 'Entenda a diferença entre tank, dano físico, arqueiro, mago, invocador e suporte e veja o caminho de cada raça.',
    category: 'Iniciante',
    readTime: '8 min de leitura',
    publishedDate: '27 de setembro de 2026',
    author: 'Jhota Gamer',
    recommendedLevel: 'Criação do personagem',
    tags: ['Lineage 2', 'Classes', 'Raças', 'Fighter', 'Mystic'],
    content: {
      intro: 'A primeira escolha é o estilo de combate que você quer jogar. Cada raça abre caminhos diferentes até as classes finais. Em vez de escolher por um ranking de poder, pense se prefere proteger aliados, atacar de longe, lutar de perto ou apoiar uma party. Na Árvore de Classes do site você encontra todos os 36 caminhos com filtro por raça.',
      highlight: 'As funções descritas aqui são orientações gerais. Teste habilidades dentro do jogo: mudanças de balanceamento podem alterar o desempenho de uma classe sem mudar sua árvore.',
      sections: [
        {
          heading: 'Humano: Fighter ou Mystic',
          text: 'Human Fighter pode seguir Warrior, Human Knight ou Rogue. Warrior leva a Dreadnought (polearm e vários alvos) ou Duelist (dano físico e cargas). Human Knight leva aos tanks Phoenix Knight e Hell Knight. Rogue leva ao Adventurer de adaga ou ao arqueiro Sagittarius.',
          paragraphs: ['Human Mystic abre Human Wizard, com Archmage, Soultaker e Arcana Lord, ou Cleric, com Cardinal e Hierophant. Se você quer curar a party, Cardinal é um ponto de partida para estudar; se prefere buffs, considere Hierophant.']
        },
        {
          heading: 'Elfo e Elfo Negro',
          text: 'Elven Fighter pode se tornar Eva’s Templar (tank), Sword Muse (canções de suporte), Wind Rider (adaga) ou Moonlight Sentinel (arco). Elven Mystic leva a Mystic Muse (magia), Elemental Master (invocação) ou Eva’s Saint (suporte e cura).',
          paragraphs: ['Dark Fighter oferece Shillien Templar (tank), Spectral Dancer (danças), Ghost Hunter (adaga) e Ghost Sentinel (arco). Dark Mystic segue até Storm Screamer (magia), Spectral Master (invocação) ou Shillien Saint (suporte). Os papéis podem mudar bastante com habilidades específicas e com o grupo.']
        },
        {
          heading: 'Orc, Anão e Kamael',
          text: 'Orc Fighter leva a Titan (arma pesada) ou Grand Khavatari (punhos). Orc Mystic leva a Dominator, voltado a suporte e controle de grupos, ou Doom Cryer, com chants para party. Dwarf Fighter tem Fortune Seeker, associado a spoil e recursos, e Maestro, ligado a craft e recursos próprios.',
          paragraphs: ['Entre os Kamael, a árvore apresenta Doombringer, Soul Hound masculino e feminino, Trickster e Judicator. Algumas rotas possuem requisitos próprios; confirme no jogo antes de preparar personagem ou subclasse. A árvore interativa mostra cada etapa até a profissão final.']
        },
        {
          heading: 'Escolha pelo conteúdo que você realmente joga',
          text: 'Para tank, comece pelos Knights; para adaga, examine Rogue, Scout e Assassin; para arco ou besta, veja Hawkeye, Rangers e Arbalester. Para magia, busque Wizard; para ajudar grupos, olhe Cleric, Oracle, Shaman e as classes de música.',
          paragraphs: ['Se joga sozinho, teste o quanto depende de buffs e cura externa. Se joga sempre em party, procure a função que falta ao grupo. Experimente duas opções com equipamento comparável, observe as habilidades na prática e confirme quais mecânicas se aplicam à versão em que você está jogando.']
        }
      ],
      conclusion: 'Sua primeira classe não precisa ser a mais forte de uma lista. Escolha um estilo que você goste de repetir, entenda seu papel no grupo e use a árvore para visualizar a evolução antes de investir tempo no personagem.',
      checklist: ['Estilo preferido definido', 'Caminho da raça conferido', 'Função no grupo considerada', 'Habilidades atuais testadas no jogo'],
      relatedTool: { label: 'Explorar a Árvore de Classes', path: '/jogo/lineage-2/classes' }
    }
  },
  {
    id: 'guia-lineage2-up-iniciantes-exilium',
    gameId: 'lineage-2',
    gameName: 'Lineage 2',
    title: 'Como upar no Lineage 2 Exilium: guia para iniciantes até o nível 85',
    summary: 'Escolha a jornada, equipe-se sem desperdiçar adena, use buffs e shots corretos e aproveite a ajuda da comunidade para chegar ao 85.',
    category: 'Iniciante',
    readTime: '10 min de leitura',
    publishedDate: '27 de setembro de 2026',
    author: 'Jhota Gamer',
    recommendedLevel: 'Níveis 1 a 85',
    tags: ['Lineage 2', 'Exilium', 'Up', 'Iniciantes', 'Equipamentos'],
    content: {
      intro: 'Começou agora no Exilium World e quer chegar ao nível 85 sem gastar toda a adena? Reuni aqui as escolhas que eu considero mais importantes durante o up: caminho de evolução, grades de equipamento, buffs, shots e ajuda de outros jogadores. Use o guia como roteiro e confira as opções exibidas no seu cliente, porque o servidor recebe atualizações.',
      highlight: 'Guarde adena para o que realmente melhora seu up. Você não precisa comprar um conjunto novo a cada grade: confira as recompensas da Campanha e priorize arma, armadura e joias adequadas à sua classe.',
      sections: [
        {
          heading: 'Escolha Campanha ou Jornada Livre ao criar o personagem',
          text: 'O servidor oferece dois caminhos. A Campanha foi feita para quem está começando: acompanha o personagem por quests até o nível 80, indica objetivos e áreas de caça e entrega recompensas ao longo da progressão. Nela, a experiência dos monstros é reduzida em relação à Jornada Livre; siga as missões para aproveitar essa proposta.',
          paragraphs: ['A Jornada Livre permite escolher onde caçar e mantém a experiência padrão dos monstros. É uma opção para quem já conhece os locais ou está criando outro personagem. A orientação do tutorial permanece disponível até o 85; na Campanha, a habilidade Open Journey Guide permite consultar novamente o objetivo. Como as quests passaram a entregar armas, armaduras, joias e shots, olhe suas recompensas antes de gastar adena no mercado.'],
          tipBox: 'Se você é novato, experimente a Campanha antes de sair comprando equipamentos. Se optar pela Jornada Livre, use as zonas indicadas pela GK e avalie o tempo de up em cada local.'
        },
        {
          heading: 'Troque de grade sem desperdiçar adena',
          text: 'A arma costuma ter grande impacto no tempo para derrotar monstros, mas armadura e joias também importam para sua sobrevivência. Use o quadro abaixo como referência das grades. Nas cidades, procure Weapon Shop ou Armor Shop para armas e armaduras: no Exilium, você encontra os dois NPCs juntos no mesmo lugar. Confira quais grades cada vendedor oferece antes de gastar adena; não espere encontrar todas as opções avançadas numa loja.',
          bulletPoints: [
            'Níveis 1–19: No-grade.',
            'Níveis 20–39: Grade D.',
            'Níveis 40–51: Grade C.',
            'Níveis 52–60: Grade B; é possível continuar com um bom equipamento C para economizar.',
            'Níveis 61–75: Grade A.',
            'Níveis 76–83: Grade S; ela fica disponível nesse período, mas eu não aconselho gastar adena só para comprá-la durante um up rápido. A partir do 80, alguns itens S80 também podem existir.',
            'Nível 84 em diante: Grade S84, conforme os requisitos de cada item.'
          ],
          paragraphs: ['Isso não significa comprar todos os conjuntos da lista. No Exilium, poupar adena pode ser mais valioso do que fazer uma troca temporária de B ou S. Eu priorizaria uma arma funcional, proteção suficiente para o lugar onde estou caçando e as recompensas que o próprio servidor entrega. Se o dano ou a defesa estiverem baixos, revise equipamento, shots, buffs e local de up antes de investir.'],
          gradeExamples: [
            { grade: "No-grade", levels: "Níveis 1–19", items: [{ kind: "Arma", name: "Short Sword", icon: "/images/l2-up/weapon_n.png", url: "https://l2hub.info/items/small_sword" }, { kind: "Armadura", name: "Wooden Breastplate", icon: "/images/l2-up/armor_n.png", url: "https://l2hub.info/items/wooden_breastplate" }, { kind: "Joia", name: "Necklace of Magic", icon: "/images/l2-up/jewel_n.png", url: "https://l2hub.info/items/necklace_of_magic" }] },
            { grade: "Grade D", levels: "Níveis 20–39", items: [{ kind: "Arma", name: "Elven Long Sword", icon: "/images/l2-up/weapon_d.png", url: "https://l2hub.info/items/elven_long_sword" }, { kind: "Armadura", name: "Brigandine Tunic", icon: "/images/l2-up/armor_d.png", url: "https://l2hub.info/items/brigandine" }, { kind: "Joia", name: "Elven Necklace", icon: "/images/l2-up/jewel_d.png", url: "https://l2hub.info/items/elven_necklace" }] },
            { grade: "Grade C", levels: "Níveis 40–51", items: [{ kind: "Arma", name: "Samurai Longsword", icon: "/images/l2-up/weapon_c.png", url: "https://l2hub.info/items/samurai_longsword" }, { kind: "Armadura", name: "Full Plate Armor", icon: "/images/l2-up/armor_c.png", url: "https://l2hub.info/items/full_plate_armor" }, { kind: "Joia", name: "Necklace of Binding", icon: "/images/l2-up/jewel_c.png", url: "https://l2hub.info/items/necklace_of_binding" }] },
            { grade: "Grade B", levels: "Níveis 52–60", note: "Pode pular para economizar.", items: [{ kind: "Arma", name: "Sword of Damascus", icon: "/images/l2-up/weapon_b.png", url: "https://l2hub.info/items/sword_of_damascus" }, { kind: "Armadura", name: "Blue Wolf Breastplate", icon: "/images/l2-up/armor_b.png", url: "https://l2hub.info/items/blue_wolve%27s_breastplate" }, { kind: "Joia", name: "Necklace of Black Ore", icon: "/images/l2-up/jewel_b.png", url: "https://l2hub.info/items/necklace_of_black_ore" }] },
            { grade: "Grade A", levels: "Níveis 61–75", items: [{ kind: "Arma", name: "Tallum Blade", icon: "/images/l2-up/weapon_a.png", url: "https://l2hub.info/items/tallum_blade" }, { kind: "Armadura", name: "Dark Crystal Breastplate", icon: "/images/l2-up/armor_a.png", url: "https://l2hub.info/items/dark_crystal_breastplate" }, { kind: "Joia", name: "Phoenix Necklace", icon: "/images/l2-up/jewel_a.png", url: "https://l2hub.info/items/phoenix%27s_necklace" }] },
            { grade: "Grade S", levels: "Níveis 76–83", note: "Evite gastar adena se for trocar logo.", items: [{ kind: "Arma", name: "Forgotten Blade", icon: "/images/l2-up/weapon_s.png", url: "https://l2hub.info/items/forgotten_blade" }, { kind: "Armadura", name: "Imperial Crusader Breastplate", icon: "/images/l2-up/armor_s.png", url: "https://l2hub.info/items/imperial_crusader_armor" }, { kind: "Joia", name: "Tateossian Necklace", icon: "/images/l2-up/jewel_s.png", url: "https://l2hub.info/items/dragon_necklace" }] },
            { grade: "Grade S84", levels: "Níveis 84+", note: "Confira o nível exigido em cada item.", items: [{ kind: "Arma", name: "Vesper Cutter", icon: "/images/l2-up/weapon_s84.png", url: "https://l2hub.info/items/vesper_cutter" }, { kind: "Armadura", name: "Vesper Breastplate", icon: "/images/l2-up/armor_s84.png", url: "https://l2hub.info/items/vesper_cuirass" }, { kind: "Joia", name: "Vesper Necklace", icon: "/images/l2-up/jewel_s84.png", url: "https://l2hub.info/items/vesper_necklace" }] }
          ],
          tipBox: 'A Campanha atualizada pode entregar armas de diferentes grades, conjunto Dark Crystal e, ao final, um conjunto Dynasty permanente adequado à classe. Confira o estágio das quests antes de comprar um item que você receberá logo adiante.'
        },
        {
          heading: 'Buffs e shots: os dois cuidados que mais fazem falta',
          text: 'Procure o NPC de buffs antes de sair para caçar. Escolha efeitos que combinem com sua classe: um personagem físico e um mago não aproveitam exatamente a mesma seleção. Eu ainda vou trazer um guia separado de buffs; por enquanto, revise sua configuração ao trocar de classe ou equipamento.',
          paragraphs: ['Compre Soulshots para armas físicas ou Blessed Spiritshots para magia na Grocery Shop (Grocery Store), junto com poções e outros consumíveis. Os shots devem ter a mesma grade da arma equipada; confira se estão ativados e se o estoque basta para a viagem. Para quem usa magia, priorizo Blessed Spiritshots em vez dos Spiritshots comuns. O exemplo visual abaixo usa shots de grade A: se sua arma for C, compre shots C, e assim por diante.'],
          gradeExamples: [
            { grade: 'Shots para arma de grade A', levels: 'Exemplo visual: a grade dos shots acompanha a arma, não o nível do personagem.', items: [
              { kind: 'Ataque físico', name: 'Soulshot A', icon: '/images/l2-up/soulshot.png', url: 'https://l2hub.info/items/soulshot_a' },
              { kind: 'Magia', name: 'Blessed Spiritshot A', icon: '/images/l2-up/blessed_spiritshot.png', url: 'https://l2hub.info/items/blessed_spiritshot_a' }
            ] }
          ],
          images: [
            { src: '/images/l2-up/npc-buffs.png', alt: 'NPC Magic Support Horadrim, responsável pelos buffs no Exilium', caption: 'Magic Support Horadrim: converse com o NPC de buffs antes de ir caçar e escolha os efeitos para a sua classe.', layout: 'portrait' },
            { src: '/images/l2-up/barra-buffs.png', alt: 'Exemplo visual de vários ícones de buffs ativos no Lineage 2', caption: 'Confira a barra de buffs depois de conversar com o NPC. Esta imagem mostra como os efeitos aparecem na interface.' }
          ],
          tipBox: 'Ao receber ou comprar uma arma nova, confirme a grade e ajuste seus shots antes de voltar ao local de caça.'
        },
        {
          heading: 'Use as zonas de up e acompanhe suas classes',
          text: 'A GK, ou Gatekeeper, é o NPC de teleporte. Ela oferece zonas de caça indicadas para o nível do personagem. Comece por essas opções e troque de área quando os monstros estiverem fáceis demais ou quando o equipamento não der conta. Se estiver na Campanha, siga também a quest, que pode indicar outro destino. No mapa abaixo você vê um exemplo de onde ficam a GK e as duas lojas em Heine.',
          paragraphs: ['A primeira escolha de profissão ocorre por volta do nível 20, a segunda no 40 e a terceira no 76. Observe cada escolha com atenção, pois ela define o caminho da classe. No site, a Árvore de Classes mostra todas as etapas por raça. As habilidades do personagem são aprendidas automaticamente no Exilium; ao subir de nível ou mudar de classe, abra a janela de skills para conhecer as novas opções.'],
          images: [
            { src: '/images/l2-up/mapa-lojas-heine.png', alt: 'Mapa de Heine mostrando Grocery Shop à esquerda, Weapons and Armor Shop à direita e Gatekeeper no centro', caption: 'Exemplo em Heine: Grocery Shop no alto à esquerda, Weapons & Armor Shop no alto à direita e Gatekeeper (GK) na área central. Os NPCs e a disposição variam em outras cidades.', layout: 'wide' }
          ],
          tipBox: 'Se estiver em dúvida entre tank, arqueiro, dagger, mago ou suporte, consulte a Árvore de Classes antes de fazer a transferência.'
        },
        {
          heading: 'A partir do 75, peça ajuda e participe dos eventos',
          text: 'Quando o up desacelerar, use o chat do jogo com educação para procurar party ou pedir ajuda. Muitos jogadores ajudam novatos a ganhar níveis e chegar mais rápido ao 85; quando estou disponível, também gosto de ajudar. Não entregue seus itens ou dados de conta a ninguém para receber essa ajuda.',
          paragraphs: ['Participe dos eventos quando estiver apto: além de conhecer pessoas, você aprende os sistemas do servidor. Verifique requisitos e recompensas na interface antes de entrar e volte para as zonas de caça quando o evento não fizer sentido para seu nível.']
        },
        {
          heading: 'Premium ajuda, mas não é obrigatório',
          text: 'Você consegue evoluir sem Premium. Para quem quer acelerar a rotina, ele pode acrescentar benefícios como mais EXP/SP ao caçar, Auto Play, acesso a Kamaloka e buffs extras. Kamaloka é uma instância em que você pode conseguir itens; drops não são garantidos. Confira os benefícios e preços atuais no jogo antes de decidir se vale a pena para você.',
          paragraphs: ['Não conte com o Premium como substituto de uma classe bem escolhida, bons equipamentos, shots corretos e buffs adequados. Use primeiro os recursos gratuitos e considere o Premium apenas se ele fizer sentido para sua forma de jogar.']
        },
        {
          heading: 'Dyes ficam para depois do up',
          text: 'As dyes, também chamadas de tattoos, ajustam atributos e variam conforme a classe e o objetivo do personagem. Elas não precisam ser sua prioridade no começo. Primeiro alcance seu nível, conheça as skills e monte o equipamento. Depois você poderá comparar combinações para PvE e PvP; vou preparar um guia separado sobre dyes.',
          paragraphs: ['Uma combinação boa para outra classe pode prejudicar a sua. Evite copiar qualquer fórmula sem entender o que você ganha e o que perde.']
        }
      ],
      conclusion: 'Meu conselho para chegar ao 85 é simples: escolha a jornada que combina com você, use as recompensas disponíveis, não desperdice adena em trocas passageiras, mantenha buffs e shots corretos e peça ajuda quando precisar. Assim você conhece o servidor enquanto evolui e chega melhor preparado para se equipar depois.',
      checklist: ['Jornada e classe escolhidas com atenção', 'Arma, armadura e joias adequadas ao nível', 'Buffs e shots da grade da arma ativos', 'GK ou objetivo da Campanha conferido', 'Adena reservada para etapas mais importantes'],
      relatedTool: { label: 'Ver Árvore de Classes de Lineage 2', path: '/jogo/lineage-2/classes' }
    }
  }
];
