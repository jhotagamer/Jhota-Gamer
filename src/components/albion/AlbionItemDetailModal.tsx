import React, { useState, useMemo } from 'react';
import { 
  AlbionItem, 
  AlbionServer, 
  AlbionMarketPrice 
} from '../../types/albionMarket';
import { 
  getItemIconUrl, 
  formatSilver, 
  formatRelativeDate, 
  formatFullDate, 
  calculatePriceDifferences,
  isValidMarketDate,
  SERVER_LABELS 
} from '../../services/albionMarketApi';
import { 
  MARKET_LOCATIONS, 
  getCityDisplayName, 
  isBlackMarket 
} from '../../data/albionPopularItems';
import { AlbionPriceHistoryChart } from './AlbionPriceHistoryChart';
import { 
  X, 
  Star, 
  ExternalLink, 
  ArrowUpDown, 
  TrendingUp, 
  Building2, 
  Clock, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

interface AlbionItemDetailModalProps {
  item: AlbionItem;
  enchantment: number;
  quality: number;
  server: AlbionServer;
  selectedCity: string;
  prices: AlbionMarketPrice[];
  isFavorite: boolean;
  onToggleFavorite: (itemId: string) => void;
  onClose: () => void;
}

export const AlbionItemDetailModal: React.FC<AlbionItemDetailModalProps> = ({
  item,
  enchantment,
  quality,
  server,
  selectedCity,
  prices,
  isFavorite,
  onToggleFavorite,
  onClose
}) => {
  const [sortBy, setSortBy] = useState<'sell_asc' | 'sell_desc' | 'buy_desc' | 'city'>('sell_asc');

  const targetId = enchantment > 0 && !item.id.includes('@') ? `${item.id}@${enchantment}` : item.id;

  // Filter raw prices for this specific item
  const rawItemPrices = useMemo(() => {
    return prices.filter(p => p.item_id === targetId || p.item_id === item.id);
  }, [prices, item, targetId]);

  // Build full matrix for ALL configured cities in this server
  // Ensures cities without prices are ALWAYS shown with "—" rather than hidden
  const allCityPrices = useMemo(() => {
    const serverLocations = MARKET_LOCATIONS[server] || MARKET_LOCATIONS.americas;

    return serverLocations.map(city => {
      const match = rawItemPrices.find(p => p.city.toLowerCase() === city.toLowerCase());
      const sellPrice = (match && match.sell_price_min > 0) ? match.sell_price_min : null;
      const buyPrice = (match && match.buy_price_max > 0) ? match.buy_price_max : null;
      const sellDate = (sellPrice !== null && isValidMarketDate(match?.sell_price_min_date)) 
        ? match!.sell_price_min_date 
        : null;
      const buyDate = (buyPrice !== null && isValidMarketDate(match?.buy_price_max_date)) 
        ? match!.buy_price_max_date 
        : null;

      return {
        city,
        displayName: getCityDisplayName(city),
        isBlackMarket: isBlackMarket(city),
        sellPrice,
        buyPrice,
        sellDate,
        buyDate,
        hasData: sellPrice !== null || buyPrice !== null
      };
    });
  }, [rawItemPrices, server]);

  // Compute price differences (highest, lowest, diff)
  const diffSummary = useMemo(() => {
    return calculatePriceDifferences(rawItemPrices);
  }, [rawItemPrices]);

  // Sort city rows (nulls always sorted to the end)
  const sortedPrices = useMemo(() => {
    const list = [...allCityPrices];
    list.sort((a, b) => {
      if (sortBy === 'sell_asc') {
        if (a.sellPrice === null && b.sellPrice === null) return 0;
        if (a.sellPrice === null) return 1;
        if (b.sellPrice === null) return -1;
        return a.sellPrice - b.sellPrice;
      }
      if (sortBy === 'sell_desc') {
        if (a.sellPrice === null && b.sellPrice === null) return 0;
        if (a.sellPrice === null) return 1;
        if (b.sellPrice === null) return -1;
        return b.sellPrice - a.sellPrice;
      }
      if (sortBy === 'buy_desc') {
        if (a.buyPrice === null && b.buyPrice === null) return 0;
        if (a.buyPrice === null) return 1;
        if (b.buyPrice === null) return -1;
        return b.buyPrice - a.buyPrice;
      }
      return a.displayName.localeCompare(b.displayName);
    });
    return list;
  }, [allCityPrices, sortBy]);

  const iconUrl = getItemIconUrl(item.id, enchantment, quality);

  // Determine top featured city for the summary card
  const highlightCity = allCityPrices.find(p => p.city === selectedCity) || 
                        allCityPrices.find(p => p.city === 'Caerleon') || 
                        allCityPrices[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800/80 bg-zinc-900/50 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 flex items-center justify-center p-1.5 shadow-inner shrink-0">
              <img 
                src={iconUrl} 
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback without enchantment if render fails
                  (e.target as HTMLImageElement).src = `https://render.albiononline.com/v1/item/${item.id}.png`;
                }}
              />
              {enchantment > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-zinc-950 shadow-md">
                  .{enchantment}
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Tier {item.tier}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-800 text-zinc-300">
                  {item.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-black/50 border border-zinc-800">
                  {targetId}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white leading-tight">
                {item.name}
              </h2>
              {item.nameEn && item.nameEn !== item.name && (
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  Inglês: {item.nameEn}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(targetId)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isFavorite
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
              title={isFavorite ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">
                {isFavorite ? '★ Favorito' : '☆ Favoritar'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Top Row: Mini Item Card & Price Differences Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Quick Card */}
            <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/90 p-4 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Building2 className={`w-3.5 h-3.5 ${highlightCity?.isBlackMarket ? 'text-purple-400' : 'text-amber-400'}`} />
                    <span>{highlightCity?.displayName || 'Albion Market'}</span>
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {SERVER_LABELS[server]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3">
                  <div className="bg-zinc-950/80 rounded-xl p-2.5 border border-zinc-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                      Menor Venda
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-white font-mono">
                      {formatSilver(highlightCity?.sellPrice)}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Prata</span>
                  </div>

                  <div className="bg-zinc-950/80 rounded-xl p-2.5 border border-zinc-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                      Maior Compra
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-white font-mono">
                      {formatSilver(highlightCity?.buyPrice)}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Prata</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{formatRelativeDate(highlightCity?.sellDate || highlightCity?.buyDate)}</span>
                </span>
                <span className="text-zinc-500 text-[10px]">
                  Qualidade {quality > 1 ? quality : 'Normal'}
                </span>
              </div>
            </div>

            {/* Price Difference Stats (Diferença de Preço) */}
            <div className="md:col-span-2 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Diferença de Preço Entre Cidades</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500">
                    Dados ao vivo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Venda diff */}
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60">
                    <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Mercado de Venda (Ofertas)
                    </span>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Maior Venda:</span>
                        <span className="font-mono text-zinc-200 font-bold">
                          {formatSilver(diffSummary.highestSell?.price)} 
                          <span className="text-[10px] text-zinc-400 font-normal ml-1">({diffSummary.highestSell?.city || '—'})</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Menor Venda:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {formatSilver(diffSummary.lowestSell?.price)} 
                          <span className="text-[10px] text-zinc-400 font-normal ml-1">({diffSummary.lowestSell?.city || '—'})</span>
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-zinc-800/60 text-amber-300">
                        <span>Diferença:</span>
                        <span className="font-mono font-bold">
                          {diffSummary.sellDiff > 0 ? `${formatSilver(diffSummary.sellDiff)} Prata` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compra diff */}
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60">
                    <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Ordens de Compra (Demandas)
                    </span>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Maior Compra:</span>
                        <span className="font-mono text-amber-300 font-bold">
                          {formatSilver(diffSummary.highestBuy?.price)} 
                          <span className="text-[10px] text-zinc-400 font-normal ml-1">({diffSummary.highestBuy?.city || '—'})</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Menor Compra:</span>
                        <span className="font-mono text-zinc-200 font-bold">
                          {formatSilver(diffSummary.lowestBuy?.price)} 
                          <span className="text-[10px] text-zinc-400 font-normal ml-1">({diffSummary.lowestBuy?.city || '—'})</span>
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-zinc-800/60 text-cyan-300">
                        <span>Diferença:</span>
                        <span className="font-mono font-bold">
                          {diffSummary.buyDiff > 0 ? `${formatSilver(diffSummary.buyDiff)} Prata` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1 italic">
                <Info className="w-3 h-3 text-zinc-500 shrink-0" />
                <span>Os valores refletem os registros de mercado brutos e não deduzem taxas ou custos de transporte.</span>
              </div>
            </div>
          </div>

          {/* Section: Comparação de Cidades Table */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/90">
              <div>
                <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Comparação Entre Cidades</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Valores obtidos através do Albion Online Data Project
                </p>
              </div>

              {/* Sort controls */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400 font-medium">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="sell_asc">Menor Preço de Venda</option>
                  <option value="sell_desc">Maior Preço de Venda</option>
                  <option value="buy_desc">Maior Ordem de Compra</option>
                  <option value="city">Nome da Cidade</option>
                </select>
              </div>
            </div>

            {/* City Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/70 text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-rajdhani">
                    <th className="py-3 px-4">Cidade / Local</th>
                    <th className="py-3 px-4 text-right">Menor Venda</th>
                    <th className="py-3 px-4 text-right">Maior Compra</th>
                    <th className="py-3 px-4 text-right">Atualização Venda</th>
                    <th className="py-3 px-4 text-right">Atualização Compra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-xs">
                  {sortedPrices.length > 0 ? (
                    sortedPrices.map((p, idx) => (
                      <tr 
                        key={idx}
                        className={`hover:bg-zinc-800/40 transition-colors ${
                          p.isBlackMarket ? 'bg-purple-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              p.isBlackMarket 
                                ? 'bg-purple-400' 
                                : p.hasData 
                                  ? 'bg-amber-400/80' 
                                  : 'bg-zinc-600'
                            }`} />
                            <span className="font-semibold text-white">{p.displayName}</span>
                            {p.isBlackMarket && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-950/80 border border-purple-700/60 text-purple-300">
                                Especial
                              </span>
                            )}
                          </div>
                        </td>

                        <td className={`py-3 px-4 text-right font-mono font-bold ${
                          p.sellPrice ? 'text-emerald-400' : 'text-zinc-500'
                        }`}>
                          {p.sellPrice ? formatSilver(p.sellPrice) : '—'}
                        </td>

                        <td className={`py-3 px-4 text-right font-mono font-bold ${
                          p.buyPrice ? 'text-amber-300' : 'text-zinc-500'
                        }`}>
                          {p.buyPrice ? formatSilver(p.buyPrice) : '—'}
                        </td>

                        <td className="py-3 px-4 text-right text-zinc-400 font-mono text-[11px]" title={p.sellDate ? formatFullDate(p.sellDate) : ''}>
                          {p.sellDate ? formatRelativeDate(p.sellDate) : <span className="text-zinc-600">Sem dados</span>}
                        </td>

                        <td className="py-3 px-4 text-right text-zinc-400 font-mono text-[11px]" title={p.buyDate ? formatFullDate(p.buyDate) : ''}>
                          {p.buyDate ? formatRelativeDate(p.buyDate) : <span className="text-zinc-600">Sem dados</span>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-zinc-500 text-xs">
                        Nenhum registro de preço retornado para este item no momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price History Chart Section */}
          <AlbionPriceHistoryChart 
            itemId={targetId}
            server={server}
            selectedCity={selectedCity}
          />

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/70 flex items-center justify-between text-xs text-zinc-400">
          <span>Servidor: <strong className="text-amber-300">{SERVER_LABELS[server]}</strong></span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
