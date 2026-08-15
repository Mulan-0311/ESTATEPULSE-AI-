import React, { useState } from 'react';
import { ValuationResult, ComparableProperty, Property } from '../types';
import { ValuationGauge } from '../components/ValuationGauge';
import { XaiWaterfallChart } from '../components/XaiWaterfallChart';
import { PropertyCard } from '../components/PropertyCard';
import { ReportModal } from '../components/ReportModal';
import { MortgageCalculator } from '../components/MortgageCalculator';
import {
  Sparkles,
  FileSpreadsheet,
  Bookmark,
  Bot,
  GitCompare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface ValuationResultPageProps {
  valuation: ValuationResult;
  comparables: ComparableProperty[];
  onSavePortfolio: (valuation: ValuationResult) => void;
  onNavigate: (page: string) => void;
  onSelectProperty: (property: Property) => void;
  isSaved?: boolean;
}

export const ValuationResultPage: React.FC<ValuationResultPageProps> = ({
  valuation,
  comparables,
  onSavePortfolio,
  onNavigate,
  onSelectProperty,
  isSaved = false
}) => {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded uppercase">
              XGBoost Predictive Valuation
            </span>
            <span className="text-xs text-slate-400">
              {valuation.property_input.bedrooms} BHK {valuation.property_input.property_type} in {valuation.property_input.locality}, {valuation.property_input.city}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">AI Valuation & Market Analysis Audit</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSavePortfolio(valuation)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isSaved
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span>{isSaved ? 'Saved in Portfolio' : 'Save Property'}</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Generate Official Report</span>
          </button>

          <button
            onClick={() => onNavigate('advisor')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs border border-slate-700 transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Ask Pulse Advisor</span>
          </button>
        </div>
      </div>

      {/* Main Valuation Display Gauge */}
      <ValuationGauge valuation={valuation} />

      {/* Grid: XAI Feature Attribution + AI Recommendations */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <XaiWaterfallChart
            contributions={valuation.feature_contributions}
            explanation={valuation.valuation_explanation}
          />
        </div>

        {/* Positives & Considerations */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Positive Value Premium Drivers</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              {valuation.top_positives.map((pos, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 leading-relaxed">
                  {pos}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Value Depreciation Adjustments</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              {valuation.top_negatives.map((neg, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 leading-relaxed">
                  {neg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Mortgage & EMI Financing Plan */}
      <MortgageCalculator
        propertyPrice={valuation.estimated_value}
        rentalEstimate={valuation.rental_estimate}
        areaSqft={valuation.property_input.area_sqft}
        localityName={valuation.property_input.locality}
      />

      {/* Comparable Properties Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Benchmark Comparable Transactions</h2>
            <p className="text-xs text-slate-400">
              Properties matched by location proximity, area scale, and bedroom specs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('comparables')}
            className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All Comparables</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {comparables.slice(0, 3).map((comp, idx) => (
            <div key={idx} className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex justify-between items-center">
                <span className="font-bold text-emerald-400">{comp.similarity_score}% Match Similarity</span>
                <span className="text-slate-400">{comp.distance_km} km away</span>
              </div>
              <PropertyCard
                property={comp.property}
                onSelect={onSelectProperty}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Official Report Modal */}
      {showReportModal && (
        <ReportModal
          valuation={valuation}
          comparables={comparables}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
