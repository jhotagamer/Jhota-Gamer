import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Hammer, RefreshCw, Search } from 'lucide-react';
import { MARKET_LOCATIONS, getCityDisplayName } from '../../data/albionPopularItems';
import { AlbionMarketPrice, AlbionServer } from '../../types/albionMarket';
import { fetchMarketPrices, getItemIconUrl, SERVER_LABELS } from '../../services/albionMarketApi';
import { calculateCraftProfit, cityCraftReturnRate, CraftRecipe } from '../../services/albionCraftCalculator';

const number = (value: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value);
const money = (value: number) => `${number(value)} prata`;
const inputClass = 'w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm text-white outline-none focus:border-amber-400';
const labelClass = 'block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2';
const categoryNames: Record<string, string> = { weapons: 'Armas', head: 'Capacetes', armors: 'Armaduras', shoes: 'Botas', offhands: 'Mão secundária', capes: 'Capas', bags: 'Bolsas' };

function materialName(id: string): string {
  const level = /_LEVEL([1-4])$/.exec(id);
  const base = id.replace(/_LEVEL[1-4]$/, '');
  const names: Record<string, string> = { METALBAR: 'Barra de metal', LEATHER: 'Couro', PLANKS: 'Tábua', CLOTH: 'Tecido', STONEBLOCK: 'Bloco de pedra' };
  const match = /^T(\d+)_(.*)$/.exec(base);
  if (match && names[match[2]]) return `${names[match[2]]} T${match[1]}${level ? `.${level[1]}` : ''}`;
  return id.replace(/_/g, ' ');
}

type PriceEntry = { value: string; date?: string; source?: string };

