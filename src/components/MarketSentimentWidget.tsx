import React, { useState, useMemo } from 'react';
import { LocalitySentimentData } from '../types';
import { SENTIMENT_DATA_MAP } from '../data/sentimentData';
import {
  TrendingUp,
  Search,
  Receipt,
  Users,
  Clock,
  Sparkles,
  ArrowUpRight,
  Flame,
  Activity,
  CheckCircle2,
  BarChart2,
  Layers,
  Building2,
  Calendar,
  Zap,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface MarketSentimentWidgetProps {
  initialLocality?: string;
  onNavigate?: (page: string) => void;
}

export const MarketSentimentWidget: React.FC<MarketSentimentWidgetProps> = ({
  initialLocality = 'Baner',
  onNavigate
}) => {
  const localities = Object.keys(SENTIMENT_DATA_MAP);
  const [selectedLocality, setSelectedLocality] = useState<string>(
    SENTIMENT_DATA_MAP[initialLocality] ? initialLocality : localities[0]
  );
  const [activeView, setActiveView] = useState<'trends' | 'transactions' | 'drivers'>('trends');

  const currentData: LocalitySentimentData = useMemo(() => {
    return SENTIMENT_DATA_MAP[selectedLocality] || SENTIMENT_DATA_MAP['Baner'];
  }, [selectedLocality]);

  // Color mapping based on sentiment score
  const getSentimentColor = (score: number) => {
    if (score >= 85) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' };
    if (score >= 70) return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500' };
    if (score >= 50) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' };
    return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-500' };
  };

  const sentimentTheme = getSentimentColor(currentData.sentiment_score);

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-800 font-sans">
      {/* Top Header & Locality Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Market Sentiment & Buyer Interest Index
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  <Flame className="w-3 h-3 text-blue-600" />
                  Live Signals
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Machine learning synthesis of real-time search volume, inquiry velocity, and registered transaction deeds.
              </p>
            </div>
          </div>
        </div>

        {/* Locality Quick Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {localities.map((loc) => {
            const data = SENTIMENT_DATA_MAP[loc];
            const isSelected = selectedLocality === loc;
            return (
              <button
                key={loc}
                onClick={() => setSelectedLocality(loc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <span>{loc}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-extrabold ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {data.sentiment_score}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main KPI & Sentiment Gauge Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Sentiment Gauge & Score Card (4 Cols) */}
        <div className={`md:col-span-4 p-5 rounded-2xl ${sentimentTheme.bg} border ${sentimentTheme.border} flex flex-col justify-between space-y-4`}>
          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                Buyer Sentiment Score
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-white/90 text-slate-800 rounded-md border border-slate-200 shadow-2xs">
                {currentData.sentiment_momentum}
              </span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                {currentData.sentiment_score}
              </span>
              <span className="text-slate-400 font-bold text-sm">/ 100</span>
              <span className={`ml-auto font-black text-xs px-2.5 py-1 rounded-lg ${sentimentTheme.bg} ${sentimentTheme.text} border ${sentimentTheme.border}`}>
                {currentData.sentiment_label}
              </span>
            </div>
          </div>

          {/* Sentiment Meter Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>Cooling (0-40)</span>
              <span>Balanced (50-70)</span>
              <span>Bullish (80-100)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${sentimentTheme.bar} transition-all duration-500`}
                style={{ width: `${currentData.sentiment_score}%` }}
              />
            </div>
          </div>

          {/* Core Signals Snapshot */}
          <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-slate-500 font-medium block">Search Velocity</span>
              <span className="font-black text-slate-900 text-sm">
                +{(currentData.search_growth_mom).toFixed(1)}%
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">MoM Surge</span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-slate-500 font-medium block">Buyer Competition</span>
              <span className="font-black text-slate-900 text-sm">
                {currentData.buyer_to_seller_ratio} : 1
              </span>
              <span className="text-[10px] text-blue-600 font-bold block">Buyers / Listing</span>
            </div>
          </div>
        </div>

        {/* Right 4 Key Driver Cards (8 Cols) */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Weekly Search Inquiries */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-blue-100/70 text-blue-600">
                <Search className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                +{currentData.search_growth_mom}%
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {(currentData.weekly_search_volume / 1000).toFixed(1)}k
              </div>
              <div className="text-[11px] font-bold text-slate-600">Weekly Searches</div>
              <div className="text-[10px] text-slate-400">High intent queries</div>
            </div>
          </div>

          {/* Card 2: Registered Transactions (Deeds) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-indigo-100/70 text-indigo-600">
                <Receipt className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                30-Day
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {currentData.recent_transactions_count}
              </div>
              <div className="text-[11px] font-bold text-slate-600">Deeds Registered</div>
              <div className="text-[10px] text-slate-400">Sub-registrar verified</div>
            </div>
          </div>

          {/* Card 3: Days on Market */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-amber-100/70 text-amber-600">
                <Clock className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                Fast Pace
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {currentData.avg_days_on_market}
              </div>
              <div className="text-[11px] font-bold text-slate-600">Avg Days on Market</div>
              <div className="text-[10px] text-slate-400">Listing to closure</div>
            </div>
          </div>

          {/* Card 4: Asking Price Realization */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-emerald-100/70 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                High
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {currentData.asking_price_realization}%
              </div>
              <div className="text-[11px] font-bold text-slate-600">Price Realization</div>
              <div className="text-[10px] text-slate-400">Deal-to-ask price ratio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-view Navigation Bar */}
      <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
          <button
            onClick={() => setActiveView('trends')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'trends'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Search Volume & Transaction Trends</span>
          </button>
          <button
            onClick={() => setActiveView('transactions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'transactions'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-indigo-600" />
            <span>Recent Deed Registrations ({currentData.recent_deeds.length})</span>
          </button>
          <button
            onClick={() => setActiveView('drivers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'drivers'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Sentiment Drivers</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Benchmark Locality: <strong className="text-slate-800">{currentData.locality}, {currentData.city}</strong>
        </div>
      </div>

      {/* VIEW 1: DUAL-AXIS SEARCH VOLUME & TRANSACTION TRENDS */}
      {activeView === 'trends' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-bold text-slate-800">
                Buyer Search Volume vs. Registered Transactions (5-Month Trajectory)
              </span>
              <p className="text-[11px] text-slate-500">
                Correlating online search queries with actual offline stamp-duty deeds and sentiment index.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span>Search Volume</span>
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                <span>Deeds Closed</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-1 rounded-full bg-emerald-500" />
                <span>Sentiment Index</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full bg-slate-50/50 p-3 rounded-xl border border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentData.trend_history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                <YAxis
                  yAxisId="left"
                  stroke="#3b82f6"
                  fontSize={11}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6366f1"
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="search_volume"
                  fill="#3b82f6"
                  opacity={0.85}
                  radius={[4, 4, 0, 0]}
                  name="Search Volume"
                />
                <Bar
                  yAxisId="right"
                  dataKey="transactions"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Transactions"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sentiment_index"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  name="Sentiment Index"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* VIEW 2: RECENT DEED REGISTRATIONS LEDGER */}
      {activeView === 'transactions' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">
              Verified Stamp-Duty Deed Registrations in {currentData.locality}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Source: Sub-Registrar / IGR Office Records
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Project / Society</th>
                  <th className="py-2.5 px-3">Unit Configuration</th>
                  <th className="py-2.5 px-3">Carpet Area</th>
                  <th className="py-2.5 px-3">Transacted Value</th>
                  <th className="py-2.5 px-3">Rate / Sq.Ft</th>
                  <th className="py-2.5 px-3 text-right">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {currentData.recent_deeds.map((deed) => (
                  <tr key={deed.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>{deed.project_name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{deed.unit_type}</td>
                    <td className="py-2.5 px-3 text-slate-600">{deed.area_sqft} sq.ft</td>
                    <td className="py-2.5 px-3 font-black text-slate-900">
                      {formatINR(deed.transacted_price)}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-blue-600">
                      ₹{deed.price_sqft.toLocaleString('en-IN')}/sq.ft
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 font-semibold">
                      {deed.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: AI SENTIMENT DRIVERS */}
      {activeView === 'drivers' && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {currentData.sentiment_drivers.map((drv, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{drv.factor}</span>
                </span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                  drv.impact === 'positive'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {drv.impact}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {drv.detail}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* AI Sentiment Summary Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30">
            <Zap className="w-4 h-4 text-blue-400" />
          </span>
          <div>
            <span className="font-extrabold text-blue-300">AI Market Outlook: </span>
            <span className="text-slate-300">
              {currentData.locality} is exhibiting <strong className="text-white">{currentData.sentiment_label}</strong> with a sentiment score of <strong className="text-emerald-400">{currentData.sentiment_score}/100</strong>. High search volume ({currentData.weekly_search_volume.toLocaleString('en-IN')}/wk) combined with short {currentData.avg_days_on_market} DOM signals persistent upward pricing pressure.
            </span>
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('market')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all flex-shrink-0 self-start sm:self-auto"
          >
            <span>Explore Heatmap</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
