import React from 'react';
import { StatCard } from '../components/StatCard';
import { PropertyCard } from '../components/PropertyCard';
import { MarketSentimentWidget } from '../components/MarketSentimentWidget';
import { Property, ValuationResult, NeighborhoodData } from '../types';
import {
  TrendingUp,
  Building2,
  Award,
  Sparkles,
  ArrowUpRight,
  Compass,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface DashboardPageProps {
  properties: Property[];
  neighborhoods: NeighborhoodData[];
  onSelectProperty: (property: Property) => void;
  onNavigate: (page: string) => void;
  onExploreDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  properties,
  neighborhoods,
  onSelectProperty,
  onNavigate,
  onExploreDemo
}) => {
  const chartData = [
    { year: '2022', Baner: 6800, Powai: 20200, Whitefield: 8400, Gachibowli: 8200 },
    { year: '2023', Baner: 7350, Powai: 21500, Whitefield: 9100, Gachibowli: 9100 },
    { year: '2024', Baner: 7900, Powai: 22600, Whitefield: 9800, Gachibowli: 9900 },
    { year: '2025', Baner: 8250, Powai: 23500, Whitefield: 10200, Gachibowli: 10500 },
    { year: '2026', Baner: 8650, Powai: 24200, Whitefield: 10800, Gachibowli: 11000 }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Market Intelligence Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Real Estate Analytics & Market Pulse</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time machine learning predictive estimates and neighborhood capital trends.
          </p>
        </div>

        <button
          onClick={onExploreDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Preset Demo</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Market Momentum"
          value="+8.4% YoY"
          subtitle="Baner-Balewadi Corridor"
          change="+1.2% Q2"
          isPositive={true}
          icon={TrendingUp}
          badge="High Demand"
        />
        <StatCard
          title="Avg Rate / Sq.Ft"
          value="₹8,650"
          subtitle="Pune Benchmark"
          change="+6.2%"
          isPositive={true}
          icon={Building2}
        />
        <StatCard
          title="Average Rental Yield"
          value="4.6%"
          subtitle="Suburban IT Hubs"
          change="Top Tier"
          isPositive={true}
          icon={Award}
        />
        <StatCard
          title="ML Model Accuracy"
          value="0.956 R²"
          subtitle="XGBoost Ensemble"
          change="Verified"
          isPositive={true}
          icon={BarChart3}
          badge="XGBoost"
        />
      </div>

      {/* AI Market Insight Ticker */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-slate-800">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 font-extrabold bg-blue-600 text-white rounded text-[10px]">
            AI SIGNAL
          </span>
          <span>
            Baner 3BHK residential inventory absorption is running 14% faster than city average, signaling strong capital growth momentum for Q3 2026.
          </span>
        </div>
        <button
          onClick={() => onNavigate('market')}
          className="hidden md:flex items-center gap-1 font-bold text-blue-600 hover:underline flex-shrink-0"
        >
          <span>Explore Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Market Sentiment & Local Buyer Interest Trends Widget */}
      <MarketSentimentWidget onNavigate={onNavigate} />

      {/* Main Grid: Chart + Top Opportunities */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Market Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Property Rate Trends (₹/sq.ft)</h3>
              <p className="text-xs text-slate-500 font-medium">Historical & AI projected rate trajectories across premier metro hubs</p>
            </div>
            <button
              onClick={() => onNavigate('market')}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBaner" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.5rem', color: '#0f172a' }}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Baner" stroke="#2563eb" fillOpacity={1} fill="url(#colorBaner)" name="Baner, Pune" />
                <Area type="monotone" dataKey="Whitefield" stroke="#059669" fillOpacity={0.1} fill="#059669" name="Whitefield, Blr" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Neighborhood Highlights */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Locality Benchmark Scores</h3>
          <p className="text-xs text-slate-500 font-medium">Neighborhood investment scores combining safety, growth, and yield.</p>

          <div className="space-y-3">
            {neighborhoods.slice(0, 4).map((n) => (
              <div key={n.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{n.locality}, {n.city}</span>
                  <span className="font-extrabold text-blue-600">{n.investment_score} / 100</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Avg Rate: ₹{n.average_price_per_sqft.toLocaleString('en-IN')}/sq.ft</span>
                  <span className="text-emerald-600 font-semibold">+{n.annual_growth}% YoY</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Top Investment Opportunities</h2>
            <p className="text-xs text-slate-500 font-medium">AI-screened properties with high predicted capital appreciation and rental yield.</p>
          </div>
          <button
            onClick={() => onNavigate('comparables')}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Explore All Properties
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.slice(0, 3).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
