import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  AlbionServer, 
  AlbionItem, 
  AlbionMarketPrice,
  AlbionMarketRow,
  PriceDataFilter
} from '../../types/albionMarket';
import { 
  SERVER_LABELS, 
  getItemIconUrl, 
  loadItemDatabase, 
  filterItems, 
  fetchMarketPrices, 
  buildMarketMatrix,
  formatSilver, 
  formatRelativeDate, 
  formatFullDate 
} from '../../services/albionMarketApi';
import { 
  ALBION_CATEGORIES, 
  ALBION_TIERS, 
  ALBION_ENCHANTMENTS, 
  ALBION_QUALITIES, 
  ALBION_CITIES, 
  POPULAR_ALBION_ITEMS,
  MARKET_LOCATIONS,
  getCityDisplayName,
  isBlackMarket
} from '../../data/albionPopularItems';
import { AlbionItemDetailModal } from './AlbionItemDetailModal';
import { 
  Search, 
  RefreshCw, 
  Star, 
  Globe2, 
  Building2, 
  Layers, 
  Sparkles, 
  SlidersHorizontal, 
  ExternalLink, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Database
} from 'lucide-react';

type SortField = 'item' | 'city' | 'quality' | 'sell' | 'buy' | 'update';
type SortDirection = 'asc' | 'desc';

