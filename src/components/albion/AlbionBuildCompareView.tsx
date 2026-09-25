import React, { useState } from 'react';
import { 
  Scale, 
  Trash2, 
  Coins, 
  TrendingUp, 
  Crosshair, 
  Award, 
  RefreshCw, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ArsenalBuild } from '../../types/albionArsenal';
import { resolveBuildSlots } from '../../services/albionItemCatalogService';
import { ItemImage } from './ItemImage';

interface AlbionBuildCompareViewProps {
  compareBuilds: ArsenalBuild[];
  onRemoveFromCompare: (buildId: number) => void;
  onClearCompare: () => void;
  onSelectBuild: (build: ArsenalBuild) => void;
  onNavigateToBuilds: () => void;
}

export const AlbionBuildCompareView: React.FC<AlbionBuildCompareViewProps> = ({
  compareBuilds,
  onRemoveFromCompare,
  onClearCompare,
  onSelectBuild,
  onNavigateToBuilds
}) => {
  const [selectedTier, setSelectedTier] = useState<number>(4);

  if (compareBuilds.length === 0) {
    return (
      <div className="p-12 sm:p-16 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center mx-auto text-cyan-400">
          <Scale className="w-8 h-8" />
        </div>
        <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
          Nenhuma build selecionada para comparação
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          No catálogo de builds ou no visualizador detalhado, clique no ícone de balança (<strong>Comparar</strong>) para adicionar 2 ou mais builds lado a lado e analisar taxas de vitória, custos, IP e equipamentos.
        </p>
        <button
          id="btn-goto-builds-from-compare"
          onClick={onNavigateToBuilds}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-lg"
        >
          <span>Explorar Catálogo de Builds</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const formatSilver = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toLocaleString();
  };

  const slotLabels = [
    { key: 'mainHand' as const, label: 'Arma Principal' },
    { key: 'offHand' as const, label: 'Mão Secundária' },
    { key: 'head' as const, label: 'Elmo / Capacete' },
    { key: 'armor' as const, label: 'Armadura / Peito' },
    { key: 'shoes' as const, label: 'Botas / Calçados' },
    { key: 'cape' as const, label: 'Capa' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            <span>Comparador Lado a Lado ({compareBuilds.length} builds)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Compare estatísticas de combate, eficiência de IP, valor estimado do kit e peças de equipamento.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tier visual switch */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
            <span className="text-[11px] text-zinc-400 px-1">Tier:</span>
            {[4, 5, 6, 7, 8].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                  selectedTier === t
                    ? 'bg-cyan-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                T{t}
              </button>
            ))}
          </div>

          <button
            id="btn-clear-all-compare"
            onClick={onClearCompare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-rose-900/60 text-zinc-300 hover:text-rose-200 border border-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Todos</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              <th className="p-4 w-48 text-xs font-mono uppercase tracking-wider text-zinc-400 sticky left-0 bg-zinc-900/95 z-10">
                Critério / Métrica
              </th>
              {compareBuilds.map((build) => (
                <th key={build.id} className="p-4 min-w-[240px] align-top">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      Build #{build.id}
                    </span>
                    <button
                      onClick={() => onRemoveFromCompare(build.id)}
                      className="text-zinc-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      title="Remover da comparação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-cinzel text-base font-bold text-white mb-2 line-clamp-1">
                    {build.name}
                  </div>
                  <button
                    onClick={() => onSelectBuild(build)}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    Ver Detalhes Completos
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-xs">
            {/* Winrate */}
            <tr className="hover:bg-zinc-900/30">
              <td className="p-4 font-semibold text-zinc-300 sticky left-0 bg-zinc-950 z-10 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Taxa de Vitória</span>
              </td>
              {compareBuilds.map((b) => {
                const winrateVal = (b.winrate * 100).toFixed(1);
                const isHigh = b.winrate >= 0.55;
                return (
                  <td key={b.id} className="p-4 font-mono">
                    <span className={`text-base font-bold ${isHigh ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {winrateVal}%
                    </span>
                    <div className="text-[11px] text-zinc-500">
                      Ajustada: {(b.adjustedWinrate * 100).toFixed(1)}%
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Average IP */}
            <tr className="hover:bg-zinc-900/30">
              <td className="p-4 font-semibold text-zinc-300 sticky left-0 bg-zinc-950 z-10">
                Item Power Médio (IP)
              </td>
              {compareBuilds.map((b) => (
                <td key={b.id} className="p-4 font-mono font-bold text-zinc-100 text-sm">
                  {b.avgIp}
                </td>
              ))}
            </tr>

            {/* Estimated Kit Value */}
            <tr className="hover:bg-zinc-900/30">
              <td className="p-4 font-semibold text-zinc-300 sticky left-0 bg-zinc-950 z-10 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Custo Médio do Kit</span>
              </td>
              {compareBuilds.map((b) => (
                <td key={b.id} className="p-4 font-mono font-bold text-amber-300">
                  {formatSilver(b.kitValueSilver)} Prata
                </td>
              ))}
            </tr>

            {/* Kills and Deaths */}
            <tr className="hover:bg-zinc-900/30">
              <td className="p-4 font-semibold text-zinc-300 sticky left-0 bg-zinc-950 z-10 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-rose-400" />
                <span>Abates / Mortes</span>
              </td>
              {compareBuilds.map((b) => (
                <td key={b.id} className="p-4 font-mono text-zinc-200">
                  <span className="text-emerald-400 font-bold">{b.kills.toLocaleString()}</span> K /{' '}
                  <span className="text-rose-400">{b.deaths.toLocaleString()}</span> D
                  <div className="text-[10px] text-zinc-500">
                    K/D: {b.deaths > 0 ? (b.kills / b.deaths).toFixed(2) : b.kills}
                  </div>
                </td>
              ))}
            </tr>

            {/* Kill Fame */}
            <tr className="hover:bg-zinc-900/30">
              <td className="p-4 font-semibold text-zinc-300 sticky left-0 bg-zinc-950 z-10 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Kill Fame</span>
              </td>
              {compareBuilds.map((b) => (
                <td key={b.id} className="p-4 font-mono text-purple-300 font-semibold">
                  {b.killFame >= 1000000 ? `${(b.killFame / 1000000).toFixed(1)}M` : b.killFame.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* Slot-by-Slot Equipments */}
            {slotLabels.map((slotDef) => (
              <tr key={slotDef.key} className="hover:bg-zinc-900/30">
                <td className="p-4 font-semibold text-zinc-400 sticky left-0 bg-zinc-950 z-10">
                  {slotDef.label}
                </td>
                {compareBuilds.map((b) => {
                  const resolved = resolveBuildSlots(b.slots, selectedTier);
                  const matched = resolved.find((s) => s.slotKey === slotDef.key);

                  return (
                    <td key={b.id} className="p-4">
                      {matched ? (
                        <div className="flex items-center gap-2.5">
                          <ItemImage
                            itemId={matched.fullItemId}
                            tier={selectedTier}
                            size="sm"
                            alt={matched.namePt}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-zinc-200 truncate">{matched.namePt}</div>
                            <div className="text-[10px] text-zinc-500 italic truncate">{matched.nameEn}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-600 italic">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
