import React from 'react';
import { ValuationResult, Property, ComparableProperty } from '../types';
import { X, Printer, Download, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  valuation: ValuationResult;
  property?: Property;
  comparables?: ComparableProperty[];
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ valuation, property, comparables = [], onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedValue = `₹${(valuation.estimated_value / 10000000).toFixed(2)} Cr`;
  const formattedLower = `₹${(valuation.lower_range / 10000000).toFixed(2)} Cr`;
  const formattedUpper = `₹${(valuation.upper_range / 10000000).toFixed(2)} Cr`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10 no-print">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-slate-100">EstatePulse AI Property Intelligence Report</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-8 space-y-8 print:p-0 print:text-black print:bg-white">
          {/* Institution Title */}
          <div className="border-b border-slate-800 pb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-cyan-400">EstatePulse AI</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                  OFFICIAL VALUATION
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-100 mt-2">
                Property Valuation & Predictive Investment Audit
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • Report ID: {valuation.id}
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div className="font-bold text-slate-200">{valuation.property_input.locality}, {valuation.property_input.city}</div>
              <div>{valuation.property_input.bedrooms} BHK {valuation.property_input.property_type}</div>
              <div>{valuation.property_input.area_sqft} sq.ft</div>
            </div>
          </div>

          {/* Core Valuation Summary */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
                  Estimated Fair Market Value
                </span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {formattedValue}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Confidence Interval</div>
                <div className="text-sm font-bold text-slate-200 mt-1">
                  {formattedLower} – {formattedUpper}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Rate / Sq.Ft</span>
                <span className="font-bold text-slate-200">₹{valuation.price_per_sqft.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Reliability Score</span>
                <span className="font-bold text-cyan-400">{valuation.reliability_score} / 100</span>
              </div>
              <div>
                <span className="text-slate-400 block">Investment Score</span>
                <span className="font-bold text-emerald-400">{valuation.investment_score} / 100</span>
              </div>
            </div>
          </div>

          {/* AI Explanation & Factors */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Valuation Reasoning & Key Drivers</h3>
            <p className="text-xs text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              {valuation.valuation_explanation}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 block">Top Positive Value Drivers</span>
                {valuation.top_positives.map((pos, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{pos}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="font-bold text-rose-400 block">Value Depreciation Considerations</span>
                {valuation.top_negatives.map((neg, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-slate-300">
                    <X className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{neg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparable Properties Table */}
          {comparables.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200">Benchmark Comparable Transactions</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Property</th>
                      <th className="p-3">Locality</th>
                      <th className="p-3">Area</th>
                      <th className="p-3">Market Price</th>
                      <th className="p-3">Match %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {comparables.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-950/40">
                        <td className="p-3 font-semibold text-slate-100">{c.property.title}</td>
                        <td className="p-3">{c.property.locality}</td>
                        <td className="p-3">{c.property.area_sqft} sqft</td>
                        <td className="p-3 font-bold text-cyan-400">₹{(c.property.price / 10000000).toFixed(2)} Cr</td>
                        <td className="p-3 font-bold text-emerald-400">{c.similarity_score}% Match</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Institutional Disclaimer */}
          <div className="pt-6 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed">
            <span className="font-bold block mb-1">Disclaimer & Methodology:</span>
            EstatePulse AI provides machine-learning predictive estimates based on historical market data, geospatial proximity, and feature gradient boosted models. This report is for decision support and analytical reference only, and does not constitute certified property valuation or formal legal advice.
          </div>
        </div>
      </div>
    </div>
  );
};
