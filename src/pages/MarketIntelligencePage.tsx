import React, { useState } from 'react';
import { Property, NeighborhoodData } from '../types';
import { MapView } from '../components/MapView';
import { PropertyCard } from '../components/PropertyCard';
import { Compass, Filter, TrendingUp, ShieldCheck, Award, MapPin } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface MarketIntelligencePageProps {
  properties: Property[];
  neighborhoods: NeighborhoodData[];
  onSelectProperty: (property: Property) => void;
}

export const MarketIntelligencePage: React.FC<MarketIntelligencePageProps> = ({
  properties,
  neighborhoods,
  onSelectProperty
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodData | null>(neighborhoods[0] || null);

  const filteredProperties = properties.filter((p) => {
    if (selectedCity !== 'All' && p.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (selectedType !== 'All' && p.property_type.toLowerCase() !== selectedType.toLowerCase()) return false;
    return true;
  });

  const barChartData = neighborhoods.map((n) => ({
    name: n.locality,
    Rate: n.average_price_per_sqft,
    Growth: n.annual_growth,
    Yield: n.rental_yield
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filter Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white">Market Intelligence & Heatmaps</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Geospatial property pricing, neighborhood investment scores, and rental yield distribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filters:</span>
            </span>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Cities</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map + Locality Detail Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2 h-[520px]">
          <MapView
            properties={filteredProperties}
            neighborhoods={neighborhoods}
            onSelectProperty={onSelectProperty}
            onSelectNeighborhood={setSelectedNeighborhood}
            center={
              selectedNeighborhood
                ? [selectedNeighborhood.latitude, selectedNeighborhood.longitude]
                : selectedCity === 'Mumbai'
                ? [19.1136, 72.8697]
                : selectedCity === 'Bengaluru'
                ? [12.9716, 77.6412]
                : selectedCity === 'Hyderabad'
                ? [17.44, 78.3489]
                : selectedCity === 'Delhi NCR'
                ? [28.4595, 77.0266]
                : [18.559, 73.7788]
            }
            zoom={selectedCity === 'All' ? 11 : 12}
            heightClass="h-[520px]"
          />
        </div>

        {/* Selected Locality Audit Panel */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
          {selectedNeighborhood ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded uppercase">
                    Locality Benchmark
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedNeighborhood.locality}, {selectedNeighborhood.city}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-cyan-400">
                    {selectedNeighborhood.investment_score}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/ 100 Score</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNeighborhood.summary}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block">Avg Rate / Sq.Ft</span>
                  <span className="font-bold text-slate-100">
                    ₹{selectedNeighborhood.average_price_per_sqft.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block">Annual Appreciation</span>
                  <span className="font-bold text-emerald-400">
                    +{selectedNeighborhood.annual_growth}%
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block">Rental Yield</span>
                  <span className="font-bold text-amber-400">
                    {selectedNeighborhood.rental_yield}%
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block">Safety Score</span>
                  <span className="font-bold text-indigo-400">
                    {selectedNeighborhood.safety_score} / 100
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">Key Locality Landmarks:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNeighborhood.nearby_landmarks.map((lm, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                      {lm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-xs">Select a locality marker to view detailed analytics.</div>
          )}

          <div className="pt-3 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">Switch Locality:</span>
            <div className="flex flex-wrap gap-1.5">
              {neighborhoods.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNeighborhood(n)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    selectedNeighborhood?.id === n.id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-500 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {n.locality}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Locality Comparison Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">Cross-Locality Rate & Yield Comparison</h3>
          <p className="text-xs text-slate-400">Compare average square footage price benchmarks against annual rental yields.</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis yAxisId="left" orientation="left" stroke="#06b6d4" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="Rate" fill="#06b6d4" name="Price / Sq.Ft (INR)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="Yield" fill="#10b981" name="Rental Yield (%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100">Properties in Selected Market ({filteredProperties.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
