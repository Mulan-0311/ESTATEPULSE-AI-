import React, { useState, useEffect } from 'react';
import {
  Property,
  ValuationResult,
  ComparableProperty,
  NeighborhoodData,
  SavedProperty,
  ChatMessage,
  ValuationInput
} from './types';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ValuationGauge } from './components/ValuationGauge';
import { XaiWaterfallChart } from './components/XaiWaterfallChart';
import { PropertyCard } from './components/PropertyCard';
import { MapView } from './components/MapView';
import { ReportModal } from './components/ReportModal';
import { MortgageCalculator } from './components/MortgageCalculator';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ValuationFormPage } from './pages/ValuationFormPage';
import { ValuationResultPage } from './pages/ValuationResultPage';
import { MarketIntelligencePage } from './pages/MarketIntelligencePage';
import { ComparablesPage } from './pages/ComparablesPage';
import { PropertyVisionPage } from './pages/PropertyVisionPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { PropertyCompare } from './components/PropertyCompare';
import { BotWidget } from './components/BotWidget';

import { SEED_PROPERTIES, NEIGHBORHOOD_DATA, DEMO_PRESET_PROPERTY } from './data/seedData';

import {
  Search,
  MapPin,
  Building2,
  Sparkles,
  Calculator,
  Filter,
  ArrowRight,
  Bookmark,
  FileSpreadsheet,
  Bot,
  Compass,
  Eye,
  GitCompare,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  ExternalLink,
  Send,
  RefreshCw,
  AlertCircle,
  Bed,
  Bath,
  Maximize2,
  Layers,
  Clock,
  DollarSign
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('search');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Address Search State
  const [searchAddress, setSearchAddress] = useState<string>('12 Baner Road, Baner, Pune');
  const [searchFilters, setSearchFilters] = useState<{
    property_type: 'Apartment' | 'Villa' | 'Penthouse' | 'Studio' | 'Plot';
    area_sqft: number;
    bedrooms: number;
  }>({
    property_type: 'Apartment',
    area_sqft: 1450,
    bedrooms: 3
  });

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<{
    property: Property;
    valuation: ValuationResult;
    comparables: ComparableProperty[];
    address_match: {
      raw_input: string;
      city: string;
      locality: string;
      confidence_score: number;
    };
  } | null>(null);

  // Global App Data
  const [properties, setProperties] = useState<Property[]>(SEED_PROPERTIES);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodData[]>(NEIGHBORHOOD_DATA);
  const [currentValuation, setCurrentValuation] = useState<ValuationResult | null>(null);
  const [currentComparables, setCurrentComparables] = useState<ComparableProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(SEED_PROPERTIES[0]);
  const [portfolio, setPortfolio] = useState<SavedProperty[]>([]);

  // Pulse Advisor AI Chat State
  const [advisorInput, setAdvisorInput] = useState<string>('');
  const [advisorMessages, setAdvisorMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Hello! I am Pulse Advisor, your AI real estate intelligence consultant. Ask me about property valuations, neighborhood growth, rental yields, or mortgage feasibility.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isAdvisorTyping, setIsAdvisorTyping] = useState<boolean>(false);

  // Modals & Report
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Initial Fetch Data from API
  useEffect(() => {
    fetchInitialData();
    fetchPortfolio();
    // Perform initial address search to populate search view
    handleAddressSearch('12 Baner Road, Baner, Pune');
  }, []);

  const fetchInitialData = async () => {
    try {
      const [propRes, neighRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/neighborhoods')
      ]);

      if (propRes.ok) {
        const propData = await propRes.json();
        if (propData.properties && propData.properties.length > 0) {
          setProperties(propData.properties);
        }
      }

      if (neighRes.ok) {
        const neighData = await neighRes.json();
        if (neighData.neighborhoods && neighData.neighborhoods.length > 0) {
          setNeighborhoods(neighData.neighborhoods);
        }
      }
    } catch (err) {
      console.warn('Backend API initial fetch offline, using seed fallback data:', err);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio || []);
      }
    } catch (err) {
      console.warn('Failed to fetch portfolio from server:', err);
    }
  };

  // Main Property Search via API
  const handleAddressSearch = async (addressToSearch?: string) => {
    const queryAddress = addressToSearch || searchAddress;
    if (!queryAddress || !queryAddress.trim()) {
      setSearchError('Please enter a valid property address or locality.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch('/api/address/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: queryAddress.trim(),
          property_type: searchFilters.property_type,
          area_sqft: Number(searchFilters.area_sqft),
          bedrooms: Number(searchFilters.bedrooms)
        })
      });

      if (!response.ok) {
        throw new Error(`Address search API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.property && data.valuation) {
        setSearchResult(data);
        setSelectedProperty(data.property);
        setCurrentValuation(data.valuation);
        setCurrentComparables(data.comparables || []);
      } else {
        throw new Error('API response did not contain property valuation details.');
      }
    } catch (err: any) {
      console.error('Error fetching property details via API:', err);
      setSearchError(err.message || 'Failed to fetch property details. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Custom Valuation Form Submit
  const handleFormValuationSubmit = async (input: ValuationInput) => {
    setIsSearching(true);
    try {
      const response = await fetch('/api/valuation/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentValuation(data.valuation);
        setCurrentComparables(data.comparables || []);
        setCurrentPage('result');
      }
    } catch (err) {
      console.error('Error predicting valuation:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Save Property to Portfolio via API
  const handleSaveToPortfolio = async (valuationToSave?: ValuationResult | null) => {
    const targetVal = valuationToSave || currentValuation || searchResult?.valuation;
    const targetProp = selectedProperty || searchResult?.property || properties[0];

    if (!targetProp) return;

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: targetProp,
          notes: `Saved from search at ${new Date().toLocaleDateString()}`,
          custom_valuation: targetVal
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPortfolio((prev) => [data.item, ...prev]);
      }
    } catch (err) {
      console.error('Failed to save property to portfolio:', err);
    }
  };

  // Remove Property from Portfolio via API
  const handleRemoveFromPortfolio = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPortfolio((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to remove item from portfolio:', err);
    }
  };

  // Pulse Advisor AI Chat Handler
  const handleSendAdvisorMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!advisorInput.trim() || isAdvisorTyping) return;

    const userMsgText = advisorInput.trim();
    setAdvisorInput('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAdvisorMessages((prev) => [...prev, userMessage]);
    setIsAdvisorTyping(true);

    try {
      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          property_context: searchResult?.valuation?.property_input || {
            locality: searchResult?.property?.locality || 'Baner, Pune',
            area_sqft: searchResult?.property?.area_sqft || 1450,
            bedrooms: searchResult?.property?.bedrooms || 3,
            estimated_value: searchResult?.valuation?.estimated_value || 12400000,
            price_per_sqft: searchResult?.valuation?.price_per_sqft || 8552,
            investment_score: searchResult?.valuation?.investment_score || 88
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'Analysis complete.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAdvisorMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      console.error('Advisor error:', err);
    } finally {
      setIsAdvisorTyping(false);
    }
  };

  // Navigation Helper
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Property Selection Helper
  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sampleAddressChips = [
    '12 Baner Road, Baner, Pune',
    'Apt 402, Powai Lake Road, Mumbai',
    'Whitefield Main Road, Bengaluru',
    'Financial District, Gachibowli, Hyderabad',
    'Golf Course Extension, Gurugram'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        searchQuery=""
        onSearchChange={() => {}}
        onSearchSubmit={(e) => {
          e.preventDefault();
          setCurrentPage('search');
        }}
        onNavigate={handleNavigate}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onExploreDemo={() => {
          handleAddressSearch('12 Baner Road, Baner, Pune');
          setCurrentPage('search');
        }}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 gap-8">
        {/* Sidebar Navigation */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          savedCount={portfolio.length}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* ======================================================================= */}
          {/* PROPERTY SEARCH INTERFACE PAGE (DEFAULT VIEW)                           */}
          {/* ======================================================================= */}
          {currentPage === 'search' && (
            <div className="space-y-8 pb-12">
              {/* Search Control Header */}
              <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                        <Search className="w-5 h-5" />
                      </span>
                      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Property Details & Address Lookup API
                      </h1>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Input any property address to fetch specifications, location geocoding, and machine-learning valuation estimates.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      API ONLINE
                    </span>
                  </div>
                </div>

                {/* Address Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddressSearch();
                  }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder="Enter full address, building name, or locality (e.g. 12 Baner Road, Pune)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-32 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="absolute right-2 top-2 bottom-2 px-5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
                    >
                      {isSearching ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>Fetch Details</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Filter Row */}
                  <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Property Type</label>
                      <select
                        value={searchFilters.property_type}
                        onChange={(e) =>
                          setSearchFilters({
                            ...searchFilters,
                            property_type: e.target.value as any
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600"
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Studio">Studio</option>
                        <option value="Plot">Plot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Carpet Area (sq.ft)</label>
                      <input
                        type="number"
                        value={searchFilters.area_sqft}
                        onChange={(e) =>
                          setSearchFilters({
                            ...searchFilters,
                            area_sqft: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600"
                        min={300}
                        max={15000}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Bedrooms (BHK)</label>
                      <input
                        type="number"
                        value={searchFilters.bedrooms}
                        onChange={(e) =>
                          setSearchFilters({
                            ...searchFilters,
                            bedrooms: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600"
                        min={1}
                        max={10}
                      />
                    </div>
                  </div>

                  {/* Quick Sample Address Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400">Sample Addresses:</span>
                    {sampleAddressChips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchAddress(chip);
                          handleAddressSearch(chip);
                        }}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-medium border border-slate-200 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Error Banner */}
                {searchError && (
                  <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{searchError}</span>
                    </div>
                    <button
                      onClick={() => handleAddressSearch()}
                      className="px-3 py-1 rounded bg-rose-600 text-white font-semibold text-[11px]"
                    >
                      Retry Call
                    </button>
                  </div>
                )}
              </div>

              {/* SEARCH RESULTS SECTION */}
              {isSearching ? (
                <div className="p-12 rounded-xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
                  <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Calling `/api/address/lookup` API...</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Geocoding address string, executing XGBoost ML feature attributions, and matching benchmark comparables.
                    </p>
                  </div>
                </div>
              ) : searchResult ? (
                <div className="space-y-8">
                  {/* Address Match Confirmation Banner */}
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900">Matched Address: </span>
                        <span className="text-slate-700">{searchResult.address_match.raw_input}</span>
                        <span className="text-slate-500 font-medium"> ({searchResult.address_match.locality}, {searchResult.address_match.city})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">
                        {searchResult.address_match.confidence_score}% Geocode Confidence
                      </span>
                    </div>
                  </div>

                  {/* Fetched Property Overview Card */}
                  <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-200">
                      <div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          Fetched Property Details
                        </span>
                        <h2 className="text-2xl font-bold text-slate-900 mt-1">
                          {searchResult.property.title}
                        </h2>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span>{searchResult.property.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveToPortfolio(searchResult.valuation)}
                          className="px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-blue-600" />
                          <span>Save to Portfolio</span>
                        </button>

                        <button
                          onClick={() => setShowReportModal(true)}
                          className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>Download Report</span>
                        </button>
                      </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                          <Bed className="w-4 h-4 text-blue-600" />
                          <span>Bedrooms & Layout</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {searchResult.property.bedrooms} BHK ({searchResult.property.bathrooms} Bath)
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                          <Maximize2 className="w-4 h-4 text-blue-600" />
                          <span>Carpet Area</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {searchResult.property.area_sqft} sq.ft
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                          <Layers className="w-4 h-4 text-blue-600" />
                          <span>Floor Elevation</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          Floor {searchResult.property.floor} of {searchResult.property.total_floors}
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>Construction Age</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {searchResult.property.property_age} Years
                        </div>
                      </div>
                    </div>

                    {/* Amenities Badges */}
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Included Property Amenities:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {searchResult.property.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Valuation Gauge */}
                  <ValuationGauge valuation={searchResult.valuation} />

                  {/* SHAP XAI Feature Attribution Waterfall */}
                  <XaiWaterfallChart
                    contributions={searchResult.valuation.feature_contributions}
                    explanation={searchResult.valuation.valuation_explanation}
                  />

                  {/* Interactive Home Loan & EMI Calculator */}
                  <MortgageCalculator
                    propertyPrice={searchResult.valuation.estimated_value || searchResult.property.price}
                    rentalEstimate={searchResult.property.rental_estimate}
                    areaSqft={searchResult.property.area_sqft}
                    localityName={searchResult.property.locality}
                  />

                  {/* Map Location & Benchmark Comparables Grid */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Geospatial Map */}
                    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Property Map Geolocation</span>
                      </h3>
                      <div className="h-64 rounded-lg overflow-hidden border border-slate-200">
                        <MapView
                          properties={[searchResult.property]}
                          selectedProperty={searchResult.property}
                          center={[searchResult.property.latitude, searchResult.property.longitude]}
                          zoom={14}
                        />
                      </div>
                    </div>

                    {/* Benchmark Comparables */}
                    <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Benchmark Comparables</h3>
                          <p className="text-xs text-slate-500 font-medium">Matched properties in same neighborhood corridor</p>
                        </div>
                        <button
                          onClick={() => setCurrentPage('comparables')}
                          className="text-xs text-blue-600 hover:underline font-semibold"
                        >
                          View All
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {searchResult.comparables.slice(0, 2).map((comp, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="p-2 rounded-md bg-slate-50 border border-slate-200 text-xs flex justify-between font-medium text-slate-700">
                              <span className="text-blue-600 font-bold">{comp.similarity_score}% Similarity</span>
                              <span>{comp.distance_km} km away</span>
                            </div>
                            <PropertyCard
                              property={comp.property}
                              onSelect={handleSelectProperty}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ======================================================================= */}
          {/* LANDING PAGE                                                            */}
          {/* ======================================================================= */}
          {currentPage === 'landing' && (
            <LandingPage
              onGetValuation={() => setCurrentPage('valuation')}
              onExploreDemo={() => {
                handleAddressSearch('12 Baner Road, Baner, Pune');
                setCurrentPage('search');
              }}
              onNavigate={handleNavigate}
            />
          )}

          {/* ======================================================================= */}
          {/* DASHBOARD PAGE                                                          */}
          {/* ======================================================================= */}
          {currentPage === 'dashboard' && (
            <DashboardPage
              properties={properties}
              neighborhoods={neighborhoods}
              onSelectProperty={handleSelectProperty}
              onNavigate={handleNavigate}
              onExploreDemo={() => {
                handleAddressSearch('12 Baner Road, Baner, Pune');
                setCurrentPage('search');
              }}
            />
          )}

          {/* ======================================================================= */}
          {/* VALUATION FORM PAGE                                                     */}
          {/* ======================================================================= */}
          {currentPage === 'valuation' && (
            <ValuationFormPage
              onSubmit={handleFormValuationSubmit}
              isLoading={isSearching}
            />
          )}

          {/* ======================================================================= */}
          {/* VALUATION RESULT PAGE                                                   */}
          {/* ======================================================================= */}
          {currentPage === 'result' && currentValuation && (
            <ValuationResultPage
              valuation={currentValuation}
              comparables={currentComparables}
              onSavePortfolio={() => handleSaveToPortfolio(currentValuation)}
              onNavigate={handleNavigate}
              onSelectProperty={handleSelectProperty}
            />
          )}

          {/* ======================================================================= */}
          {/* MARKET INTELLIGENCE PAGE                                                */}
          {/* ======================================================================= */}
          {currentPage === 'market' && (
            <MarketIntelligencePage
              properties={properties}
              neighborhoods={neighborhoods}
              onSelectProperty={handleSelectProperty}
            />
          )}

          {/* ======================================================================= */}
          {/* COMPARABLES PAGE                                                        */}
          {/* ======================================================================= */}
          {currentPage === 'comparables' && (
            <ComparablesPage
              properties={properties}
              onSelectProperty={handleSelectProperty}
            />
          )}

          {/* ======================================================================= */}
          {/* PROPERTY VISION PAGE                                                    */}
          {/* ======================================================================= */}
          {currentPage === 'vision' && <PropertyVisionPage />}

          {/* ======================================================================= */}
          {/* PROPERTY DETAIL PAGE                                                    */}
          {/* ======================================================================= */}
          {currentPage === 'detail' && selectedProperty && (
            <PropertyDetailPage
              property={selectedProperty}
              valuation={searchResult?.valuation || currentValuation || {
                id: 'val-detail',
                property_input: DEMO_PRESET_PROPERTY,
                estimated_value: selectedProperty.price,
                lower_range: selectedProperty.price * 0.94,
                upper_range: selectedProperty.price * 1.06,
                price_per_sqft: selectedProperty.price_per_sqft,
                reliability_score: 92,
                investment_score: 88,
                rental_estimate: selectedProperty.rental_estimate,
                annual_appreciation_pct: 8.4,
                market_percentile: 85,
                valuation_explanation: 'High demand corridor with optimal square footage.',
                feature_contributions: [],
                top_positives: ['Prime metro corridor proximity', 'High connectivity rating'],
                top_negatives: ['Low floor elevation adjustment'],
                created_at: new Date().toISOString()
              }}
              comparables={currentComparables}
              onSavePortfolio={() => handleSaveToPortfolio()}
              onNavigate={handleNavigate}
            />
          )}

          {/* ======================================================================= */}
          {/* PULSE ADVISOR (GEMINI AI CHAT) PAGE                                    */}
          {/* ======================================================================= */}
          {currentPage === 'advisor' && (
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-900">Pulse Advisor AI</h1>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Powered by Gemini 3.6 Flash & EstatePulse Machine Learning Valuation Pipeline.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  Active Assistant
                </span>
              </div>

              {/* Chat Container */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-[520px] flex flex-col justify-between overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  {advisorMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md p-4 rounded-xl text-xs leading-relaxed space-y-1 ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                            : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span className="text-[10px] opacity-75 block text-right">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isAdvisorTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-600 animate-bounce" />
                        <span>Pulse Advisor is analyzing valuation metrics...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSendAdvisorMessage}
                  className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2"
                >
                  <input
                    type="text"
                    value={advisorInput}
                    onChange={(e) => setAdvisorInput(e.target.value)}
                    placeholder="Ask about valuation confidence, rental yield, or loan EMI..."
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={isAdvisorTyping || !advisorInput.trim()}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* PROPERTY COMPARE PAGE                                                    */}
          {/* ======================================================================= */}
          {currentPage === 'compare' && (
            <PropertyCompare
              portfolio={portfolio}
              allProperties={properties}
              onSelectProperty={handleSelectProperty}
            />
          )}

          {/* ======================================================================= */}
          {/* SAVED PORTFOLIO PAGE                                                    */}
          {/* ======================================================================= */}
          {currentPage === 'portfolio' && (
            <div className="space-y-8 pb-12">
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-900">Saved Portfolio ({portfolio.length})</h1>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Persisted saved properties and AI valuation records.
                  </p>
                </div>

                <button
                  onClick={() => handleNavigate('compare')}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2"
                >
                  <GitCompare className="w-4 h-4" />
                  <span>Compare Side-by-Side</span>
                </button>
              </div>

              {portfolio.length === 0 ? (
                <div className="p-12 rounded-xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Your Portfolio is Empty</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Search any property address and click "Save to Portfolio" to track properties here.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setCurrentPage('search')}
                      className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
                    >
                      Go to Address Search
                    </button>
                    <button
                      onClick={() => setCurrentPage('compare')}
                      className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200"
                    >
                      Try Property Compare Tool
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs flex justify-between items-center shadow-sm">
                        <span className="text-slate-500 font-medium">
                          Saved {new Date(item.saved_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleNavigate('compare')}
                            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                            title="Compare in side-by-side view"
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                            <span>Compare</span>
                          </button>
                          <button
                            onClick={() => handleRemoveFromPortfolio(item.id)}
                            className="text-rose-600 hover:text-rose-800 font-semibold p-1"
                            title="Remove from portfolio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <PropertyCard
                        property={item.property}
                        onSelect={handleSelectProperty}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Official PDF Report Modal */}
      {showReportModal && (searchResult?.valuation || currentValuation) && (
        <ReportModal
          valuation={searchResult?.valuation || currentValuation!}
          comparables={searchResult?.comparables || currentComparables}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Floating AI Bot Assistant Widget */}
      <BotWidget
        currentProperty={selectedProperty}
        currentValuation={currentValuation || searchResult?.valuation}
        onOpenFullAdvisor={() => handleNavigate('advisor')}
      />
    </div>
  );
}
