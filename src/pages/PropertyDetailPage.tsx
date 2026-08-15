import React from 'react';
import { Property, ValuationResult, ComparableProperty } from '../types';
import { ValuationGauge } from '../components/ValuationGauge';
import { XaiWaterfallChart } from '../components/XaiWaterfallChart';
import { MapView } from '../components/MapView';
import { MortgageCalculator } from '../components/MortgageCalculator';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Bookmark,
  Share2,
  Bot,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface PropertyDetailPageProps {
  property: Property;
  valuation: ValuationResult;
  comparables: ComparableProperty[];
  onSavePortfolio: (valuation: ValuationResult) => void;
  onNavigate: (page: string) => void;
  isSaved?: boolean;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  valuation,
  comparables,
  onSavePortfolio,
  onNavigate,
  isSaved = false
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Property Hero Section */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white min-h-[300px] flex flex-col justify-between p-6 sm:p-8 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent z-10" />
        <img
          src={property.image}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top Badges */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-bold shadow-sm">
              {property.property_type}
            </span>
            <span className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold shadow-sm">
              AI Valued
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSavePortfolio(valuation)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all shadow-sm ${
                isSaved
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/90 text-slate-800 hover:bg-white border border-slate-200'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current text-blue-600" />
              <span>{isSaved ? 'Saved in Portfolio' : 'Save Property'}</span>
            </button>
          </div>
        </div>

        {/* Title & Specs */}
        <div className="relative z-20 space-y-3 pt-12">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{property.title}</h1>
          <div className="flex items-center gap-2 text-slate-200 text-xs">
            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>{property.address}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-100 font-medium">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-700/80 backdrop-blur-sm">
              <Bed className="w-4 h-4 text-blue-400" />
              <span>{property.bedrooms} BHK</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-700/80 backdrop-blur-sm">
              <Bath className="w-4 h-4 text-blue-400" />
              <span>{property.bathrooms} Bathrooms</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-700/80 backdrop-blur-sm">
              <Maximize2 className="w-4 h-4 text-blue-400" />
              <span>{property.area_sqft} sq.ft</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-700/80 backdrop-blur-sm">
              <span>{property.furnished}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Valuation Gauge */}
      <ValuationGauge valuation={valuation} />

      {/* Interactive Mortgage EMI Calculator */}
      <MortgageCalculator
        propertyPrice={valuation?.estimated_value || property.price}
        rentalEstimate={property.rental_estimate}
        areaSqft={property.area_sqft}
        localityName={property.locality}
      />

      {/* XAI Attribution Chart */}
      <XaiWaterfallChart
        contributions={valuation.feature_contributions}
        explanation={valuation.valuation_explanation}
      />

      {/* Map Location */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Geospatial Map Location</span>
        </h3>
        <div className="h-64 border border-slate-200 rounded-lg overflow-hidden">
          <MapView
            properties={[property]}
            selectedProperty={property}
            center={[property.latitude, property.longitude]}
            zoom={14}
          />
        </div>
      </div>
    </div>
  );
};
