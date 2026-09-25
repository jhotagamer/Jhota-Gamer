import React, { useState } from 'react';
import { 
  Star, 
  Scale, 
  Eye, 
  Copy, 
  Check, 
  Crosshair, 
  Coins, 
  Zap, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { ArsenalBuild } from '../../types/albionArsenal';
import { resolveBuildSlots } from '../../services/albionItemCatalogService';
import { ItemImage } from './ItemImage';

interface AlbionBuildCardProps {
  build: ArsenalBuild;
  onSelect: (build: ArsenalBuild) => void;
  isFavorite: boolean;
  onToggleFavorite: (build: ArsenalBuild) => void;
  isComparing: boolean;
  onToggleCompare: (build: ArsenalBuild) => void;
}

export const AlbionBuildCard: React.FC<AlbionBuildCardProps> = ({
  build,
  onSelect,
  isFavorite,
  onToggleFavorite,
  isComparing,
  onToggleCompare
}) => {
  const [copied, setCopied] = useState(false);
  const slots = resolveBuildSlots(build.slots, 4);
  const mainWeapon = slots.find(s => s.slotKey === 'mainHand');
  const otherSlots = slots.filter(s => s.slotKey !== 'mainHand');

  const winratePercent = (build.winrate * 100).toFixed(1);
  const winrateColor = build.winrate >= 0.55 
    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' 
    : build.winrate >= 0.48 
      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' 
      : 'text-rose-400 border-rose-500/30 bg-rose-500/10';

  const formatSilver = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toLocaleString();
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(build.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div 
      id={`build-card-${build.id}`}
      className="group relative rounded-2xl bg-zinc-900/80 border border-zinc-800/90 hover:border-amber-500/40 transition-all duration-200 shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Bar */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${winrateColor}`}>
              {winratePercent}% Winrate
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-300">
              IP {build.avgIp}
            </span>
            {build.provenanceKind && build.provenanceKind !== 'all' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-300">
                {build.provenanceKind === '1v1' ? '1v1 Solo' : build.provenanceKind === 'gank' ? 'Gank' : 'ZvZ'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              id={`btn-fav-card-${build.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(build);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isFavorite 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-500 hover:text-amber-400 hover:border-zinc-700'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              id={`btn-compare-card-${build.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(build);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isComparing 
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' 
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-500 hover:text-cyan-400 hover:border-zinc-700'
              }`}
              title={isComparing ? 'Remover do comparador' : 'Adicionar ao comparador'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Build Name & Main Weapon */}
        <div className="flex items-center gap-3 mb-4">
          {mainWeapon ? (
            <ItemImage
              itemId={mainWeapon.fullItemId}
              tier={4}
              size="md"
              showTierBadge={false}
              alt={mainWeapon.namePt}
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600">
              <Zap className="w-6 h-6" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
              {build.name}
            </h3>
            <p className="text-xs text-zinc-400 truncate">
              {mainWeapon ? `${mainWeapon.namePt} (${mainWeapon.nameEn})` : 'Combinação de Equipamentos'}
            </p>
          </div>
        </div>

        {/* Equipment Preview Slots */}
        <div className="mb-4">
          <div className="text-[10px] uppercase font-mono font-semibold text-zinc-500 mb-1.5">
            Componentes do Kit
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {otherSlots.map((slot) => (
              <div 
                key={slot.slotKey} 
                className="relative group/slot"
                title={`${slot.slotLabel}: ${slot.namePt}`}
              >
                <ItemImage
                  itemId={slot.fullItemId}
                  tier={4}
                  size="sm"
                  alt={slot.namePt}
                  className="bg-zinc-950/80 border-zinc-800"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stat Summary Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/80 text-xs">
          <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 mb-0.5">
              <Coins className="w-3 h-3 text-amber-400" />
              <span>Custo Médio</span>
            </div>
            <div className="font-mono font-bold text-amber-300">
              {formatSilver(build.kitValueSilver)} <span className="text-[10px] text-zinc-500 font-normal">prata</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 mb-0.5">
              <Crosshair className="w-3 h-3 text-rose-400" />
              <span>Abates / Mortes</span>
            </div>
            <div className="font-mono font-bold text-zinc-200">
              {build.kills.toLocaleString()} <span className="text-zinc-500 text-[10px]">/</span> {build.deaths.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-3 bg-zinc-950/80 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        <button
          id={`btn-copy-link-${build.id}`}
          onClick={handleCopyLink}
          className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer px-2 py-1 rounded"
          title="Copiar link da build"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Link</span>
            </>
          )}
        </button>

        <button
          id={`btn-view-details-${build.id}`}
          onClick={() => onSelect(build)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/30 hover:border-amber-500 font-semibold text-xs transition-all cursor-pointer"
        >
          <span>Ver Detalhes</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
