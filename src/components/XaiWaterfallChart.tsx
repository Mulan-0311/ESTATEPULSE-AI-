import React from 'react';
import { FeatureContribution } from '../types';
import { HelpCircle, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface XaiWaterfallChartProps {
  contributions: FeatureContribution[];
  explanation: string;
}

export const XaiWaterfallChart: React.FC<XaiWaterfallChartProps> = ({ contributions, explanation }) => {
  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Explainable AI (XAI) Valuation Drivers</span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200 rounded-md">
              SHAP Attribution
            </span>
          </h3>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Quantified feature contributions that pushed the property valuation above or below baseline.
        </p>
      </div>

      {/* Waterfall Contribution List */}
      <div className="space-y-3">
        {contributions.map((item, index) => {
          const isPos = item.impact_amount >= 0;
          const formattedAmount = `${isPos ? '+' : ''}₹${(Math.abs(item.impact_amount) / 100000).toFixed(2)} Lakhs`;
          const barWidth = Math.min(100, Math.max(10, Math.abs(item.impact_percentage) * 3));

          return (
            <div key={index} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  {isPos ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                  <span>{item.feature}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formattedAmount}
                  </span>
                  <span className="text-[11px] text-slate-400">({isPos ? '+' : ''}{item.impact_percentage}%)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPos ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 pl-6">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* Summary Narrative */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-slate-800 leading-relaxed">
        <span className="font-bold text-blue-800 block mb-1">Model Reasoning Summary:</span>
        {explanation}
      </div>
    </div>
  );
};
