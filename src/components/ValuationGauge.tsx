import React from 'react';
import { ValuationResult } from '../types';
import { ShieldCheck, TrendingUp, DollarSign, Award } from 'lucide-react';

interface ValuationGaugeProps {
  valuation: ValuationResult;
}

export const ValuationGauge: React.FC<ValuationGaugeProps> = ({ valuation }) => {
  const formattedValuation = `₹${(valuation.estimated_value / 10000000).toFixed(2)} Cr`;
  const formattedLower = `₹${(valuation.lower_range / 10000000).toFixed(2)} Cr`;
  const formattedUpper = `₹${(valuation.upper_range / 10000000).toFixed(2)} Cr`;

  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            AI Predicted Market Value
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {formattedValuation}
          </h2>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 font-medium">Price per sq.ft</div>
          <div className="text-lg font-bold text-slate-800">
            ₹{valuation.price_per_sqft.toLocaleString('en-IN')}/sq.ft
          </div>
        </div>
      </div>

      {/* Confidence Range Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-500">
          <span>Lower Bound: {formattedLower}</span>
          <span className="text-blue-600 font-bold">Reliable Estimate (±4.2%)</span>
          <span>Upper Bound: {formattedUpper}</span>
        </div>
        <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full w-full" />
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white shadow-md" />
        </div>
      </div>

      {/* Key Metric Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Reliability Score</span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            {valuation.reliability_score} / 100
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Investment Score</span>
          </div>
          <div className="text-lg font-bold text-emerald-700">
            {valuation.investment_score} / 100
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>Est. Monthly Rent</span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            ₹{valuation.rental_estimate.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Annual Growth</span>
          </div>
          <div className="text-lg font-bold text-indigo-700">
            +{valuation.annual_appreciation_pct}%
          </div>
        </div>
      </div>
    </div>
  );
};