export const CraftCalculator: React.FC = () => {
  const [recipes, setRecipes] = useState<CraftRecipe[]>([]);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [tier, setTier] = useState('Todos');
  const [selectedId, setSelectedId] = useState('T4_BAG');
  const [alternativeIndex, setAlternativeIndex] = useState(0);
  const [server, setServer] = useState<AlbionServer>('americas');
  const [craftCity, setCraftCity] = useState('Bridgewatch');
  const [sellCity, setSellCity] = useState('Bridgewatch');
  const [saleMode, setSaleMode] = useState<'listing' | 'instant'>('listing');
  const [quality, setQuality] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [premium, setPremium] = useState(false);
  const [useFocus, setUseFocus] = useState(false);
  const [dailyBonus, setDailyBonus] = useState(0);
  const [manualReturn, setManualReturn] = useState(false);
  const [returnNoFocus, setReturnNoFocus] = useState('15.3');
  const [returnWithFocus, setReturnWithFocus] = useState('43.5');
  const [stationCost, setStationCost] = useState('0');
  const [saleTax, setSaleTax] = useState('8');
  const [orderFee, setOrderFee] = useState('2.5');
  const [focusCost, setFocusCost] = useState('');
  const [prices, setPrices] = useState<Record<string, PriceEntry>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState('');
  const request = useRef(0);

  useEffect(() => {
    fetch('/data/albion_craft_recipes.json')
      .then(async response => { if (!response.ok) throw new Error('Não foi possível carregar as receitas de craft.'); return response.json() as Promise<CraftRecipe[]>; })
      .then(setRecipes).catch(error => setLoadError(String(error)));
  }, []);

  const recipe = useMemo(() => recipes.find(item => item.id === selectedId), [recipes, selectedId]);
  const alternative = recipe?.alternatives[alternativeIndex] ?? recipe?.alternatives[0];
  const hasCityBonus = !!recipe?.bonusCity && recipe.bonusCity === craftCity;
  const calculatedNoFocus = cityCraftReturnRate(recipe?.bonusCity ?? null, craftCity, false, dailyBonus);
  const calculatedWithFocus = cityCraftReturnRate(recipe?.bonusCity ?? null, craftCity, true, dailyBonus);
  const blackMarket = sellCity === 'Black Market';
  const isListing = !blackMarket && saleMode === 'listing';
  const shown = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR');
    return recipes.filter(item => (category === 'Todas' || item.category === category) && (tier === 'Todos' || item.tier === Number(tier)) && (!query || `${item.name} ${item.id}`.toLocaleLowerCase('pt-BR').includes(query))).slice(0, 70);
  }, [recipes, search, category, tier]);

  useEffect(() => { setSaleTax(premium ? '4' : '8'); if (!premium) setUseFocus(false); }, [premium]);
  useEffect(() => { setFocusCost(String(alternative?.baseFocus ?? '')); }, [selectedId, alternativeIndex, alternative?.baseFocus]);
  useEffect(() => {
    request.current += 1;
    setPrices({}); setPriceError(''); setLoadingPrices(false);
  }, [selectedId, alternativeIndex, server, craftCity, sellCity, saleMode, quality]);

  const updatePrice = (id: string, value: string) => setPrices(old => ({ ...old, [id]: { value, source: 'manual' } }));
  const loadPrices = async () => {
    if (!recipe || !alternative) return;
    const thisRequest = ++request.current;
    setLoadingPrices(true); setPriceError('');
    try {
      const rows = await fetchMarketPrices([...alternative.materials.map(material => material.id), recipe.id], server, [craftCity, sellCity], [1, quality], true);
      if (thisRequest !== request.current) return;
      const result: Record<string, PriceEntry> = {};
      const pick = (id: string, city: string, itemQuality: number): AlbionMarketPrice | undefined => rows.find(row => row.item_id.toLowerCase() === id.toLowerCase() && row.city.toLowerCase() === city.toLowerCase() && row.quality === itemQuality);
      alternative.materials.forEach(material => {
        const row = pick(material.id, craftCity, 1);
        result[material.id] = row?.sell_price_min > 0 ? { value: String(row.sell_price_min), date: row.sell_price_min_date, source: 'API' } : { value: '' };
      });
      const output = pick(recipe.id, sellCity, quality);
      const value = isListing ? output?.sell_price_min : output?.buy_price_max;
      const date = isListing ? output?.sell_price_min_date : output?.buy_price_max_date;
      result.output = value && value > 0 ? { value: String(value), date, source: 'API' } : { value: '' };
      setPrices(result);
    } catch (error) {
      if (thisRequest === request.current) setPriceError(error instanceof Error ? error.message : 'Falha ao consultar preços.');
    } finally { if (thisRequest === request.current) setLoadingPrices(false); }
  };

  const numeric = (value: string) => Number(value.replace(',', '.'));
  const materialPrices = Object.fromEntries((alternative?.materials ?? []).map(material => [material.id, numeric(prices[material.id]?.value ?? '')]));
  const missing = (alternative?.materials ?? []).filter(material => !(materialPrices[material.id] > 0));
  const returnRate = manualReturn
    ? numeric(useFocus && premium ? returnWithFocus : returnNoFocus)
    : (useFocus && premium ? calculatedWithFocus : calculatedNoFocus);
  const invalidInputs = !Number.isInteger(quantity) || quantity < 1 || quantity > 10000 || !Number.isFinite(returnRate) || returnRate < 0 || returnRate >= 100 || !Number.isFinite(numeric(stationCost)) || numeric(stationCost) < 0 || !Number.isFinite(numeric(saleTax)) || numeric(saleTax) < 0 || numeric(saleTax) > 100 || !Number.isFinite(numeric(orderFee)) || numeric(orderFee) < 0 || numeric(orderFee) > 100;
  const calculation = alternative && missing.length === 0 && numeric(prices.output?.value ?? '') > 0 && !invalidInputs
    ? calculateCraftProfit({ recipe: alternative, quantity, materialPrices, outputPrice: numeric(prices.output.value), returnRate, stationCost: numeric(stationCost), saleTax: numeric(saleTax), orderFee: isListing ? numeric(orderFee) : 0 }) : null;

  return <div className="space-y-8 animate-fadeIn">
    <div className="flex items-center gap-3"><Hammer className="h-7 w-7 text-amber-400" /><div><h3 className="font-cinzel text-2xl font-bold text-white">Calculadora de craft</h3><p className="text-sm text-zinc-400">Receitas do jogo, preços consultados por cidade e lucro líquido estimado.</p></div></div>
    {loadError && <p className="text-rose-400">{loadError}</p>}
    <div className="grid gap-7 xl:grid-cols-[1.2fr_1fr]">
      <div className="space-y-6">
        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
          <h4 className="font-bold text-amber-400">1. Escolha o item</h4>
          <div className="relative"><Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" /><input aria-label="Pesquisar item para craft" className={`${inputClass} pl-10`} value={search} onChange={event => setSearch(event.target.value)} placeholder="Ex.: bolsa, espada, armadura..." /></div>
          <div className="grid grid-cols-2 gap-3"><label><span className={labelClass}>Categoria</span><select className={inputClass} value={category} onChange={event => setCategory(event.target.value)}><option>Todas</option>{Object.entries(categoryNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label><label><span className={labelClass}>Tier</span><select className={inputClass} value={tier} onChange={event => setTier(event.target.value)}><option>Todos</option>{[4, 5, 6, 7, 8].map(t => <option key={t} value={String(t)}>T{t}</option>)}</select></label></div>
          {(search || category !== 'Todas' || tier !== 'Todos') && <div className="max-h-52 overflow-auto rounded-xl border border-zinc-800">{shown.length ? shown.map(item => <button key={item.id} type="button" className="flex w-full items-center gap-3 border-b border-zinc-800 p-2 text-left text-sm text-zinc-300 hover:bg-zinc-800" onClick={() => { setSelectedId(item.id); setAlternativeIndex(0); setSearch(''); }}><img src={getItemIconUrl(item.id)} alt="" className="h-9 w-9" loading="lazy" />{item.name} <span className="ml-auto text-zinc-500">T{item.tier}</span></button>) : <p className="p-3 text-sm text-zinc-400">Nenhuma receita encontrada.</p>}</div>}
          {recipe && <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3"><img src={getItemIconUrl(recipe.id)} alt="" className="h-14 w-14" /><div><strong className="text-white">{recipe.name}</strong><div className="text-xs text-zinc-400">{categoryNames[recipe.category] ?? recipe.category} · T{recipe.tier} · {recipe.id}</div></div></div>}
          {recipe && recipe.alternatives.length > 1 && <label><span className={labelClass}>Receita alternativa</span><select className={inputClass} value={alternativeIndex} onChange={event => setAlternativeIndex(Number(event.target.value))}>{recipe.alternatives.map((option, index) => <option key={index} value={index}>Opção {index + 1}: {option.materials.map(material => `${material.count}× ${materialName(material.id)}`).join(' + ')}</option>)}</select></label>}
        </section>
        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5"><h4 className="font-bold text-amber-400">2. Mercado e fabricação</h4>
          <div className="grid grid-cols-2 gap-3"><label><span className={labelClass}>Servidor</span><select className={inputClass} value={server} onChange={event => setServer(event.target.value as AlbionServer)}>{Object.entries(SERVER_LABELS).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label><label><span className={labelClass}>Quantidade de crafts</span><input className={inputClass} type="number" min="1" max="10000" value={quantity} onChange={event => setQuantity(Number(event.target.value))} /></label><label><span className={labelClass}>Cidade de compra e craft</span><select className={inputClass} value={craftCity} onChange={event => setCraftCity(event.target.value)}>{MARKET_LOCATIONS[server].filter(city => city !== 'Black Market').map(city => <option key={city}>{city}</option>)}</select></label><label><span className={labelClass}>Cidade de venda</span><select className={inputClass} value={sellCity} onChange={event => setSellCity(event.target.value)}>{MARKET_LOCATIONS[server].map(city => <option key={city} value={city}>{getCityDisplayName(city)}</option>)}</select></label><label><span className={labelClass}>Como vender</span><select className={inputClass} value={blackMarket ? 'instant' : saleMode} disabled={blackMarket} onChange={event => setSaleMode(event.target.value as 'listing' | 'instant')}><option value="listing">Criar ordem de venda</option><option value="instant">Vender à ordem de compra</option></select></label><label><span className={labelClass}>Qualidade de venda</span><select className={inputClass} value={quality} onChange={event => setQuality(Number(event.target.value))}>{['Normal', 'Boa', 'Excepcional', 'Excelente', 'Obra-prima'].map((name, index) => <option key={index} value={index + 1}>{name}</option>)}</select></label></div>
          {blackMarket && <p className="text-xs text-amber-300">O Mercado Negro compra por ordens de compra. Consulte também o valor e a disponibilidade no jogo.</p>}
          <button type="button" disabled={!alternative || loadingPrices} onClick={loadPrices} className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loadingPrices ? 'animate-spin' : ''}`} />{loadingPrices ? 'Consultando...' : 'Consultar preços atuais'}</button>
          {priceError && <p role="alert" className="text-sm text-rose-400">{priceError} Você pode preencher os preços manualmente.</p>}
        </section>
        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5"><h4 className="font-bold text-amber-400">3. Preços por unidade (prata)</h4>
          {alternative?.materials.map(material => <label key={material.id} className="flex items-center gap-3"><img src={getItemIconUrl(material.id)} alt="" className="h-11 w-11 shrink-0" loading="lazy" /><span className="min-w-0 flex-1"><span className="block text-sm text-zinc-200">{material.count}× {materialName(material.id)}</span><span className="block truncate text-xs text-zinc-500">{material.returnable ? 'Material com retorno' : 'Artefato ou ingrediente sem retorno'} · {material.id}</span>{prices[material.id]?.source === 'API' && <span className="text-xs text-zinc-500">Último registro: {prices[material.id]?.date?.replace('T', ' ').slice(0, 16)} UTC</span>}</span><input aria-label={`Preço de ${materialName(material.id)}`} className={`${inputClass} !w-32`} type="number" min="0" value={prices[material.id]?.value ?? ''} placeholder="Sem preço" onChange={event => updatePrice(material.id, event.target.value)} /></label>)}
          {recipe && <label className="flex items-center gap-3 border-t border-zinc-800 pt-4"><img src={getItemIconUrl(recipe.id, 0, quality)} alt="" className="h-11 w-11" /><span className="flex-1 text-sm text-zinc-200">Venda: {recipe.name}{alternative && alternative.outputCount > 1 ? ` (${alternative.outputCount} por craft)` : ''}{prices.output?.source === 'API' && <span className="block text-xs text-zinc-500">Último registro: {prices.output.date?.replace('T', ' ').slice(0, 16)} UTC</span>}</span><input aria-label="Preço de venda por unidade" className={`${inputClass} !w-32`} type="number" min="0" value={prices.output?.value ?? ''} placeholder="Sem preço" onChange={event => updatePrice('output', event.target.value)} /></label>}
          <p className="text-xs text-zinc-500">Compra dos materiais pelo menor anúncio de venda; venda pelo menor anúncio (ordem) ou pela maior ordem de compra (instantânea). Dados enviados por jogadores à Albion Online Data Project: preço ausente ou antigo exige conferência.</p>
        </section>
      </div>
      <div className="space-y-6"><section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5"><h4 className="font-bold text-amber-400">4. Bônus, foco e taxas</h4>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-200"><label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={premium} onChange={event => setPremium(event.target.checked)} /> Premium</label><label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={useFocus} disabled={!premium} onChange={event => setUseFocus(event.target.checked)} /> Usar foco (requer Premium)</label></div>
        {recipe && <div className={`rounded-xl border p-3 text-sm ${hasCityBonus ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200' : 'border-zinc-700 bg-zinc-900 text-zinc-300'}`}>
          {recipe.bonusCity ? <>Bônus específico de <strong>{recipe.name}</strong>: <strong>{recipe.bonusCity}</strong>. {hasCityBonus ? 'Aplicado nesta cidade (+15 pontos de bônus de produção).' : `Em ${craftCity}, este item recebe apenas o bônus base da cidade.`}</> : 'Bônus específico deste item não cadastrado; confira a janela de craft antes de usar esta estimativa.'}
        </div>}
        <label><span className={labelClass}>Bônus diário de produção do item</span>
          <select className={inputClass} value={dailyBonus} disabled={manualReturn} onChange={event => setDailyBonus(Number(event.target.value))}>
            <option value={0}>Sem bônus diário (+0%)</option><option value={10}>Bônus do dia (+10%)</option><option value={20}>Bônus do dia (+20%)</option>
          </select>
        </label>
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200">
          <span className="block text-xs text-zinc-400">Retorno {manualReturn ? 'informado por você' : 'calculado para a cidade e o item'}</span>
          <strong className="text-lg text-amber-400">{number(returnRate)}%</strong> {useFocus && premium ? 'com foco' : 'sem foco'}
          {!manualReturn && <span className="block text-xs text-zinc-400">Sem foco: {number(calculatedNoFocus)}% · Com foco: {number(calculatedWithFocus)}%</span>}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={manualReturn} onChange={event => {
            if (event.target.checked) {
              setReturnNoFocus(calculatedNoFocus.toFixed(1));
              setReturnWithFocus(calculatedWithFocus.toFixed(1));
            }
            setManualReturn(event.target.checked);
          }} /> Informar o retorno exato exibido no jogo
        </label>
        <div className="grid grid-cols-2 gap-3">
          {manualReturn && <><label><span className={labelClass}>Retorno sem foco (%)</span><input className={inputClass} type="number" min="0" max="99" step="0.1" value={returnNoFocus} onChange={event => setReturnNoFocus(event.target.value)} /></label><label><span className={labelClass}>Retorno com foco (%)</span><input className={inputClass} type="number" min="0" max="99" step="0.1" value={returnWithFocus} onChange={event => setReturnWithFocus(event.target.value)} /></label></>}
          <label><span className={labelClass}>Estação por craft (prata)</span><input className={inputClass} type="number" min="0" value={stationCost} onChange={event => setStationCost(event.target.value)} /></label><label><span className={labelClass}>Taxa de venda (%)</span><input className={inputClass} type="number" min="0" max="100" step="0.1" value={saleTax} onChange={event => setSaleTax(event.target.value)} /></label>
          {isListing && <label><span className={labelClass}>Taxa para anunciar (%)</span><input className={inputClass} type="number" min="0" max="100" step="0.1" value={orderFee} onChange={event => setOrderFee(event.target.value)} /></label>}
          {useFocus && <label><span className={labelClass}>Foco por craft</span><input className={inputClass} type="number" min="0" value={focusCost} onChange={event => setFocusCost(event.target.value)} /></label>}
        </div>
        <p className="text-xs text-zinc-400">Base estimada para estações nas cidades: 18% de bônus de produção (15,3% de retorno), +15% para o item na cidade especializada, +59% com foco. O bônus diário precisa ser selecionado por você. A taxa de retorno não é a soma desses percentuais: o jogo a converte pela fórmula bônus ÷ (100 + bônus). Confirme o valor na estação; ilhas e esconderijos seguem regras diferentes. Especialização reduz o custo de foco, não aumenta o retorno. Informe o custo da estação e as taxas reais.</p>
      </section><section className="space-y-3 rounded-2xl border border-amber-500/30 bg-zinc-950 p-5"><h4 className="font-bold text-amber-400">Resultado do lote</h4>
        {invalidInputs && <p className="text-sm text-rose-400">Revise quantidade, retorno e taxas. Aceitamos até 10.000 crafts e retorno menor que 100%.</p>}
        {!calculation ? <p className="text-sm text-zinc-400">{!alternative ? 'Carregando receitas...' : 'Informe o preço de venda e de todos os materiais para ver o lucro. Preços ausentes não são considerados zero.'}</p> : <>
          {[['Venda bruta', calculation.revenue], ['Compra dos materiais', -calculation.materialsGross], ['Retorno estimado dos materiais', calculation.returnedMaterials], ['Custo da estação e receita', -calculation.stationCosts], ['Taxas de mercado', -calculation.salesCosts]].map(([title, amount]) => <div key={title as string} className="flex justify-between gap-3 text-sm"><span className="text-zinc-400">{title}</span><span className="text-right font-mono text-zinc-100">{money(amount as number)}</span></div>)}
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-zinc-700 pt-4"><strong className="text-white">Lucro líquido estimado</strong><strong className={`text-xl ${calculation.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{money(calculation.profit)}</strong></div>
          <div className="text-sm text-zinc-400">Por item: {money(calculation.perItem)} · Margem: {number(calculation.margin)}%</div>
          {useFocus && <div className="text-sm text-zinc-400">Foco estimado: {number(numeric(focusCost) * quantity)}{numeric(focusCost) > 0 && <span> · {money(calculation.profit / (numeric(focusCost) * quantity))} por foco</span>}</div>}
        </>}
        <p className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">Estimativa: receita vendida integralmente no preço informado; recursos retornados avaliados pelo preço de compra. Não inclui transporte, risco, variação de preço nem chance de sair a qualidade selecionada. Verifique o retorno e as taxas na estação antes de investir.</p>
      </section></div>
    </div>
  </div>;
};
