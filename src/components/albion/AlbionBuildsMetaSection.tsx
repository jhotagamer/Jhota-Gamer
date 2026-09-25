import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Swords, 
  BarChart3, 
  Scale, 
  Star, 
  PlusCircle, 
  RefreshCw, 
  Search, 
  TrendingUp, 
  Crosshair, 
  Coins, 
  ExternalLink, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { ArsenalBuild, ArsenalRegion, ArsenalRange, ArsenalKind } from '../../types/albionArsenal';
import { fetchArsenalBuilds, fetchArsenalWeapons } from '../../services/albionArsenalApi';
import { 
  ALBION_ACTIVITY_GROUPS, 
  getActivityOption, 
  isValidActivityId, 
  getArsenalKindForActivity, 
  isBuildMatchingActivity 
} from '../../services/albionActivityClassifier';
import { AlbionBuildCard } from './AlbionBuildCard';
import { AlbionBuildDetailModal } from './AlbionBuildDetailModal';
import { AlbionMetaWeaponsView } from './AlbionMetaWeaponsView';
import { AlbionBuildCompareView } from './AlbionBuildCompareView';
import { AlbionBuildCreatorView } from './AlbionBuildCreatorView';

export type BuildsMetaSubTab = 'builds' | 'meta' | 'armas' | 'comparar' | 'favoritos' | 'criar';

type SortOption = 'fights' | 'winrate' | 'avgIp' | 'costAsc' | 'costDesc' | 'name';

const FAVORITES_KEY = 'jhota_albion_favorite_builds';

