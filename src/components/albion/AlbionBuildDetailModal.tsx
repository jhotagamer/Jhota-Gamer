import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Star, 
  TrendingUp, 
  Coins, 
  ShieldAlert, 
  Crosshair, 
  Award, 
  RefreshCw, 
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';
import { ArsenalBuild, ResolvedSlotItem, BuildMarketCostResult } from '../../types/albionArsenal';
import { AlbionServer, AlbionCity } from '../../types/albionMarket';
import { resolveBuildSlots } from '../../services/albionItemCatalogService';
import { calculateBuildMarketCost } from '../../services/albionMarketIntegration';
import { ItemImage } from './ItemImage';
import { MARKET_LOCATIONS, getCityDisplayName } from '../../data/albionPopularItems';

interface AlbionBuildDetailModalProps {
  build: ArsenalBuild;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (build: ArsenalBuild) => void;
  isComparing: boolean;
  onToggleCompare: (build: ArsenalBuild) => void;
}

export const AlbionBuildDetailModal: React.FC<AlbionBuildDetailModalProps> = ({
  build,
  onClose,
  isFavorite,
  onToggleFavorite,
  isComparing,
  onToggleCompare
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number>(4);
  const [marketServer, setMarketServer] = useState<AlbionServer>('americas');
  const [marketCity, setMarketCity] = useState<AlbionCity>('Caerleon');
  const [marketResult, setMarketResult] = useState<BuildMarketCostResult | null>(null);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [marketError, setMarketError] = useState<string | null>(null);

  const resolvedSlots: ResolvedSlotItem[] = resolveBuildSlots(build.slots, selectedTier);

  const handleCopySummary = () => {
    const slotList = resolvedSlots
      .map(s => `• ${s.slotLabel}: ${s.namePt} (${s.nameEn})`)
      .join('\n');

    const text = `🏰 Albion Online Build - ${build.name}\n` +
      `⚡ IP Médio: ${build.avgIp} | Taxa de Vitória: ${(build.winrate * 100).toFixed(1)}%\n` +
      `⚔️ Kills: ${build.kills.toLocaleString()} | Mortes: ${build.deaths.toLocaleString()}\n` +
      `💰 Custo do Kit Estimado: ${build.kitValueSilver.toLocaleString()} Prata\n\n` +
      `Equipamentos recomendados:\n${slotList}\n\n` +
      `Ver análise completa no Albion Arsenal: ${build.url}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleFetchMarketCost = async () => {
    setLoadingMarket(true);
    setMarketError(null);
    try {
      const itemsToPrice = resolvedSlots.map(s => ({
        id: s.fullItemId,
        name: s.namePt
      }));
      const result = await calculateBuildMarketCost(
        itemsToPrice,
        marketServer,
        marketCity,
        1
      );
      setMarketResult(result);
    } catch (err) {
      setMarketError('Não foi possível obter os preços do mercado no momento. Tente novamente.');
      console.error(err);
    } finally {
      setLoadingMarket(false);
    }
  };

  const formatSilver = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toLocaleString();
  };

  const winratePercent = (build.winrate * 100).toFixed(1);
  const winrateColor = build.winrate >= 0.55 
    ? 'text-emerald-400' 
    : build.winrate >= 0.48 
      ? 'text-amber-400' 
      : 'text-rose-400';

  const availableCities: AlbionCity[] = [
    'Todas',
    ...((MARKET_LOCATIONS[marketServer] || MARKET_LOCATIONS.americas) as AlbionCity[])
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-zinc-800/80 bg-zinc-900/60 sticky top-0 z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                Albion Arsenal Build #{build.id}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-zinc-800 text-zinc-300">
                IP Médio: {build.avgIp}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold bg-zinc-900 border border-zinc-700 ${winrateColor}`}>
                {winratePercent}% Winrate
              </span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              {build.name}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Dados PvP oficiais consolidados · Fonte:{' '}
              <a 
                href="https://albion-arsenal.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 underline hover:text-amber-300"
              >
                Albion Arsenal
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-fav-build-modal"
              onClick={() => onToggleFavorite(build)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isFavorite 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              id="btn-compare-build-modal"
              onClick={() => onToggleCompare(build)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isComparing 
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' 
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-cyan-400'
              }`}
              title={isComparing ? 'Remover da comparação' : 'Adicionar para comparar'}
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              id="btn-close-build-modal"
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Taxa de Vitória</span>
              </div>
              <div className={`text-xl font-bold font-mono ${winrateColor}`}>
                {winratePercent}%
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                Ajustada: {(build.adjustedWinrate * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1 font-medium">
                <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                <span>Kills / Mortes</span>
              </div>
              <div className="text-xl font-bold font-mono text-zinc-100">
                {build.kills.toLocaleString()} <span className="text-zinc-500 text-xs font-normal">/</span> {build.deaths.toLocaleString()}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                K/D: {build.deaths > 0 ? (build.kills / build.deaths).toFixed(2) : build.kills}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1 font-medium">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Valor Médio do Kit</span>
              </div>
              <div className="text-xl font-bold font-mono text-amber-300">
                {formatSilver(build.kitValueSilver)}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                {build.kitValueSilver.toLocaleString()} Prata
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1 font-medium">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span>Kill Fame Total</span>
              </div>
              <div className="text-xl font-bold font-mono text-purple-300">
                {build.killFame >= 1000000 ? `${(build.killFame / 1000000).toFixed(1)}M` : build.killFame.toLocaleString()}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                Fama acumulada em abates
              </div>
            </div>
          </div>

          {/* Equipment Slots Breakdown */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="font-cinzel text-base font-bold text-white">
                  Equipamentos da Build (6 Slots)
                </h3>
              </div>

              {/* Tier switch selector for preview */}
              <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
                <span className="text-[11px] text-zinc-400 px-1">Visualizar Tier:</span>
                {[4, 5, 6, 7, 8].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTier(t)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                      selectedTier === t
                        ? 'bg-amber-500 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    T{t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {resolvedSlots.map((slot) => (
                <div
                  key={slot.slotKey}
                  className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 transition-all flex items-center gap-3"
                >
                  <ItemImage
                    itemId={slot.fullItemId}
                    tier={slot.tier}
                    size="md"
                    showTierBadge={true}
                    alt={slot.namePt}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono font-semibold text-amber-400/90 uppercase tracking-wider">
                      {slot.slotLabel}
                    </div>
                    <div className="text-xs font-bold text-zinc-100 truncate" title={slot.namePt}>
                      {slot.namePt}
                    </div>
                    <div className="text-[11px] text-zinc-400 italic truncate" title={slot.nameEn}>
                      {slot.nameEn}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                      {slot.baseCode}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real Live Market Cost Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <h4 className="font-cinzel text-sm sm:text-base font-bold text-white">
                    Orçamento em Tempo Real no Mercado
                  </h4>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Consulte os preços reais praticados nas cidades através da API do Albion Online Data Project.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={marketServer}
                  onChange={(e) => setMarketServer(e.target.value as AlbionServer)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs font-semibold text-zinc-200 focus:border-amber-400"
                >
                  <option value="americas">Americas (West)</option>
                  <option value="asia">Asia (East)</option>
                  <option value="europe">Europe</option>
                </select>

                <select
                  value={marketCity}
                  onChange={(e) => setMarketCity(e.target.value as AlbionCity)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs font-semibold text-zinc-200 focus:border-amber-400"
                >
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {getCityDisplayName(c)}
                    </option>
                  ))}
                </select>

                <button
                  id="btn-fetch-market-cost"
                  onClick={handleFetchMarketCost}
                  disabled={loadingMarket}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingMarket ? 'animate-spin' : ''}`} />
                  <span>{loadingMarket ? 'Cotando...' : 'Cotar Agora'}</span>
                </button>
              </div>
            </div>

            {marketError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {marketError}
              </div>
            )}

            {marketResult && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {marketResult.items.map((it) => (
                    <div
                      key={it.itemId}
                      className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-zinc-200 truncate">{it.name}</div>
                        <div className="text-[10px] text-zinc-500">{it.city}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {it.hasPrice && it.sellPrice !== null ? (
                          <div className="font-mono font-bold text-amber-300">
                            {it.sellPrice.toLocaleString()} <span className="text-[10px] text-zinc-400">prata</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-500 italic bg-zinc-900 px-1.5 py-0.5 rounded">
                            Preço indisponível
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-zinc-300">
                    <span>Cobertura de Preços: </span>
                    <strong className="text-amber-300">
                      {marketResult.availableItemsCount} de {marketResult.totalItemsCount} itens precificados
                    </strong>
                    {!marketResult.allPriced && (
                      <span className="text-zinc-500 ml-1">
                        (itens sem dados de venda não foram somados como zero)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-medium">Custo Parcial/Total:</span>
                    <span className="text-base sm:text-lg font-mono font-bold text-amber-400">
                      {marketResult.totalSellCost.toLocaleString()} Prata
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Combat & Playstyle Advisory */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-zinc-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dicas de Otimização & Mecânicas</span>
            </div>
            <p className="leading-relaxed">
              Esta configuração foi extraída de registros reais de combates competitivos em Albion Online. Para alcançar o IP médio reportado de <strong className="text-amber-300">{build.avgIp}</strong>, recomenda-se combinar especificações de maestria (Destiny Board) com encantamento correspondente (.1 / .2) e qualidade do equipamento Adequada ou Excepcional.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3">
          <a
            href={build.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <span>Ver no Albion Arsenal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-build-summary"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Resumo da Build</span>
                </>
              )}
            </button>

            <button
              id="btn-close-modal-footer"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