export const AlbionMarketSection: React.FC = () => {
  // Filters state
  const [server, setServer] = useState<AlbionServer>('americas');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedTier, setSelectedTier] = useState<string>('Todos');
  const [selectedEnchantment, setSelectedEnchantment] = useState<string>('Todos');
  const [selectedQuality, setSelectedQuality] = useState<number>(0);
  const [priceDataFilter, setPriceDataFilter] = useState<PriceDataFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('item');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  // Data state
  const [itemsDatabase, setItemsDatabase] = useState<AlbionItem[]>(POPULAR_ALBION_ITEMS);
  const [prices, setPrices] = useState<AlbionMarketPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshingButtonState, setRefreshingButtonState] = useState<'idle' | 'updating' | 'updated'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jhota_albion_market_favorites');
      return saved ? JSON.parse(saved) : ['T4_BAG', 'T4_MAIN_SWORD', 'T4_CAPE'];
    } catch {
      return ['T4_BAG', 'T4_MAIN_SWORD', 'T4_CAPE'];
    }
  });

  // Dynamic timestamps & countdown
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsUntilNextRefresh, setSecondsUntilNextRefresh] = useState<number>(300); // 5 min = 300s

  // Detail Modal selection
  const [selectedItemForModal, setSelectedItemForModal] = useState<{
    item: AlbionItem;
    enchantment: number;
    quality: number;
  } | null>(null);

  // 1. Load full items metadata in background
  useEffect(() => {
    let isCancelled = false;
    loadItemDatabase().then((fullDb) => {
      if (!isCancelled && fullDb.length > 0) {
        setItemsDatabase(fullDb);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = useCallback((itemId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      try {
        localStorage.setItem('jhota_albion_market_favorites', JSON.stringify(next));
      } catch {
        // Ignore localstorage errors
      }
      return next;
    });
  }, []);

  // 2. Filter items according to search, category, tier, favorites
  const filteredBaseItems = useMemo(() => {
    let result = filterItems(itemsDatabase, searchQuery, selectedCategory, selectedTier);

    if (showOnlyFavorites) {
      result = result.filter((item) => favorites.includes(item.id));
    }

    // Keep up to 60 matching items for catalog query to prevent API overload while giving deep results
    return result.slice(0, 60);
  }, [itemsDatabase, searchQuery, selectedCategory, selectedTier, showOnlyFavorites, favorites]);

  // Determine numeric enchantment from selection
  const numericEnchantment = useMemo(() => {
    if (selectedEnchantment === '.1') return 1;
    if (selectedEnchantment === '.2') return 2;
    if (selectedEnchantment === '.3') return 3;
    if (selectedEnchantment === '.4') return 4;
    return 0; // Normal or Todos (default base)
  }, [selectedEnchantment]);

  // Active cities for matrix calculation
  const activeCities = useMemo(() => {
    if (selectedCity === 'Todas') {
      return MARKET_LOCATIONS[server] || MARKET_LOCATIONS.americas;
    }
    return [selectedCity];
  }, [selectedCity, server]);

  // Active qualities for matrix calculation
  const activeQualities = useMemo(() => {
    if (selectedQuality === 0) {
      return [1, 2, 3, 4, 5];
    }
    return [selectedQuality];
  }, [selectedQuality]);

  // 3. Fetch Prices function
  const fetchPricesForCurrentView = useCallback(async (isManualRefresh: boolean = false) => {
    if (filteredBaseItems.length === 0) {
      setPrices([]);
      return;
    }

    if (isManualRefresh) {
      setRefreshingButtonState('updating');
    }
    setLoading(true);
    setErrorMessage(null);

    // Compute item IDs to query
    const itemIdsToQuery: string[] = [];
    filteredBaseItems.forEach((it) => {
      if (numericEnchantment > 0 && !it.id.includes('@')) {
        itemIdsToQuery.push(`${it.id}@${numericEnchantment}`);
      } else {
        itemIdsToQuery.push(it.id);
      }
    });

    try {
      const locs = selectedCity !== 'Todas' ? [selectedCity] : undefined;
      const quals = selectedQuality > 0 ? [selectedQuality] : undefined;

      const data = await fetchMarketPrices(itemIdsToQuery, server, locs, quals, isManualRefresh);
      setPrices(data);
      setLastUpdated(new Date());
      setSecondsUntilNextRefresh(300); // Reset 5 min timer

      if (isManualRefresh) {
        setRefreshingButtonState('updated');
        setTimeout(() => setRefreshingButtonState('idle'), 2500);
      }
    } catch (err: any) {
      console.error('Market fetch error:', err);
      setErrorMessage('Não foi possível atualizar o mercado no momento. Verifique sua conexão ou tente novamente.');
      if (isManualRefresh) {
        setRefreshingButtonState('idle');
      }
    } finally {
      setLoading(false);
    }
  }, [filteredBaseItems, numericEnchantment, server, selectedCity, selectedQuality]);

  // Trigger price fetch when items, server, city, quality, or enchantment change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPricesForCurrentView(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchPricesForCurrentView]);

  // 4. Auto-refresh ticker (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsUntilNextRefresh((prev) => {
        if (prev <= 1) {
          fetchPricesForCurrentView(false);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchPricesForCurrentView]);

  // Format countdown mm:ss
  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 5. Build full Item x City x Quality Matrix
  // CRITICAL RULE: A combination with null/0 price NEVER disappears from the matrix!
  const matrixRows = useMemo(() => {
    return buildMarketMatrix(
      filteredBaseItems,
      activeCities,
      activeQualities,
      prices,
      numericEnchantment
    );
  }, [filteredBaseItems, activeCities, activeQualities, prices, numericEnchantment]);

  // Independent Counter Metrics
  const itemsCount = filteredBaseItems.length;
  const totalMarketRecords = matrixRows.length;
  const withPriceCount = useMemo(() => {
    return matrixRows.filter((r) => r.sellPrice !== null || r.buyPrice !== null).length;
  }, [matrixRows]);
  const withoutPriceCount = totalMarketRecords - withPriceCount;
  const coveragePercent = totalMarketRecords > 0 
    ? Math.round((withPriceCount / totalMarketRecords) * 100) 
    : 0;

  // 6. Apply Price Data Filter ("Todos", "Somente com venda", "Somente com compra", etc.)
  const filteredByPriceDataRows = useMemo(() => {
    if (priceDataFilter === 'sell_only') {
      return matrixRows.filter((r) => r.sellPrice !== null);
    }
    if (priceDataFilter === 'buy_only') {
      return matrixRows.filter((r) => r.buyPrice !== null);
    }
    if (priceDataFilter === 'any_price') {
      return matrixRows.filter((r) => r.sellPrice !== null || r.buyPrice !== null);
    }
    if (priceDataFilter === 'no_data') {
      return matrixRows.filter((r) => r.sellPrice === null && r.buyPrice === null);
    }
    return matrixRows; // 'all'
  }, [matrixRows, priceDataFilter]);

  // 7. Sort Rows (null prices always sorted to the end)
  const sortedRows = useMemo(() => {
    const list = [...filteredByPriceDataRows];
    list.sort((a, b) => {
      if (sortField === 'item') {
        const cmp = a.itemName.localeCompare(b.itemName);
        if (cmp !== 0) return sortDirection === 'asc' ? cmp : -cmp;
        if (a.city !== b.city) return a.city.localeCompare(b.city);
        return a.quality - b.quality;
      }
      if (sortField === 'city') {
        const cmp = a.city.localeCompare(b.city);
        if (cmp !== 0) return sortDirection === 'asc' ? cmp : -cmp;
        return a.quality - b.quality;
      }
      if (sortField === 'quality') {
        const cmp = a.quality - b.quality;
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (sortField === 'sell') {
        if (a.sellPrice === null && b.sellPrice === null) return 0;
        if (a.sellPrice === null) return 1;
        if (b.sellPrice === null) return -1;
        return sortDirection === 'asc' ? a.sellPrice - b.sellPrice : b.sellPrice - a.sellPrice;
      }
      if (sortField === 'buy') {
        if (a.buyPrice === null && b.buyPrice === null) return 0;
        if (a.buyPrice === null) return 1;
        if (b.buyPrice === null) return -1;
        return sortDirection === 'desc' ? b.buyPrice - a.buyPrice : a.buyPrice - b.buyPrice;
      }
      if (sortField === 'update') {
        const dateA = a.sellDate || a.buyDate;
        const dateB = b.sellDate || b.buyDate;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return sortDirection === 'desc' 
          ? new Date(dateB).getTime() - new Date(dateA).getTime() 
          : new Date(dateA).getTime() - new Date(dateB).getTime();
      }
      return 0;
    });
    return list;
  }, [filteredByPriceDataRows, sortField, sortDirection]);

  // 8. Pagination Slice
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / itemsPerPage));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRows.slice(start, start + itemsPerPage);
  }, [sortedRows, currentPage, itemsPerPage]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedTier, selectedCity, selectedQuality, selectedEnchantment, priceDataFilter, server, showOnlyFavorites]);

  // Toggle sorting helper
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // Default natural order: for buy price and update, desc is natural; for others, asc
      setSortDirection(field === 'buy' || field === 'update' ? 'desc' : 'asc');
    }
  };

  // Helper for quality badge
  const getQualityBadge = (quality: number) => {
    switch (quality) {
      case 1:
        return <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">1</span>;
      case 2:
        return <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-800/60">2</span>;
      case 3:
        return <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">3</span>;
      case 4:
        return <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60">4</span>;
      case 5:
        return <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60">5</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-zinc-800 text-zinc-400">{quality}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/20 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-zinc-950 shadow-md flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                AO Data Live
              </span>
              <span className="text-xs text-amber-300/80 font-mono">
                Servidor: {SERVER_LABELS[server]}
              </span>
            </div>

            <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
              MERCADO ALBION ONLINE
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-1 max-w-2xl font-sans">
              Consulte preços reais de itens, compare cidades e acompanhe a variação do mercado sem sair do portal Jhota Gamer.
            </p>
          </div>

          {/* Refresh Action & Status Pill */}
          <div className="flex flex-col sm:items-end gap-2.5">
            <button
              id="btn-albion-refresh-market"
              onClick={() => fetchPricesForCurrentView(true)}
              disabled={refreshingButtonState === 'updating'}
              className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${refreshingButtonState === 'updating' ? 'animate-spin' : ''}`} />
              <span>
                {refreshingButtonState === 'updating'
                  ? 'Atualizando mercado...'
                  : refreshingButtonState === 'updated'
                  ? 'Mercado atualizado!'
                  : '↻ Atualizar agora'}
              </span>
            </button>

            {/* Live Indicator & Dynamic Timers */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mercado online</span>
              <span>&bull;</span>
              <span>Atualizado: {lastUpdated.toLocaleTimeString('pt-BR')}</span>
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              Próxima atualização automática em <span className="text-amber-400 font-semibold">{formatCountdown(secondsUntilNextRefresh)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Selectors */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        
        {/* Search Input & Favorites Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar item... (Ex: bolsa, espada, T4_BAG, T6, manto, poção...)"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white bg-zinc-800 px-2 py-0.5 rounded-md cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              showOnlyFavorites
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-zinc-950/90 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{showOnlyFavorites ? 'Mostrando Favoritos' : 'Apenas Favoritos'}</span>
            {favorites.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300">
                {favorites.length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          
          {/* Servidor */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-amber-400" />
              <span>Servidor</span>
            </label>
            <select
              value={server}
              onChange={(e) => setServer(e.target.value as AlbionServer)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
            >
              <option value="americas">Americas</option>
              <option value="asia">Asia</option>
              <option value="europe">Europe</option>
            </select>
          </div>

          {/* Cidade */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-amber-400" />
              <span>Cidade</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
            >
              {ALBION_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'Black Market' ? 'Mercado Negro' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>Categoria</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
            >
              {ALBION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tier */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-amber-400" />
              <span>Tier</span>
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
            >
              {ALBION_TIERS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Encantamento */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Encantamento</span>
            </label>
            <select
              value={selectedEnchantment}
              onChange={(e) => setSelectedEnchantment(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
            >
              {ALBION_ENCHANTMENTS.map((enc) => (
                <option key={enc} value={enc}>{enc}</option>
              ))}
            </select>
          </div>

          {/* Qualidade */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
              <span>Qualidade</span>
            </label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
            >
              {ALBION_QUALITIES.map((q) => (
                <option key={q.value} value={q.value}>{q.label}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Filter "Dados de Preço" Row */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-1 mr-1">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Dados de preço:</span>
            </span>
            {(
              [
                { id: 'all', label: 'Todos' },
                { id: 'sell_only', label: 'Somente com venda' },
                { id: 'buy_only', label: 'Somente com compra' },
                { id: 'any_price', label: 'Com qualquer preço' },
                { id: 'no_data', label: 'Sem dados' },
              ] as const
            ).map((filterOpt) => (
              <button
                key={filterOpt.id}
                onClick={() => setPriceDataFilter(filterOpt.id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  priceDataFilter === filterOpt.id
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {filterOpt.label}
              </button>
            ))}
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span className="bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-lg">
              Itens: <strong className="text-white">{itemsCount}</strong>
            </span>
            <span className="bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-lg">
              Registros: <strong className="text-amber-400">{totalMarketRecords}</strong>
            </span>
            <span className="bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-lg text-emerald-400">
              Com preço: <strong className="text-emerald-300">{withPriceCount}</strong>
            </span>
            <span className="bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-lg text-zinc-400">
              Sem preço: <strong className="text-zinc-300">{withoutPriceCount}</strong>
            </span>
          </div>
        </div>

      </div>

      {/* Error State Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-between gap-4 text-xs text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => fetchPricesForCurrentView(true)}
            className="px-3 py-1.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-semibold shrink-0 cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Main Market Table Container */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Table Controls & Summary Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-rajdhani">
                CATÁLOGO DE PREÇOS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {sortedRows.length} resultados &bull; {activeCities.length} {activeCities.length === 1 ? 'cidade' : 'cidades'} &bull; {activeQualities.length} {activeQualities.length === 1 ? 'qualidade' : 'qualidades'}
              </span>
            </div>

            {/* Resumo de Cobertura */}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Dados encontrados: <strong className="text-white">{withPriceCount}</strong> / <strong className="text-white">{totalMarketRecords}</strong> combinações
                <span className="text-amber-400 font-mono font-bold ml-1.5">({coveragePercent}%)</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Items per page selector */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Exibir:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
              >
                <option value={20}>20 por pág.</option>
                <option value={50}>50 por pág.</option>
                <option value={100}>100 por pág.</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && matrixRows.length === 0 ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="animate-pulse flex items-center justify-between p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-zinc-800 rounded" />
                    <div className="h-3 w-20 bg-zinc-800/60 rounded" />
                  </div>
                </div>
                <div className="h-4 w-24 bg-zinc-800 rounded hidden sm:block" />
                <div className="h-5 w-20 bg-zinc-800 rounded" />
                <div className="h-5 w-20 bg-zinc-800 rounded" />
                <div className="h-3 w-24 bg-zinc-800/60 rounded hidden md:block" />
              </div>
            ))}
          </div>
        ) : paginatedRows.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center mx-auto text-zinc-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Nenhum registro encontrado</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Nenhuma combinação de item, cidade ou qualidade atende aos filtros atuais. Tente alterar ou limpar os filtros.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todas');
                setSelectedTier('Todos');
                setSelectedEnchantment('Todos');
                setSelectedCity('Todas');
                setSelectedQuality(0);
                setPriceDataFilter('all');
                setShowOnlyFavorites(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-amber-300 transition-colors cursor-pointer"
            >
              Limpar todos os filtros
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/80 text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-rajdhani select-none">
                    
                    {/* Item */}
                    <th 
                      onClick={() => handleSort('item')}
                      className="py-4 px-5 cursor-pointer hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>ITEM</span>
                        {sortField === 'item' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-amber-400" /> : <ArrowDown className="w-3 h-3 text-amber-400" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                        )}
                      </div>
                    </th>

                    {/* Cidade */}
                    <th 
                      onClick={() => handleSort('city')}
                      className="py-4 px-4 cursor-pointer hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>CIDADE</span>
                        {sortField === 'city' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-amber-400" /> : <ArrowDown className="w-3 h-3 text-amber-400" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                        )}
                      </div>
                    </th>

                    {/* Qualidade */}
                    <th 
                      onClick={() => handleSort('quality')}
                      className="py-4 px-3 text-center cursor-pointer hover:text-white transition-colors"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>QUALIDADE</span>
                        {sortField === 'quality' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-amber-400" /> : <ArrowDown className="w-3 h-3 text-amber-400" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                        )}
                      </div>
                    </th>

                    {/* Menor Venda */}
                    <th 
                      onClick={() => handleSort('sell')}
                      className="py-4 px-5 text-right cursor-pointer hover:text-white transition-colors"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>MENOR VENDA</span>
                        {sortField === 'sell' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-amber-400" /> : <ArrowDown className="w-3 h-3 text-amber-400" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                        )}
                      </div>
                    </th>

                    {/* Maior Compra */}
                    <th 
                      onClick={() => handleSort('buy')}
                      className="py-4 px-5 text-right cursor-pointer hover:text-white transition-colors"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>MAIOR COMPRA</span>
                        {sortField === 'buy' ? (
                          sortDirection === 'desc' ? <ArrowDown className="w-3 h-3 text-amber-400" /> : <ArrowUp className="w-3 h-3 text-amber-400" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                        )}
                      </div>
                    </th>

                    {/* Atualização */}
                    <th 
                      onClick={() => handleSort('update')}
                      className="py-4 px-5 text-right cursor-pointer hover:text-white transition-colors"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>ATUALIZAÇÃO</span>
                        {sortField === 'update' ? (
                          sortDirection === 'desc' ? <ArrowDown className="w-3 h-3 text-amber-400" /> : <ArrowUp className="w-3 h-3 text-amber-400" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                        )}
                      </div>
                    </th>

                    {/* Ações */}
                    <th className="py-4 px-4 text-center">AÇÕES</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800/60 text-xs">
                  {paginatedRows.map((row) => {
                    const iconUrl = getItemIconUrl(row.rawItem.id, row.enchantment, row.quality);
                    const isFav = favorites.includes(row.rawItem.id) || favorites.includes(row.itemId);
                    const isBlackMkt = isBlackMarket(row.city);
                    const cityDisplay = getCityDisplayName(row.city);

                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedItemForModal({
                          item: row.rawItem,
                          enchantment: row.enchantment,
                          quality: row.quality
                        })}
                        className={`hover:bg-zinc-800/40 transition-colors cursor-pointer group ${
                          isBlackMkt ? 'bg-purple-950/15' : ''
                        }`}
                      >
                        {/* ITEM COLUMN */}
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(row.rawItem.id);
                              }}
                              className="p-1 rounded-md text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer shrink-0"
                              title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                            >
                              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>

                            <div className="relative w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-1 shrink-0 group-hover:border-amber-500/50 transition-colors shadow-inner">
                              <img
                                src={iconUrl}
                                alt={row.itemName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://render.albiononline.com/v1/item/${row.rawItem.id}.png`;
                                }}
                              />
                              {row.enchantment > 0 && (
                                <span className="absolute -top-1 -right-1 px-1 rounded-full text-[9px] font-black bg-emerald-500 text-zinc-950">
                                  .{row.enchantment}
                                </span>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  T{row.tier}
                                </span>
                                <span className="text-[10px] text-zinc-500">
                                  {row.category}
                                </span>
                              </div>
                              <span className="font-semibold text-white group-hover:text-amber-300 transition-colors block leading-tight">
                                {row.itemName}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* CIDADE COLUMN */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <Building2 className={`w-3.5 h-3.5 shrink-0 ${
                              isBlackMkt ? 'text-purple-400' : 'text-amber-400/80'
                            }`} />
                            <span className={`font-medium ${
                              isBlackMkt ? 'text-purple-200 font-semibold' : 'text-zinc-300'
                            }`}>
                              {cityDisplay}
                            </span>
                            {isBlackMkt && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-900/60 border border-purple-700/50 text-purple-300">
                                Especial
                              </span>
                            )}
                          </div>
                        </td>

                        {/* QUALIDADE COLUMN */}
                        <td className="py-3 px-3 text-center">
                          {getQualityBadge(row.quality)}
                        </td>

                        {/* MENOR VENDA COLUMN */}
                        <td className={`py-3 px-5 text-right font-mono font-bold text-sm ${
                          row.sellPrice ? 'text-emerald-400' : 'text-zinc-600'
                        }`}>
                          {formatSilver(row.sellPrice)}
                        </td>

                        {/* MAIOR COMPRA COLUMN */}
                        <td className={`py-3 px-5 text-right font-mono font-bold text-sm ${
                          row.buyPrice ? 'text-amber-300' : 'text-zinc-600'
                        }`}>
                          {formatSilver(row.buyPrice)}
                        </td>

                        {/* ATUALIZAÇÃO COLUMN */}
                        <td 
                          className="py-3 px-5 text-right text-zinc-400 font-mono text-[11px]" 
                          title={row.sellDate || row.buyDate ? formatFullDate(row.sellDate || row.buyDate) : ''}
                        >
                          {row.sellDate || row.buyDate ? (
                            formatRelativeDate(row.sellDate || row.buyDate)
                          ) : (
                            <span className="text-zinc-600 font-sans">Sem dados</span>
                          )}
                        </td>

                        {/* AÇÕES COLUMN */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItemForModal({
                                item: row.rawItem,
                                enchantment: row.enchantment,
                                quality: row.quality
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 transition-all cursor-pointer"
                          >
                            <span>Detalhes</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-zinc-800/80">
              {paginatedRows.map((row) => {
                const iconUrl = getItemIconUrl(row.rawItem.id, row.enchantment, row.quality);
                const isFav = favorites.includes(row.rawItem.id) || favorites.includes(row.itemId);
                const isBlackMkt = isBlackMarket(row.city);
                const cityDisplay = getCityDisplayName(row.city);

                return (
                  <div
                    key={row.id}
                    onClick={() => setSelectedItemForModal({
                      item: row.rawItem,
                      enchantment: row.enchantment,
                      quality: row.quality
                    })}
                    className={`p-4 hover:bg-zinc-800/30 transition-colors cursor-pointer space-y-3 ${
                      isBlackMkt ? 'bg-purple-950/15' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-1 shrink-0 shadow-inner">
                          <img
                            src={iconUrl}
                            alt={row.itemName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://render.albiononline.com/v1/item/${row.rawItem.id}.png`;
                            }}
                          />
                          {row.enchantment > 0 && (
                            <span className="absolute -top-1 -right-1 px-1 rounded-full text-[9px] font-black bg-emerald-500 text-zinc-950">
                              .{row.enchantment}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              T{row.tier}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {row.category}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-white leading-tight">
                            {row.itemName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-zinc-300 flex items-center gap-1">
                              <Building2 className={`w-3 h-3 ${isBlackMkt ? 'text-purple-400' : 'text-amber-400'}`} />
                              {cityDisplay}
                            </span>
                            <span className="text-[10px] text-zinc-500">&bull;</span>
                            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                              Qualidade: {getQualityBadge(row.quality)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(row.rawItem.id);
                        }}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Prices Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-zinc-950/80 rounded-xl p-2.5 border border-zinc-800">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                          Menor Venda
                        </span>
                        <span className={`text-base font-extrabold font-mono ${
                          row.sellPrice ? 'text-white' : 'text-zinc-600'
                        }`}>
                          {formatSilver(row.sellPrice)}
                        </span>
                      </div>

                      <div className="bg-zinc-950/80 rounded-xl p-2.5 border border-zinc-800">
                        <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                          Maior Compra
                        </span>
                        <span className={`text-base font-extrabold font-mono ${
                          row.buyPrice ? 'text-white' : 'text-zinc-600'
                        }`}>
                          {formatSilver(row.buyPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {row.sellDate || row.buyDate ? (
                          formatRelativeDate(row.sellDate || row.buyDate)
                        ) : (
                          <span className="text-zinc-600">Sem dados</span>
                        )}
                      </span>
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <span>Ver detalhes</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-zinc-400 font-mono">
                  Mostrando <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> a <strong className="text-white">{Math.min(currentPage * itemsPerPage, sortedRows.length)}</strong> de <strong className="text-amber-400">{sortedRows.length}</strong> combinações
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                      let pageNum = idx + 1;
                      if (totalPages > 5 && currentPage > 3) {
                        pageNum = currentPage - 2 + idx;
                        if (pageNum > totalPages) pageNum = totalPages - (4 - idx);
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-xl font-bold font-mono text-xs transition-colors cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-amber-400 text-zinc-950 shadow'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <span>Próximo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* Attribution Footer */}
      <div className="py-4 text-center border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-500">
        <span>Dados de mercado fornecidos pelo</span>
        <a
          href="https://www.albion-online-data.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-amber-400/90 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors"
        >
          <span>Albion Online Data Project</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <span>&bull; Atualizações contínuas da comunidade Albion</span>
      </div>

      {/* Item Detail Modal */}
      {selectedItemForModal && (
        <AlbionItemDetailModal
          item={selectedItemForModal.item}
          enchantment={selectedItemForModal.enchantment}
          quality={selectedItemForModal.quality}
          server={server}
          selectedCity={selectedCity}
          prices={prices}
          isFavorite={favorites.includes(selectedItemForModal.item.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedItemForModal(null)}
        />
      )}

    </div>
  );
};
