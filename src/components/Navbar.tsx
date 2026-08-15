import React, { useState } from 'react';
import { Search, Bell, Sparkles, Building2, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onExploreDemo: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, onExploreDemo, onNavigate, activePage }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('market');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-1 shadow-sm group-hover:bg-blue-700 transition-colors">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-slate-900">
                EstatePulse
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                AI
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Global Search */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 w-80">
        <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search systems, locality..."
          className="bg-transparent border-none outline-none text-sm w-full text-slate-800 placeholder-slate-400"
        />
      </form>

      {/* Action CTA & User Status */}
      <div className="flex items-center gap-4">
        <button
          onClick={onExploreDemo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore Demo</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 relative transition-colors"
          title="Notifications & Signals"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        <div className="pl-3 border-l border-slate-200 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            EP
          </div>
        </div>
      </div>
    </header>
  );
};
