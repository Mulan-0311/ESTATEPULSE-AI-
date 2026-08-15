import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  Compass,
  GitCompare,
  Eye,
  TrendingUp,
  Landmark,
  Bot,
  BookmarkCheck,
  FileSpreadsheet,
  BrainCircuit,
  Home,
  X
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  savedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  savedCount
}) => {
  const navItems = [
    { id: 'landing', label: 'Welcome / Home', icon: Home },
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'valuation', label: 'AI Valuation', icon: Calculator, badge: 'ML Core' },
    { id: 'market', label: 'Market Heatmap', icon: Compass },
    { id: 'comparables', label: 'Comparables', icon: GitCompare },
    { id: 'vision', label: 'Property Vision', icon: Eye, badge: 'Vision' },
    { id: 'investment', label: 'Investment ROI', icon: TrendingUp },
    { id: 'emi', label: 'EMI Calculator', icon: Landmark },
    { id: 'advisor', label: 'AI Advisor', icon: Bot, badge: 'Gemini' },
    { id: 'portfolio', label: 'My Portfolio', icon: BookmarkCheck, count: savedCount },
    { id: 'compare', label: 'Property Compare', icon: GitCompare },
    { id: 'reports', label: 'Valuation Reports', icon: FileSpreadsheet },
    { id: 'ml-insights', label: 'ML Model Insights', icon: BrainCircuit }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[65px] left-0 h-screen lg:h-[calc(100vh-65px)] w-64 bg-slate-900 border-r border-slate-800 text-slate-300 z-50 p-4 flex flex-col justify-between transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-800">
            <span className="font-bold text-white">EstatePulse AI Menu</span>
            <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Core Modules
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-600/30 text-blue-300 rounded border border-blue-500/30">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom System Info */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-xs font-semibold text-white">XGBoost ML Pipeline</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Accuracy: <span className="text-emerald-400 font-bold">0.956 R²</span> | MAE: ₹3.6 L
            </p>
          </div>

          <div className="text-[10px] text-slate-500 text-center">
            EstatePulse AI • Institutional Edition
          </div>
        </div>
      </aside>
    </>
  );
};
