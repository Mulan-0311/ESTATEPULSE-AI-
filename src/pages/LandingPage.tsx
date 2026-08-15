import React from 'react';
import {
  Sparkles,
  Calculator,
  Compass,
  GitCompare,
  Eye,
  TrendingUp,
  Bot,
  ArrowRight,
  ShieldCheck,
  Building2,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onGetValuation: () => void;
  onExploreDemo: () => void;
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetValuation, onExploreDemo, onNavigate }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden rounded-xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Real Estate Valuation & Investment Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Know What Your Property Is <span className="text-blue-600">Really Worth</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
            AI-powered machine learning valuation, comparable property analysis, neighborhood heatmaps, and investment intelligence in one institutional platform.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreDemo}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Demo Valuation</span>
            </button>

            <button
              onClick={onGetValuation}
              className="flex items-center gap-2 px-6 py-3.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-sm transition-all"
            >
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Generate AI Valuation</span>
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-xl font-bold text-slate-900">0.956 R²</div>
              <div className="text-slate-500 font-medium">XGBoost ML Accuracy</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">35+</div>
              <div className="text-slate-500 font-medium">Metro Market Benchmarks</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-600">&lt; 1 Second</div>
              <div className="text-slate-500 font-medium">Valuation Processing</div>
            </div>
            <div>
              <div className="text-xl font-bold text-amber-600">XAI SHAP</div>
              <div className="text-slate-500 font-medium">Explainable AI Drivers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Real Estate Intelligence
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Powered by machine learning models trained on metropolitan transaction benchmarks.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            onClick={() => onNavigate('valuation')}
            className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              AI Property Valuation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              ML valuation engine incorporating square footage, construction age, elevation, amenities, and transit distance.
            </p>
          </div>

          <div
            onClick={() => onNavigate('market')}
            className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              Market Heatmap & Intelligence
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Interactive Leaflet maps detailing locality demand, average price per sq.ft, annual appreciation, and safety indices.
            </p>
          </div>

          <div
            onClick={() => onNavigate('comparables')}
            className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              Smart Comparable Matching
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Cosine similarity matching engine identifying comparable property transactions with similarity scores (0-100%).
            </p>
          </div>

          <div
            onClick={() => onNavigate('vision')}
            className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              Property Vision Analysis
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Visual quality scoring evaluating natural lighting, finish condition, and estimated renovation upside impact.
            </p>
          </div>

          <div
            onClick={() => onNavigate('investment')}
            className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              Investment ROI & Cashflow
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Full ROI calculator estimating rental yield, cash-on-cash return, total profit, and Investment Verdict.
            </p>
          </div>

          <div
            onClick={() => onNavigate('advisor')}
            className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              Pulse Advisor (Gemini AI)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Conversational AI assistant with voice capabilities providing property context-aware investment advice.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">How EstatePulse AI Works</h2>
          <p className="text-xs text-slate-500 font-medium">
            From raw property characteristics to data-backed investment decisions in 5 steps.
          </p>
        </div>

        <div className="grid sm:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'Input Specs', desc: 'Enter property size, location, floor, and age.' },
            { step: '02', title: 'ML Prediction', desc: 'XGBoost regression evaluates market benchmarks.' },
            { step: '03', title: 'XAI Drivers', desc: 'SHAP breakdown explains exact price factors.' },
            { step: '04', title: 'Market Audit', desc: 'Compare nearby properties & rental yields.' },
            { step: '05', title: 'Smart Decision', desc: 'Consult Pulse Advisor & print official report.' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 relative">
              <span className="text-2xl font-black text-blue-600/30 block">{item.step}</span>
              <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
