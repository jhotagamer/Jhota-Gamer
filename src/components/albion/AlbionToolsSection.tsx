import React, { useState, useMemo } from 'react';
import { Calculator, Recycle, ArrowRightLeft, CheckCircle } from 'lucide-react';
import { formatSilver } from '../../services/albionMarketApi';
import { 
  MATERIAL_NAMES, 
  CITY_SPECIALIZATIONS, 
  TIER_RATIOS 
} from '../../data/albionData';

export const AlbionToolsSection: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'flip' | 'refine'>('flip');

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-zinc-950 shadow-md flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" /> SIMULAÇÃO DE CUSTOS
              </span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
              FERRAMENTAS de <span className="text-amber-400">ECONOMIA</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl">
              Estimativas de refino e transporte conforme os valores informados. Confira os preços e as taxas no jogo antes de negociar.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {[
          { id: 'flip', label: 'Calculadora de Transporte', icon: ArrowRightLeft, color: 'text-cyan-400' },
          { id: 'refine', label: 'Calculadora de Refino', icon: Recycle, color: 'text-emerald-400' },
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as 'flip' | 'refine')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                activeTool === tool.id ? 'bg-amber-500 text-zinc-950 shadow-lg scale-105' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTool === tool.id ? 'text-zinc-950' : tool.color}`} />
              {tool.label}
            </button>
          );
        })}
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {activeTool === 'flip' && <FlipCalculator />}
        {activeTool === 'refine' && <RefineCalculator />}
      </div>
    </div>
  );
};

// --- 1. CALCULADORA DE TRANSPORTE (FLIP / TRANSPORTE ENTRE CIDADES) ---
const FlipCalculator: React.FC = () => {
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [hasPremium, setHasPremium] = useState(false);

  const tax = hasPremium ? 0.04 : 0.08; 
  const totalInvestment = buyPrice * qty;
  const totalRevenue = (sellPrice * qty) * (1 - tax);
  const netProfit = totalRevenue - totalInvestment;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400"><ArrowRightLeft className="w-6 h-6" /></div>
        <h3 className="font-cinzel text-2xl font-bold text-white">Calculadora de Transporte</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Nome do Item</label>
            <input 
              type="text" 
              value={itemName}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" 
              placeholder="Ex: Bolsa T8" 
              onChange={(e) => setItemName(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Quantidade</label>
              <input 
                type="number" 
                value={qty || ''}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" 
                placeholder="1" 
                onChange={(e) => setQty(Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Preço Unit. Compra (Origem)</label>
              <input 
                type="number" 
                value={buyPrice || ''}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" 
                placeholder="0" 
                onChange={(e) => setBuyPrice(Number(e.target.value))} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Preço Unit. Venda (Destino)</label>
            <input 
              type="number" 
              value={sellPrice || ''}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" 
              placeholder="0" 
              onChange={(e) => setSellPrice(Number(e.target.value))} 
            />
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="hidden" checked={hasPremium} onChange={() => setHasPremium(!hasPremium)} />
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${hasPremium ? 'bg-amber-500 border-amber-500' : 'border-zinc-600 group-hover:border-amber-500'}`}>
                {hasPremium && <CheckCircle className="w-3 h-3 text-zinc-950" />}
              </div>
              <span className="text-sm text-zinc-400 group-hover:text-white">Tenho Premium (Taxa 4%)</span>
            </label>
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Investimento Total:</span>
            <span className="font-mono text-white">{formatSilver(totalInvestment)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Receita Bruta:</span>
            <span className="font-mono text-white">{formatSilver(sellPrice * qty)}</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-zinc-800 pt-4">
            <span className="text-zinc-400">Taxa de Mercado ({(tax * 100).toFixed(0)}%):</span>
            <span className="font-mono text-rose-400">-{formatSilver((sellPrice * qty) * tax)}</span>
          </div>
          <p className="text-xs text-zinc-400">Considera compra e taxa de venda exibida. Não inclui taxas de criação de ordens, transporte, reparos ou perdas de carga. A venda pelo preço informado não é garantida.</p>
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
            <span className="font-bold text-cyan-400">Resultado estimado:</span>
            <span className={`font-mono text-2xl font-black ${netProfit > 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
              {formatSilver(netProfit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. CALCULADORA DE REFINO (MATEMÁTICA RIGOROSA E NOMES ATUALIZADOS) ---
const RefineCalculator: React.FC = () => {
  const [materialType, setMaterialType] = useState('Madeira');
  const [tier, setTier] = useState(4);
  const [rawQty, setRawQty] = useState(0);
  const [refinedPrevQty, setRefinedPrevQty] = useState(0);
  const [buyPriceRaw, setBuyPriceRaw] = useState(0);
  const [buyPricePrev, setBuyPricePrev] = useState(0);
  const [sellPriceRefined, setSellPriceRefined] = useState(0);
  const [city, setCity] = useState('Outros');
  const [hasFocus, setHasFocus] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);

  const rrr = useMemo(() => {
    const citySpec = CITY_SPECIALIZATIONS[city];
    if (citySpec === materialType) {
      return hasFocus ? 0.539 : 0.367;
    }
    return 0.15;
  }, [city, materialType, hasFocus]);

  const ratio = TIER_RATIOS[tier] || 2;
  const baseProduction = rawQty / ratio;
  const finalOutput = baseProduction / (1 - rrr);
  const totalCost = (rawQty * buyPriceRaw) + (baseProduction * buyPricePrev);
  const sellTax = hasPremium ? 0.04 : 0.08;
  const totalRevenue = (finalOutput * sellPriceRefined) * (1 - sellTax);
  const profit = totalRevenue - totalCost;

  const names = MATERIAL_NAMES[materialType] || { raw: 'Bruto', refined: 'Refinado' };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Recycle className="w-6 h-6" /></div>
        <h3 className="font-cinzel text-2xl font-bold text-white">Estimativa de Refino</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Material</label>
              <select 
                value={materialType}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm focus:border-emerald-500 outline-none cursor-pointer text-white" 
                onChange={(e) => setMaterialType(e.target.value)}
              >
                {Object.keys(MATERIAL_NAMES).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Tier Alvo</label>
              <select 
                value={tier}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm focus:border-emerald-500 outline-none cursor-pointer text-white" 
                onChange={(e) => setTier(Number(e.target.value))}
              >
                {[3, 4, 5, 6, 7, 8].map(t => <option key={t} value={t}>T{t}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Cidade de Refino</label>
            <select 
              value={city}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm focus:border-emerald-500 outline-none cursor-pointer text-white" 
              onChange={(e) => setCity(e.target.value)}
            >
              {Object.keys(CITY_SPECIALIZATIONS).map(c => <option key={c} value={c}>{c} (Bônus {CITY_SPECIALIZATIONS[c]})</option>)}
              <option value="Outros">Outros / Sem Bônus</option>
            </select>
          </div>

          <div className="space-y-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Quant. {names.raw} T{tier}:</span>
              <input 
                type="number" 
                className="w-32 bg-zinc-900 border border-zinc-800 rounded-lg py-1 px-2 text-right text-sm text-white outline-none" 
                placeholder="0" 
                value={rawQty || ''}
                onChange={(e) => setRawQty(Number(e.target.value))} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Quant. {names.refined} T{tier - 1}:</span>
              <input 
                type="number" 
                className="w-32 bg-zinc-900 border border-zinc-800 rounded-lg py-1 px-2 text-right text-sm text-white outline-none" 
                placeholder="0" 
                value={refinedPrevQty || ''}
                onChange={(e) => setRefinedPrevQty(Number(e.target.value))} 
              />
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="hidden" checked={hasFocus} onChange={() => setHasFocus(!hasFocus)} />
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${hasFocus ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                {hasFocus && <CheckCircle className="w-3 h-3 text-zinc-950" />}
              </div>
              <span className="text-sm text-zinc-400">Usar Foco</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="hidden" checked={hasPremium} onChange={() => setHasPremium(!hasPremium)} />
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${hasPremium ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                {hasPremium && <CheckCircle className="w-3 h-3 text-zinc-950" />}
              </div>
              <span className="text-sm text-zinc-400">Premium</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Custo Bruto (Un.)</label>
              <input 
                type="number" 
                value={buyPriceRaw || ''}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm text-white focus:border-emerald-500 outline-none" 
                placeholder="0" 
                onChange={(e) => setBuyPriceRaw(Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Custo Refinado T{tier - 1} (Un.)</label>
              <input 
                type="number" 
                value={buyPricePrev || ''}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm text-white focus:border-emerald-500 outline-none" 
                placeholder="0" 
                onChange={(e) => setBuyPricePrev(Number(e.target.value))} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Venda Refinado T{tier} (Un.)</label>
            <input 
              type="number" 
              value={sellPriceRefined || ''}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-sm text-white focus:border-emerald-500 outline-none" 
              placeholder="0" 
              onChange={(e) => setSellPriceRefined(Number(e.target.value))} 
            />
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Taxa de Retorno (RRR):</span>
            <span className="font-mono text-emerald-400 font-bold">{Math.round(rrr * 100)}%</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-zinc-800 pt-4">
            <span className="text-zinc-400">Produção Final Estimada:</span>
            <span className="font-mono text-white font-bold">{Math.floor(finalOutput)} unidades</span>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
            <span className="font-bold text-white text-lg">Resultado estimado:</span>
            <span className={`font-mono text-2xl font-black ${profit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatSilver(profit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
