import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Coins, 
  Search, 
  X, 
  Check, 
  RefreshCw, 
  Copy, 
  Sparkles, 
  Swords, 
  Shield, 
  HardHat, 
  Footprints, 
  Shirt, 
  Crown, 
  Utensils, 
  FlaskConical, 
  Compass 
} from 'lucide-react';
import { CustomBuild, CustomBuildSlotItem, BuildMarketCostResult } from '../../types/albionArsenal';
import { AlbionItem, AlbionServer, AlbionCity } from '../../types/albionMarket';
import { getItemCatalog, filterItemsByCategory } from '../../services/albionItemCatalogService';
import { calculateBuildMarketCost } from '../../services/albionMarketIntegration';
import { ItemImage } from './ItemImage';
import { MARKET_LOCATIONS, getCityDisplayName } from '../../data/albionPopularItems';

interface AlbionBuildCreatorViewProps {
  onBuildCreated?: (build: CustomBuild) => void;
}

type SlotKey = 'mainHand' | 'offHand' | 'head' | 'armor' | 'shoes' | 'cape' | 'food' | 'potion' | 'mount';

interface SlotConfig {
  key: SlotKey;
  label: string;
  category: string;
  icon: React.ElementType;
}

const SLOTS_CONFIG: SlotConfig[] = [
  { key: 'mainHand', label: 'Arma Principal', category: 'Armas', icon: Swords },
  { key: 'offHand', label: 'Mão Secundária', category: 'Armaduras', icon: Shield },
  { key: 'head', label: 'Capacete / Elmo', category: 'Capacetes', icon: HardHat },
  { key: 'armor', label: 'Peito / Armadura', category: 'Armaduras', icon: Shirt },
  { key: 'shoes', label: 'Botas / Calçados', category: 'Botas', icon: Footprints },
  { key: 'cape', label: 'Capa Especial', category: 'Capas', icon: Crown },
  { key: 'food', label: 'Alimento', category: 'Alimentos', icon: Utensils },
  { key: 'potion', label: 'Poção', category: 'Poções', icon: FlaskConical },
  { key: 'mount', label: 'Montaria', category: 'Montarias', icon: Compass }
];

const STORAGE_KEY = 'jhota_custom_albion_builds';