export const AlbionBuildsMetaSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<BuildsMetaSubTab>('builds');

  // Builds data & state
  const [builds, setBuilds] = useState<ArsenalBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Agora');
  const [analyzedWeaponsCount, setAnalyzedWeaponsCount] = useState<number>(0);

  // Filters
  const [region, setRegion] = useState<ArsenalRegion>('all');
  const [range, setRange] = useState<ArsenalRange>('7d');
  
  // Read initial activity from URL (?activity=...) if present
  const [activity, setActivity] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const act = params.get('activity');
      if (act && isValidActivityId(act)) {
        return act;
      }
    } catch {
      // ignore in SSR or sandbox
    }
    return 'all';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedWeaponFilter, setSelectedWeaponFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('fights');

  // Sync activity with URL query string
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (activity && activity !== 'all') {
        url.searchParams.set('activity', activity);
      } else {
        url.searchParams.delete('activity');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  }, [activity]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modals & Selections
  const [selectedBuildForModal, setSelectedBuildForModal] = useState<ArsenalBuild | null>(null);
  const [favoriteBuilds, setFavoriteBuilds] = useState<ArsenalBuild[]>([]);
  const [compareBuilds, setCompareBuilds] = useState<ArsenalBuild[]>([]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load favorites from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) {
        setFavoriteBuilds(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save favorites to local storage
  const handleToggleFavorite = useCallback((build: ArsenalBuild) => {
    setFavoriteBuilds(prev => {
      const exists = prev.some(b => b.id === build.id);
      let updated: ArsenalBuild[];
      if (exists) {
        updated = prev.filter(b => b.id !== build.id);
      } else {
        updated = [build, ...prev];
      }
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  // Compare toggling
  const handleToggleCompare = useCallback((build: ArsenalBuild) => {
    setCompareBuilds(prev => {
      const exists = prev.some(b => b.id === build.id);
      if (exists) {
        return prev.filter(b => b.id !== build.id);
      }
      if (prev.length >= 4) {
        // limit comparison to 4 builds
        return [...prev.slice(1), build];
      }
      return [...prev, build];
    });
  }, []);

  // Selected activity metadata
  const selectedActivityOption = useMemo(() => {
    return getActivityOption(activity);
  }, [activity]);

  // Load builds from Albion Arsenal API
  const loadBuilds = async (force: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const apiKind = getArsenalKindForActivity(activity);
      const [buildsRes, weaponsRes] = await Promise.all([
        fetchArsenalBuilds({
          region,
          range,
          kind: apiKind,
          weapon: selectedWeaponFilter || undefined,
          limit: 100
        }, force),
        fetchArsenalWeapons({ region, range, kind: apiKind, limit: 100 }, force)
      ]);

      setBuilds(buildsRes.builds || []);
      setAnalyzedWeaponsCount(weaponsRes.weapons?.length || 0);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao buscar builds de Albion Arsenal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuilds();
  }, [region, range, activity, selectedWeaponFilter]);

  // Handle switching to builds tab with a specific weapon filter from the Meta/Weapons view
  const handleSelectWeaponFromMeta = (weaponCode: string) => {
    setSelectedWeaponFilter(weaponCode);
    setActiveSubTab('builds');
  };

  // Filtered & Sorted Builds
  const filteredAndSortedBuilds = useMemo(() => {
    const list = activeSubTab === 'favoritos' ? favoriteBuilds : builds;
    const apiKind = getArsenalKindForActivity(activity);

    const filtered = list.filter((b) => {
      // 1. Activity filter check
      if (activity && activity !== 'all') {
        if (!isBuildMatchingActivity(b, activity, apiKind)) {
          return false;
        }
      }

      // 2. Search query check
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase().trim();
        const matchName = b.name.toLowerCase().includes(q);
        const matchWeapon = b.slots.mainHand.toLowerCase().includes(q);
        const matchId = String(b.id) === q;
        if (!matchName && !matchWeapon && !matchId) {
          return false;
        }
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'winrate':
          return b.winrate - a.winrate;
        case 'avgIp':
          return b.avgIp - a.avgIp;
        case 'costAsc':
          return a.kitValueSilver - b.kitValueSilver;
        case 'costDesc':
          return b.kitValueSilver - a.kitValueSilver;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'fights':
        default:
          return (b.kills + b.deaths) - (a.kills + a.deaths);
      }
    });
  }, [builds, favoriteBuilds, activeSubTab, debouncedSearch, sortBy, activity]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedBuilds.length / itemsPerPage));
  const paginatedBuilds = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedBuilds.slice(start, start + itemsPerPage);
  }, [filteredAndSortedBuilds, currentPage, itemsPerPage]);

  const subTabs = [
    { id: 'meta' as const, label: 'Meta & Armas', icon: BarChart3 },
    { id: 'builds' as const, label: 'Catálogo de Builds', icon: Swords, count: builds.length },
    { id: 'comparar' as const, label: 'Comparar', icon: Scale, count: compareBuilds.length },
    { id: 'favoritos' as const, label: 'Favoritos', icon: Star, count: favoriteBuilds.length },
    { id: 'criar' as const, label: 'Criar Build', icon: PlusCircle }
  ];

  return (
    <div className="space-y-8">
      
      {/* Internal Header Stats Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-[#0c0e15] border border-zinc-800/90 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FERRAMENTA COMPETITIVA DINÂMICA</span>
            </div>
            
            <h2 className="font-cinzel text-2xl sm:text-4xl font-black text-white tracking-wide">
              BUILDS & META ALBION ONLINE
            </h2>
            
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
              Explore builds atualizadas de Albion Online, acompanhe o meta e encontre equipamentos para diferentes atividades com dados oficiais de combate e preços reais no mercado.
            </p>

            {/* Dynamic Status Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Builds no Catálogo:</span>
                <strong className="font-mono text-amber-300">{builds.length}</strong>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 flex items-center gap-2">
                <Swords className="w-3.5 h-3.5 text-orange-400" />
                <span>Armas no Meta:</span>
                <strong className="font-mono text-orange-300">{analyzedWeaponsCount}</strong>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 font-mono text-[11px]">
                Última sincronização: <span className="text-zinc-200">{lastSyncTime}</span>
              </div>
            </div>

            {/* Attribution Notices */}
            <div className="text-[11px] text-zinc-400 pt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                Dados de combate:{' '}
                <a
                  href="https://albion-arsenal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline font-semibold"
                >
                  Albion Arsenal
                </a>
              </span>
              <span>•</span>
              <span>
                Preços de mercado:{' '}
                <a
                  href="https://www.albion-online-data.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
                >
                  Albion Online Data Project
                </a>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            <button
              id="btn-refresh-all-data"
              onClick={() => loadBuilds(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Atualizando...' : 'Atualizar Dados'}</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Internal Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 overflow-x-auto pb-px">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`subtab-${tab.id}`}
              onClick={() => {
                setActiveSubTab(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: META & ARMAS */}
      {activeSubTab === 'meta' && (
        <AlbionMetaWeaponsView 
          onSelectWeaponForBuilds={handleSelectWeaponFromMeta}
        />
      )}

      {/* TAB CONTENT: COMPARAR */}
      {activeSubTab === 'comparar' && (
        <AlbionBuildCompareView
          compareBuilds={compareBuilds}
          onRemoveFromCompare={(id) => handleToggleCompare(compareBuilds.find(b => b.id === id)!)}
          onClearCompare={() => setCompareBuilds([])}
          onSelectBuild={(build) => setSelectedBuildForModal(build)}
          onNavigateToBuilds={() => setActiveSubTab('builds')}
        />
      )}

      {/* TAB CONTENT: CRIAR BUILD */}
      {activeSubTab === 'criar' && (
        <AlbionBuildCreatorView />
      )}

      {/* TAB CONTENT: BUILDS or FAVORITOS */}
      {(activeSubTab === 'builds' || activeSubTab === 'favoritos') && (
        <div className="space-y-6">
          
          {/* Filtering and Search Controls */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-400" />
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white">
                  {activeSubTab === 'favoritos' ? 'Suas Builds Favoritas' : 'Filtros do Catálogo'}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Dynamic Activity Badge with Real Counter */}
                <div 
                  id="badge-selected-activity"
                  className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300"
                >
                  <span className="text-zinc-400 text-[11px] font-mono">ATIVIDADE:</span>
                  <strong className="font-mono font-bold uppercase text-amber-300 tracking-wide">
                    {selectedActivityOption?.label.replace(/\s*\(.*?\)/, '').trim().toUpperCase()}
                  </strong>
                  <span className="text-zinc-500">•</span>
                  <span className="font-mono text-zinc-200 font-semibold">
                    {filteredAndSortedBuilds.length} {filteredAndSortedBuilds.length === 1 ? 'build' : 'builds'}
                  </span>
                </div>

                {selectedWeaponFilter && (
                  <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg text-xs">
                    <span className="text-zinc-400">Arma:</span>
                    <strong className="text-amber-300 font-mono">{selectedWeaponFilter}</strong>
                    <button
                      onClick={() => setSelectedWeaponFilter('')}
                      className="ml-1 text-zinc-400 hover:text-rose-400 cursor-pointer"
                      title="Remover filtro de arma"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar build, arma ou item..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Region */}
              <select
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value as ArsenalRegion);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-amber-400"
              >
                <option value="all">Servidor: Todos</option>
                <option value="americas">Americas (West)</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia (East)</option>
              </select>

              {/* Activity / Categorized Content */}
              <div className="relative">
                <select
                  id="filter-albion-activity"
                  value={activity}
                  onChange={(e) => {
                    setActivity(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  title="Filtrar por estilo ou atividade de jogo em Albion Online"
                >
                  {ALBION_ACTIVITY_GROUPS.map((group) => (
                    <optgroup
                      key={group.label}
                      label={group.label}
                      className="bg-zinc-900 text-amber-400 font-bold uppercase tracking-wider"
                    >
                      {group.options.map((opt) => (
                        <option
                          key={opt.id}
                          value={opt.id}
                          className="bg-zinc-950 text-zinc-200 font-normal"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Range */}
              <select
                value={range}
                onChange={(e) => {
                  setRange(e.target.value as ArsenalRange);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-amber-400"
              >
                <option value="24h">Últimas 24 Horas</option>
                <option value="7d">Últimos 7 Dias</option>
                <option value="30d">Últimos 30 Dias</option>
              </select>
            </div>

            {/* Sorting bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="fights">Mais Populares (Lutas/Kills)</option>
                  <option value="winrate">Maior Taxa de Vitória (Winrate)</option>
                  <option value="avgIp">Maior IP Médio</option>
                  <option value="costAsc">Menor Custo do Kit</option>
                  <option value="costDesc">Maior Custo do Kit</option>
                  <option value="name">Nome (A-Z)</option>
                </select>
              </div>

              <div>
                Exibindo <strong className="text-zinc-200 font-mono">{filteredAndSortedBuilds.length}</strong> builds encontradas
                {activity !== 'all' && (
                  <span className="text-zinc-400 ml-1 text-xs">
                    em <strong className="text-amber-400">{selectedActivityOption?.label}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Loading or Error */}
          {loading ? (
            <div className="p-16 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
              <div className="text-base font-semibold text-zinc-200">
                Sincronizando builds com o Albion Arsenal...
              </div>
              <p className="text-xs text-zinc-500">
                Processando estatísticas de combate, itens e taxas de vitória.
              </p>
            </div>
          ) : error ? (
            <div className="p-10 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
              <div className="text-base font-bold text-rose-300">{error}</div>
              <button
                onClick={() => loadBuilds(true)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
              >
                Tentar Novamente
              </button>
            </div>
          ) : filteredAndSortedBuilds.length === 0 ? (
            <div className="p-14 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
              <Swords className="w-10 h-10 text-zinc-600 mx-auto" />
              <div className="text-base font-bold text-zinc-300">
                {activeSubTab === 'favoritos' 
                  ? 'Você ainda não salvou nenhuma build nos favoritos.' 
                  : activity !== 'all'
                    ? 'Nenhuma build encontrada para esta atividade.'
                    : 'Nenhuma build encontrada com os filtros atuais.'}
              </div>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                {activeSubTab === 'favoritos'
                  ? 'Navegue pelo catálogo e clique na estrela de qualquer card para favoritá-lo.'
                  : activity !== 'all'
                    ? `Nenhuma build foi classificada para "${selectedActivityOption?.label}" nos dados registrados pela API do Albion Arsenal para este filtro de período e servidor. Não geramos dados fictícios caso a fonte oficial não possua registros nesta atividade.`
                    : 'Tente alterar os filtros de período, servidor ou o termo pesquisado.'}
              </p>
              {activity !== 'all' && activeSubTab !== 'favoritos' && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setActivity('all');
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
                  >
                    Exibir Todas as Atividades
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Build Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedBuilds.map((build) => (
                  <AlbionBuildCard
                    key={build.id}
                    build={build}
                    onSelect={(b) => setSelectedBuildForModal(b)}
                    isFavorite={favoriteBuilds.some(fav => fav.id === build.id)}
                    onToggleFavorite={handleToggleFavorite}
                    isComparing={compareBuilds.some(comp => comp.id === build.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
                  <div className="text-xs text-zinc-400">
                    Página <strong className="text-zinc-200">{currentPage}</strong> de <strong className="text-zinc-200">{totalPages}</strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      id="btn-prev-page-builds"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Página anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5) {
                        if (currentPage > 3) {
                          pageNum = currentPage - 2 + i;
                        }
                        if (pageNum > totalPages) {
                          pageNum = totalPages - (4 - i);
                        }
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-amber-500 text-zinc-950 shadow-md'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      id="btn-next-page-builds"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Próxima página"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Build Details Modal */}
      {selectedBuildForModal && (
        <AlbionBuildDetailModal
          build={selectedBuildForModal}
          onClose={() => setSelectedBuildForModal(null)}
          isFavorite={favoriteBuilds.some(fav => fav.id === selectedBuildForModal.id)}
          onToggleFavorite={handleToggleFavorite}
          isComparing={compareBuilds.some(comp => comp.id === selectedBuildForModal.id)}
          onToggleCompare={handleToggleCompare}
        />
      )}

    </div>
  );
};
