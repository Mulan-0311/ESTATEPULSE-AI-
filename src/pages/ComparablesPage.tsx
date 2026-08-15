import React from 'react';
import { Property, ComparableProperty } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { GitCompare, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface ComparablesPageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const ComparablesPage: React.FC<ComparablesPageProps> = ({ properties, onSelectProperty }) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">Smart Comparable Property Engine</h1>
        </div>
        <p className="text-xs text-slate-400">
          Cosine vector similarity algorithm matching properties based on geographical proximity, square footage scale, bedroom layout, and construction age.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex justify-between items-center">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Benchmark Property</span>
              </div>
              <span className="text-slate-400">{property.locality}</span>
            </div>
            <PropertyCard
              property={property}
              onSelect={onSelectProperty}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
