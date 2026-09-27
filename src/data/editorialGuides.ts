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
  }
];
