import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  TrendingUp, 
  RefreshCw, 
  ShieldAlert, 
  ChevronRight, 
  Search, 
  BarChart3, 
  ExternalLink,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { ArsenalWeapon, ArsenalWeaponDetail, ArsenalRegion, ArsenalRange, ArsenalKind } from '../../types/albionArsenal';
import { fetchArsenalWeapons, fetchArsenalWeaponDetail } from '../../services/albionArsenalApi';
import { findItemByCode, formatFriendlyItemName } from '../../services/albionItemCatalogService';
import { ItemImage } from './ItemImage';

interface AlbionMetaWeaponsViewProps {
  onSelectWeaponForBuilds?: (weaponCode: string) => void;
}

export const AlbionMetaWeaponsView: React.FC<AlbionMetaWeaponsViewProps> = ({
  onSelectWeaponForBuilds
}) => {
  const [weapons, setWeapons] = useState<ArsenalWeapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [region, setRegion] = useState<ArsenalRegion>('all');
  const [range, setRange] = useState<ArsenalRange>('7d');
  const [kind, setKind] = useState<ArsenalKind>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeaponDetail, setSelectedWeaponDetail] = useState<ArsenalWeaponDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadWeapons = async (force: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchArsenalWeapons({ region, range, kind, limit: 100 }, force);
      setWeapons(res.weapons || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar estatísticas do meta.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeapons();
  }, [region, range, kind]);

  const handleInspectWeapon = async (weapon: ArsenalWeapon) => {
    setLoadingDetail(true);
    try {
      const detail = await fetchArsenalWeaponDetail(weapon.weapon, { region, range, kind });
      setSelectedWeaponDetail(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const filteredWeapons = weapons.filter((w) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    const localized = findItemByCode(w.weapon);
    const namePt = localized ? localized.name.toLowerCase() : '';
    return (
      w.name.toLowerCase().includes(q) ||
      w.weapon.toLowerCase().includes(q) ||
      namePt.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Meta Filter Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>Desempenho Geral das Armas no Meta (PvP)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Rankings oficiais computados com base em milhares de combates reais via Albion Arsenal.
            </p>
          </div>

          <button
            id="btn-refresh-meta-weapons"
            onClick={() => loadWeapons(true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar arma..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Region */}
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as ArsenalRegion)}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">Servidor: Todos</option>
            <option value="americas">Servidor: Americas (West)</option>
            <option value="europe">Servidor: Europe</option>
            <option value="asia">Servidor: Asia (East)</option>
          </select>

          {/* Range */}
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as ArsenalRange)}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-amber-400"
          >
            <option value="24h">Período: Últimas 24 Horas</option>
            <option value="7d">Período: Últimos 7 Dias</option>
            <option value="30d">Período: Últimos 30 Dias</option>
          </select>

          {/* Kind / Activity */}
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as ArsenalKind)}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">Tipo de Combate: Todos</option>
            <option value="1v1">Solo / Duelos (1v1)</option>
            <option value="gank">Pequenos Grupos (2-9)</option>
            <option value="zvz">Grandes Batalhas (10+ ZvZ)</option>
          </select>
        </div>
      </div>

      {/* Loading or Error State */}
      {loading ? (
        <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <div className="text-sm font-semibold text-zinc-300">Carregando métricas do meta...</div>
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
          <div className="text-sm font-bold text-rose-300">{error}</div>
          <button
            onClick={() => loadWeapons(true)}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-200 hover:bg-zinc-700 cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      ) : filteredWeapons.length === 0 ? (
        <div className="p-10 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400 text-sm">
          Nenhuma arma encontrada com os filtros selecionados.
        </div>
      ) : (
        /* Weapons Ranking List */
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Arma</th>
                <th className="py-3 px-4 text-center">Lutas</th>
                <th className="py-3 px-4 text-center">Vitórias</th>
                <th className="py-3 px-4 text-center">Taxa de Vitória</th>
                <th className="py-3 px-4 text-center">Ajustada</th>
                <th className="py-3 px-4 text-center">Gear-Gap (IP Split)</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredWeapons.map((w, index) => {
                const localized = findItemByCode(w.weapon);
                const namePt = localized ? localized.name : formatFriendlyItemName(w.weapon);
                const winrateVal = w.winrate * 100;
                const winrateColor = winrateVal >= 55 
                  ? 'text-emerald-400' 
                  : winrateVal >= 48 
                    ? 'text-amber-400' 
                    : 'text-rose-400';

                // Punching Up / Even / Punching Down calculations
                const totalFights = w.fights || 1;
                const punchUpPct = Math.round(((w.gearGap?.punchingUp?.fights || 0) / totalFights) * 100);
                const evenPct = Math.round(((w.gearGap?.even?.fights || 0) / totalFights) * 100);
                const punchDownPct = Math.round(((w.gearGap?.punchingDown?.fights || 0) / totalFights) * 100);

                return (
                  <tr 
                    key={w.weapon} 
                    className="hover:bg-zinc-900/60 transition-colors group cursor-pointer"
                    onClick={() => handleInspectWeapon(w)}
                  >
                    <td className="py-3 px-4 text-center font-mono font-bold text-zinc-500 group-hover:text-amber-400">
                      {index + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <ItemImage
                          itemId={localized?.id || `T4_${w.weapon}`}
                          tier={4}
                          size="sm"
                          alt={namePt}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">
                            {namePt}
                          </div>
                          <div className="text-[11px] text-zinc-400 italic truncate">
                            {w.name} ({w.weapon})
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-zinc-300 font-semibold">
                      {w.fights.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-emerald-400 font-semibold">
                      {w.wins.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className={`font-mono font-bold text-sm ${winrateColor}`}>
                        {winrateVal.toFixed(1)}%
                      </div>
                      <div className="w-20 mx-auto bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full ${winrateVal >= 50 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${Math.min(100, Math.max(0, winrateVal))}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-xs text-zinc-400">
                      {(w.adjustedWinrate * 100).toFixed(1)}%
                    </td>

                    {/* Gear-Gap bar preview */}
                    <td className="py-3 px-4 text-center">
                      <div className="w-28 mx-auto flex h-2 rounded overflow-hidden bg-zinc-800" title={`Punching Up (IP menor): ${punchUpPct}% | Even: ${evenPct}% | Punching Down: ${punchDownPct}%`}>
                        <div style={{ width: `${punchUpPct}%` }} className="bg-purple-500" />
                        <div style={{ width: `${evenPct}%` }} className="bg-blue-500" />
                        <div style={{ width: `${punchDownPct}%` }} className="bg-emerald-500" />
                      </div>
                      <div className="flex justify-between text-[9px] text-zinc-500 mt-0.5 w-28 mx-auto font-mono">
                        <span title="Punching Up">{punchUpPct}%</span>
                        <span title="Even IP">{evenPct}%</span>
                        <span title="Punching Down">{punchDownPct}%</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectWeapon(w);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 font-semibold text-[11px] transition-all cursor-pointer"
                      >
                        <span>Confrontos</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Weapon Matchups Modal / Drawer */}
      {selectedWeaponDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div 
            className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-zinc-800/80 bg-zinc-900/60 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <ItemImage
                  itemId={`T4_${selectedWeaponDetail.weapon}`}
                  tier={4}
                  size="lg"
                  alt={selectedWeaponDetail.name}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                      Análise de Confrontos (Matchups)
                    </span>
                    <span className="text-xs text-zinc-400">
                      {(selectedWeaponDetail.winrate * 100).toFixed(1)}% Winrate Geral
                    </span>
                  </div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                    {findItemByCode(selectedWeaponDetail.weapon)?.name || selectedWeaponDetail.name}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {selectedWeaponDetail.name} ({selectedWeaponDetail.weapon})
                  </p>
                </div>
              </div>

              <button
                id="btn-close-weapon-matchup-modal"
                onClick={() => setSelectedWeaponDetail(null)}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              
              {/* Gear-Gap Breakdown Card */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <h4 className="font-cinzel text-sm font-bold text-white">
                  Desempenho por Vantagem de IP (Gear-Gap Analytics)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-950 border border-purple-500/30">
                    <div className="text-purple-400 font-bold mb-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Punching Up (IP Menor)</span>
                    </div>
                    <div className="font-mono text-sm text-zinc-200 font-bold">
                      {selectedWeaponDetail.gearGap.punchingUp.wins.toLocaleString()} / {selectedWeaponDetail.gearGap.punchingUp.fights.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Vitórias: {selectedWeaponDetail.gearGap.punchingUp.fights > 0 ? ((selectedWeaponDetail.gearGap.punchingUp.wins / selectedWeaponDetail.gearGap.punchingUp.fights) * 100).toFixed(1) : 0}%
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950 border border-blue-500/30">
                    <div className="text-blue-400 font-bold mb-1 flex items-center gap-1">
                      <Minus className="w-3.5 h-3.5" />
                      <span>Even (IP Equivalente)</span>
                    </div>
                    <div className="font-mono text-sm text-zinc-200 font-bold">
                      {selectedWeaponDetail.gearGap.even.wins.toLocaleString()} / {selectedWeaponDetail.gearGap.even.fights.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Vitórias: {selectedWeaponDetail.gearGap.even.fights > 0 ? ((selectedWeaponDetail.gearGap.even.wins / selectedWeaponDetail.gearGap.even.fights) * 100).toFixed(1) : 0}%
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950 border border-emerald-500/30">
                    <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      <span>Punching Down (IP Maior)</span>
                    </div>
                    <div className="font-mono text-sm text-zinc-200 font-bold">
                      {selectedWeaponDetail.gearGap.punchingDown.wins.toLocaleString()} / {selectedWeaponDetail.gearGap.punchingDown.fights.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Vitórias: {selectedWeaponDetail.gearGap.punchingDown.fights > 0 ? ((selectedWeaponDetail.gearGap.punchingDown.wins / selectedWeaponDetail.gearGap.punchingDown.fights) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Matchup Table */}
              <div className="space-y-3">
                <h4 className="font-cinzel text-sm font-bold text-white">
                  Tabela de Confrontos Diretos ({selectedWeaponDetail.matchups?.length || 0} adversários analisados)
                </h4>
                
                <div className="max-h-80 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">Oponente</th>
                        <th className="py-2.5 px-3 text-center">Lutas</th>
                        <th className="py-2.5 px-3 text-center">Vitórias</th>
                        <th className="py-2.5 px-3 text-center">Taxa de Vitória</th>
                        <th className="py-2.5 px-3 text-center">Diferença de IP (Edge)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {selectedWeaponDetail.matchups?.map((m) => {
                        const winrateVal = m.winrate * 100;
                        const winrateColor = winrateVal >= 55 ? 'text-emerald-400' : winrateVal >= 48 ? 'text-amber-400' : 'text-rose-400';
                        const oppItem = findItemByCode(m.opponent);

                        return (
                          <tr key={m.opponent} className="hover:bg-zinc-900/50">
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                <ItemImage
                                  itemId={`T4_${m.opponent}`}
                                  tier={4}
                                  size="xs"
                                  alt={m.name}
                                />
                                <div className="min-w-0">
                                  <div className="font-semibold text-zinc-200">
                                    {oppItem ? oppItem.name : m.name}
                                  </div>
                                  <div className="text-[10px] text-zinc-500 font-mono">
                                    {m.opponent}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-2 px-3 text-center font-mono text-zinc-300">
                              {m.fights.toLocaleString()}
                            </td>

                            <td className="py-2 px-3 text-center font-mono text-emerald-400">
                              {m.wins.toLocaleString()}
                            </td>

                            <td className="py-2 px-3 text-center font-mono font-bold">
                              <span className={winrateColor}>{winrateVal.toFixed(1)}%</span>
                            </td>

                            <td className="py-2 px-3 text-center font-mono text-xs">
                              {m.avgIpEdge > 0 ? (
                                <span className="text-emerald-400">+{m.avgIpEdge} IP</span>
                              ) : m.avgIpEdge < 0 ? (
                                <span className="text-rose-400">{m.avgIpEdge} IP</span>
                              ) : (
                                <span className="text-zinc-500">0 IP</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <a
                href={selectedWeaponDetail.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors"
              >
                <span>Ver página no Albion Arsenal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                {onSelectWeaponForBuilds && (
                  <button
                    onClick={() => {
                      onSelectWeaponForBuilds(selectedWeaponDetail.weapon);
                      setSelectedWeaponDetail(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Ver Builds Desta Arma
                  </button>
                )}

                <button
                  onClick={() => setSelectedWeaponDetail(null)}
                  className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