export const AlbionBuildCreatorView: React.FC<AlbionBuildCreatorViewProps> = () => {
  const [catalog, setCatalog] = useState<AlbionItem[]>([]);
  const [buildName, setBuildName] = useState('Minha Build Customizada');
  const [activity, setActivity] = useState<CustomBuild['activity']>('1v1');
  const [globalTier, setGlobalTier] = useState<number>(4);
  const [notes, setNotes] = useState('');
  
  const [slots, setSlots] = useState<Record<SlotKey, CustomBuildSlotItem | null>>({
    mainHand: null,
    offHand: null,
    head: null,
    armor: null,
    shoes: null,
    cape: null,
    food: null,
    potion: null,
    mount: null
  });

  const [savedBuilds, setSavedBuilds] = useState<CustomBuild[]>([]);
  const [activePickerSlot, setActivePickerSlot] = useState<SlotConfig | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerTier, setPickerTier] = useState<number>(4);
  const [pickerEnchant, setPickerEnchant] = useState<number>(0);

  // Market integration state
  const [marketServer, setMarketServer] = useState<AlbionServer>('americas');
  const [marketCity, setMarketCity] = useState<AlbionCity>('Caerleon');
  const [pricingResult, setPricingResult] = useState<BuildMarketCostResult | null>(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getItemCatalog().then(setCatalog);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedBuilds(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCustomBuild = () => {
    if (!buildName.trim()) return;

    const newBuild: CustomBuild = {
      id: `custom_${Date.now()}`,
      name: buildName,
      activity,
      tier: globalTier,
      notes,
      slots,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newBuild, ...savedBuilds];
    setSavedBuilds(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const deleteCustomBuild = (id: string) => {
    const updated = savedBuilds.filter(b => b.id !== id);
    setSavedBuilds(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const loadSavedBuild = (b: CustomBuild) => {
    setBuildName(b.name);
    setActivity(b.activity);
    setGlobalTier(b.tier);
    setNotes(b.notes || '');
    setSlots(b.slots);
    setPricingResult(null);
  };

  const handleSelectPickerItem = (item: AlbionItem) => {
    if (!activePickerSlot) return;

    let finalId = item.id;
    // Replace tier if applicable
    if (finalId.startsWith('T') && !finalId.startsWith('UNIQUE_')) {
      finalId = finalId.replace(/^T[1-8]_/, `T${pickerTier}_`);
    } else if (!finalId.startsWith('UNIQUE_')) {
      finalId = `T${pickerTier}_${finalId}`;
    }

    if (pickerEnchant > 0) {
      finalId = `${finalId}@${pickerEnchant}`;
    }

    setSlots(prev => ({
      ...prev,
      [activePickerSlot.key]: {
        itemId: finalId,
        namePt: item.name,
        nameEn: item.nameEn || item.name,
        tier: pickerTier,
        enchantment: pickerEnchant,
        category: item.category
      }
    }));

    setActivePickerSlot(null);
    setPickerSearch('');
  };

  const handleClearSlot = (slotKey: SlotKey) => {
    setSlots(prev => ({ ...prev, [slotKey]: null }));
    setPricingResult(null);
  };

  const handleCalculateMarketPrice = async () => {
    setCalculatingPrice(true);
    try {
      const itemsToPrice: { id: string; name: string }[] = [];
      Object.values(slots).forEach((slotItem) => {
        const item = slotItem as CustomBuildSlotItem | null;
        if (item) {
          itemsToPrice.push({ id: item.itemId, name: item.namePt });
        }
      });

      if (itemsToPrice.length === 0) {
        setCalculatingPrice(false);
        return;
      }

      const res = await calculateBuildMarketCost(
        itemsToPrice,
        marketServer,
        marketCity,
        1
      );
      setPricingResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculatingPrice(false);
    }
  };

  const handleCopySummary = () => {
    const lines = [
      `🏰 Minha Build Albion Online: ${buildName}`,
      `Atividade: ${activity.toUpperCase()} | Tier Base: T${globalTier}`,
      notes ? `Notas: ${notes}` : '',
      '--- Equipamentos ---',
      ...SLOTS_CONFIG.map(s => {
        const item = slots[s.key];
        return `• ${s.label}: ${item ? `${item.namePt} (${item.nameEn}) [${item.itemId}]` : 'Vazio'}`;
      })
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    });
  };

  const pickerItems = activePickerSlot 
    ? filterItemsByCategory(catalog, activePickerSlot.category, pickerSearch).slice(0, 40)
    : [];

  return (
    <div className="space-y-6">
      
      {/* Creator Top Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Criador de Builds Personalizadas</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Monte seu conjunto de equipamentos, consulte os custos em tempo real nas cidades de Albion e salve para fácil acesso.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-save-custom-build"
              onClick={saveCustomBuild}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Build Salva!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Build</span>
                </>
              )}
            </button>

            <button
              id="btn-copy-custom-build-summary"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedSummary ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>
        </div>

        {/* Name and Meta Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
              Nome da Build
            </label>
            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400 font-semibold"
              placeholder="Ex: Machado de Guerra Caçador Caerleon..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
              Atividade Recomendada
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as CustomBuild['activity'])}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400 font-semibold"
            >
              <option value="1v1">Solo / Duelos (1v1)</option>
              <option value="gank">Pequenos Grupos / Gank</option>
              <option value="zvz">Grandes Batalhas (ZvZ)</option>
              <option value="pve">Masmorras & PvE</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
              Tier Padrão
            </label>
            <select
              value={globalTier}
              onChange={(e) => setGlobalTier(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-400 font-semibold"
            >
              {[4, 5, 6, 7, 8].map(t => (
                <option key={t} value={t}>Tier {t} (T{t})</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Estratégia / Dicas de Combate (Opcional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
            placeholder="Ex: Focar no sangramento e usar o casaco para resetar o tempo de recarga..."
          />
        </div>
      </div>

      {/* Slots Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {SLOTS_CONFIG.map((slot) => {
          const item = slots[slot.key];
          const Icon = slot.icon;

          return (
            <div
              key={slot.key}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                item 
                  ? 'bg-zinc-900/80 border-amber-500/30 hover:border-amber-500/60 shadow-lg' 
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {item ? (
                  <ItemImage
                    itemId={item.itemId}
                    tier={item.tier}
                    enchantment={item.enchantment}
                    size="md"
                    showTierBadge={true}
                    alt={item.namePt}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                    {slot.label}
                  </div>
                  {item ? (
                    <>
                      <div className="text-xs font-bold text-zinc-100 truncate" title={item.namePt}>
                        {item.namePt}
                      </div>
                      <div className="text-[10px] text-zinc-400 italic truncate" title={item.nameEn}>
                        {item.nameEn}
                      </div>
                      <div className="text-[9px] font-mono text-zinc-500">
                        T{item.tier}{item.enchantment > 0 ? `.${item.enchantment}` : ''}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-zinc-500 italic mt-0.5">
                      Nenhum item equipado
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => {
                    setActivePickerSlot(slot);
                    setPickerTier(globalTier);
                    setPickerEnchant(0);
                    setPickerSearch('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  {item ? 'Trocar' : 'Equipar'}
                </button>

                {item && (
                  <button
                    onClick={() => handleClearSlot(slot.key)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Remover item do slot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Market Cost Estimator */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Orçamento da Build Customizada no Mercado</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Obtém os valores reais dos equipamentos montados no Albion Online Data Project.
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
              <option value="Todas">Todas as Cidades</option>
              {((MARKET_LOCATIONS[marketServer] || MARKET_LOCATIONS.americas) as string[]).map((c) => (
                <option key={c} value={c}>
                  {getCityDisplayName(c)}
                </option>
              ))}
            </select>

            <button
              id="btn-calculate-custom-build-cost"
              onClick={handleCalculateMarketPrice}
              disabled={calculatingPrice}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${calculatingPrice ? 'animate-spin' : ''}`} />
              <span>{calculatingPrice ? 'Calculando...' : 'Calcular Custo'}</span>
            </button>
          </div>
        </div>

        {pricingResult && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {pricingResult.items.map((it) => (
                <div
                  key={it.itemId}
                  className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
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
                Itens precificados:{' '}
                <strong className="text-amber-300">
                  {pricingResult.availableItemsCount} de {pricingResult.totalItemsCount}
                </strong>
                {!pricingResult.allPriced && (
                  <span className="text-zinc-500 ml-1">
                    (itens sem preços no mercado não alteram o total)
                  </span>
                )}
              </div>

              <div className="text-base sm:text-lg font-mono font-bold text-amber-400">
                Total Estimado: {pricingResult.totalSellCost.toLocaleString()} Prata
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Custom Builds List */}
      {savedBuilds.length > 0 && (
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <h4 className="font-cinzel text-base font-bold text-white">
            Suas Builds Salvas Localmente ({savedBuilds.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedBuilds.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 uppercase">
                      {b.activity}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Tier {b.tier}
                    </span>
                  </div>
                  <div className="font-bold text-zinc-100 text-sm">{b.name}</div>
                  {b.notes && <div className="text-xs text-zinc-400 mt-1 line-clamp-2">{b.notes}</div>}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                  <button
                    onClick={() => loadSavedBuild(b)}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Carregar no Editor
                  </button>

                  <button
                    onClick={() => deleteCustomBuild(b.id)}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Excluir build salva"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Picker Modal */}
      {activePickerSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div 
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <div>
                <h4 className="font-cinzel text-base sm:text-lg font-bold text-white">
                  Equipar: {activePickerSlot.label}
                </h4>
                <p className="text-xs text-zinc-400">
                  Categoria: {activePickerSlot.category}
                </p>
              </div>

              <button
                onClick={() => setActivePickerSlot(null)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Controls (Tier, Enchantment, Search) */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder={`Buscar item em ${activePickerSlot.category}...`}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-zinc-400 text-[11px]">Tier:</span>
                  {[4, 5, 6, 7, 8].map(t => (
                    <button
                      key={t}
                      onClick={() => setPickerTier(t)}
                      className={`px-2 py-0.5 rounded font-mono font-bold cursor-pointer transition-colors ${
                        pickerTier === t ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      T{t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-zinc-400 text-[11px]">Encanto:</span>
                  {[0, 1, 2, 3].map(enc => (
                    <button
                      key={enc}
                      onClick={() => setPickerEnchant(enc)}
                      className={`px-2 py-0.5 rounded font-mono font-bold cursor-pointer transition-colors ${
                        pickerEnchant === enc ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      .{enc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Item List Results */}
            <div className="p-4 overflow-y-auto max-h-96 space-y-2">
              {pickerItems.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  Nenhum item encontrado nesta categoria. Tente alterar o termo de busca.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pickerItems.map((item) => {
                    const tieredId = item.id.replace(/^T[1-8]_/, `T${pickerTier}_`);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectPickerItem(item)}
                        className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/50 flex items-center gap-3 cursor-pointer transition-all"
                      >
                        <ItemImage
                          itemId={tieredId}
                          tier={pickerTier}
                          enchantment={pickerEnchant}
                          size="sm"
                          alt={item.name}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-zinc-200 text-xs truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-zinc-400 italic truncate">
                            {item.nameEn || item.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
