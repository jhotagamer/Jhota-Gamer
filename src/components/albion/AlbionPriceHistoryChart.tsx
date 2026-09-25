import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { AlbionServer, AlbionHistoryEntry } from '../../types/albionMarket';
import { fetchPriceHistory, formatSilver } from '../../services/albionMarketApi';
import { Loader2, TrendingUp, AlertCircle, Calendar } from 'lucide-react';

interface AlbionPriceHistoryChartProps {
  itemId: string;
  server: AlbionServer;
  selectedCity: string;
}

export const AlbionPriceHistoryChart: React.FC<AlbionPriceHistoryChartProps> = ({
  itemId,
  server,
  selectedCity
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '14d'>('7d');
  const [loading, setLoading] = useState<boolean>(true);
  const [historyEntries, setHistoryEntries] = useState<AlbionHistoryEntry[]>([]);
  const [chartCity, setChartCity] = useState<string>(selectedCity !== 'Todas' ? selectedCity : 'Caerleon');

  // Load history from API
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setLoading(true);
      // time-scale 1 for 24h, 24 for 7d & 14d
      const timeScale = timeRange === '24h' ? 1 : 24;
      const data = await fetchPriceHistory(itemId, server, undefined, 1, timeScale);
      
      if (!isCancelled) {
        setHistoryEntries(data);
        setLoading(false);
        // If current chartCity is not in available locations, pick the first available
        if (data.length > 0) {
          const availableCities = data.map(d => d.location);
          if (!availableCities.includes(chartCity)) {
            setChartCity(availableCities[0]);
          }
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [itemId, server, timeRange]);

  // Keep chartCity synced if selectedCity changes from parent and exists in data
  useEffect(() => {
    if (selectedCity !== 'Todas') {
      setChartCity(selectedCity);
    }
  }, [selectedCity]);

  // Filter entry for selected city
  const activeEntry = historyEntries.find(
    e => e.location.toLowerCase() === chartCity.toLowerCase()
  ) || historyEntries[0];

  // Prepare chart points
  const rawPoints = activeEntry?.data || [];
  
  // Slice points based on timeRange
  const points = React.useMemo(() => {
    if (!rawPoints || rawPoints.length === 0) return [];

    let limit = rawPoints.length;
    if (timeRange === '24h') limit = 24;
    else if (timeRange === '7d') limit = 7;
    else if (timeRange === '14d') limit = 14;

    const sliced = rawPoints.slice(-limit);

    return sliced.map((pt) => {
      let label = '';
      try {
        const d = new Date(pt.timestamp.endsWith('Z') ? pt.timestamp : `${pt.timestamp}Z`);
        if (timeRange === '24h') {
          label = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else {
          label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }
      } catch {
        label = pt.timestamp.split('T')[0] || '';
      }

      return {
        timestamp: pt.timestamp,
        dateLabel: label,
        price: pt.avg_price,
        volume: pt.item_count
      };
    });
  }, [rawPoints, timeRange]);

  const availableCities = historyEntries.map(e => e.location);

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 sm:p-5">
      {/* Header with Time Range & City Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-bold text-white font-rajdhani uppercase tracking-wider">
            Histórico de Preços
          </h4>
          {chartCity && (
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-[11px] font-semibold text-amber-300">
              {chartCity}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* City selector dropdown if multiple available */}
          {availableCities.length > 1 && (
            <select
              value={chartCity}
              onChange={(e) => setChartCity(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          )}

          {/* Time scale buttons */}
          <div className="flex items-center rounded-lg bg-zinc-900 p-0.5 border border-zinc-800">
            {(['24h', '7d', '14d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-amber-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {range === '24h' ? '24 Horas' : range === '7d' ? '7 Dias' : '14 Dias'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 w-full relative">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <span>Consultando histórico no Albion Data Project...</span>
          </div>
        ) : points.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-500 text-xs text-center p-4">
            <AlertCircle className="w-6 h-6 text-zinc-600" />
            <span>Sem histórico registrado para este item neste servidor/período recente.</span>
            <span className="text-[11px] text-zinc-600">
              O Albion Data Project registra transações coletadas pela comunidade através do cliente de dados.
            </span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="albionPriceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="dateLabel" 
                stroke="#71717a" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={11} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-zinc-900 border border-amber-500/40 rounded-xl p-3 shadow-xl backdrop-blur-md">
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>{data.timestamp?.split('T')[0] || data.dateLabel}</span>
                        </div>
                        <div className="text-sm font-bold text-amber-300">
                          Preço Médio: {formatSilver(data.price)} Prata
                        </div>
                        {data.volume > 0 && (
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            Volume negociado: {data.volume.toLocaleString('pt-BR')} un.
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#f59e0b" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#albionPriceGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Dados reais do Albion Data Project</span>
        <span>Eixo: Prata x Tempo ({timeRange})</span>
      </div>
    </div>
  );
};
