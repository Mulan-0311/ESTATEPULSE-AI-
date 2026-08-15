import React, { useState, useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Tooltip as LeafletTooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { Property, NeighborhoodData } from '../types';
import { NEIGHBORHOOD_DATA } from '../data/seedData';
import {
  Flame,
  Layers,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  Award,
  DollarSign,
  Percent,
  Sliders,
  Maximize2,
  Compass,
  ChevronDown,
  ChevronUp,
  Info,
  Building2,
  RefreshCw,
  Zap,
  Map as MapIcon
} from 'lucide-react';

// Fix default leaflet marker icon path issue in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

export type HeatmapMetric =
  | 'price_sqft'
  | 'demand'
  | 'growth'
  | 'yield'
  | 'investment';

export type MapTileTheme = 'dark' | 'light' | 'satellite' | 'osm';

interface MapViewProps {
  properties?: Property[];
  neighborhoods?: NeighborhoodData[];
  selectedProperty?: Property | null;
  onSelectProperty?: (property: Property) => void;
  onSelectNeighborhood?: (neighborhood: NeighborhoodData) => void;
  center?: [number, number];
  zoom?: number;
  heightClass?: string;
  initialMetric?: HeatmapMetric;
  showControls?: boolean;
}

// Controller component to smoothly center & fly when props change
const MapController: React.FC<{
  center: [number, number];
  zoom: number;
  selectedProperty?: Property | null;
}> = ({ center, zoom, selectedProperty }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      map.flyTo([selectedProperty.latitude, selectedProperty.longitude], Math.max(zoom, 14), {
        duration: 1.2
      });
    } else if (center) {
      map.flyTo(center, zoom, { duration: 1 });
    }
  }, [center, zoom, selectedProperty, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  properties = [],
  neighborhoods = [],
  selectedProperty,
  onSelectProperty,
  onSelectNeighborhood,
  center = [18.559, 73.7788], // Default Baner, Pune
  zoom = 12,
  heightClass = 'min-h-[460px] h-full',
  initialMetric = 'price_sqft',
  showControls = true
}) => {
  // Use provided neighborhoods or fallback to comprehensive seed data
  const activeNeighborhoods = useMemo(() => {
    if (neighborhoods && neighborhoods.length > 0) return neighborhoods;
    return NEIGHBORHOOD_DATA;
  }, [neighborhoods]);

  // Heatmap Overlay States
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [densityMetric, setDensityMetric] = useState<HeatmapMetric>(initialMetric);
  const [heatIntensity, setHeatIntensity] = useState<number>(0.65); // 0.2 to 0.95
  const [heatRadiusScale, setHeatRadiusScale] = useState<number>(1.0); // 0.8 to 1.4
  const [showPropertyPins, setShowPropertyPins] = useState<boolean>(true);
  const [showMicroGlows, setShowMicroGlows] = useState<boolean>(true);
  const [mapTheme, setMapTheme] = useState<MapTileTheme>('dark');
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(true);
  const [activeHoveredLocality, setActiveHoveredLocality] = useState<string | null>(null);

  // Active Center position
  const activeCenter: [number, number] = useMemo(() => {
    if (selectedProperty) {
      return [selectedProperty.latitude, selectedProperty.longitude];
    }
    return [center[0], center[1]];
  }, [selectedProperty, center]);

  // Calculate dynamic min/max values for active metric across neighborhoods
  const metricRanges = useMemo(() => {
    const values = activeNeighborhoods.map((n) => {
      switch (densityMetric) {
        case 'price_sqft':
          return n.average_price_per_sqft;
        case 'demand':
          return n.demand_score;
        case 'growth':
          return n.annual_growth;
        case 'yield':
          return n.rental_yield;
        case 'investment':
          return n.investment_score;
        default:
          return n.average_price_per_sqft;
      }
    });

    const min = Math.min(...values, 0);
    const max = Math.max(...values, 100);
    return { min, max };
  }, [activeNeighborhoods, densityMetric]);

  // Helper to calculate normalized ratio (0.0 to 1.0)
  const getNormalizedRatio = (val: number, min: number, max: number) => {
    if (max <= min) return 0.5;
    const ratio = (val - min) / (max - min);
    return Math.max(0, Math.min(1, ratio));
  };

  // Color mapper for density heat zones (Spectrum Gradient)
  const getHeatmapColor = (value: number, metric: HeatmapMetric) => {
    const { min, max } = metricRanges;
    const ratio = getNormalizedRatio(value, min, max);

    // Color ramp:
    // Low: Emerald (#10b981) -> Cyan (#06b6d4) -> Sky Blue (#3b82f6) -> Amber (#f59e0b) -> Orange (#f97316) -> Crimson (#e11d48)
    if (ratio < 0.2) {
      return {
        hex: '#10b981', // Emerald
        label: 'Affordable / Low Density',
        tier: 'Tier 4 - Emerging'
      };
    } else if (ratio < 0.4) {
      return {
        hex: '#06b6d4', // Cyan
        label: 'Moderate Density',
        tier: 'Tier 3 - Balanced'
      };
    } else if (ratio < 0.6) {
      return {
        hex: '#3b82f6', // Blue
        label: 'High Density Corridor',
        tier: 'Tier 2 - Prime Hub'
      };
    } else if (ratio < 0.8) {
      return {
        hex: '#f59e0b', // Amber / Gold
        label: 'Very High Value Density',
        tier: 'Tier 1 - Premium Tech Core'
      };
    } else {
      return {
        hex: '#e11d48', // Crimson Rose
        label: 'Ultra-High Density Hotspot',
        tier: 'Tier 0 - Ultra-Luxury Nexus'
      };
    }
  };

  // Format metric value for displays & legends
  const formatMetricValue = (val: number, metric: HeatmapMetric) => {
    switch (metric) {
      case 'price_sqft':
        return `₹${val.toLocaleString('en-IN')}/sq.ft`;
      case 'demand':
        return `${val} / 100 Index`;
      case 'growth':
        return `+${val}% YoY`;
      case 'yield':
        return `${val}% Gross Yield`;
      case 'investment':
        return `${val} / 100 Rating`;
    }
  };

  // Metric Labels & Descriptions
  const metricInfo: Record<HeatmapMetric, { name: string; unit: string; icon: React.FC<{ className?: string }> }> = {
    price_sqft: { name: 'Property Value Density', unit: '₹/sq.ft', icon: DollarSign },
    demand: { name: 'Market Demand Index', unit: '/100', icon: Zap },
    growth: { name: 'Capital Appreciation', unit: '% YoY', icon: TrendingUp },
    yield: { name: 'Rental Yield Density', unit: '% Yield', icon: Percent },
    investment: { name: 'AI Investment Score', unit: '/100', icon: Award }
  };

  // Tile layer URL resolver
  const tileLayerConfig = useMemo(() => {
    switch (mapTheme) {
      case 'dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
        };
      case 'light':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
        };
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye'
        };
      case 'osm':
      default:
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        };
    }
  }, [mapTheme]);

  // Create custom DivIcon for property price tags
  const createPropertyPinIcon = (prop: Property, isSelected: boolean) => {
    const priceText =
      prop.price >= 10000000
        ? `₹${(prop.price / 10000000).toFixed(2)} Cr`
        : prop.price >= 100000
        ? `₹${(prop.price / 100000).toFixed(1)} L`
        : `₹${(prop.price / 1000).toFixed(0)}k`;

    return L.divIcon({
      className: 'custom-property-pin',
      html: `
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: ${isSelected ? '#2563eb' : '#0f172a'};
          color: #ffffff;
          padding: 3px 8px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 800;
          font-family: inherit;
          border: 2px solid ${isSelected ? '#60a5fa' : '#38bdf8'};
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
          cursor: pointer;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          transition: transform 0.2s ease, background 0.2s ease;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${isSelected ? '#ffffff' : '#38bdf8'};"></span>
          <span>${priceText}</span>
        </div>
      `,
      iconSize: [64, 26],
      iconAnchor: [32, 13]
    });
  };

  return (
    <div className={`w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative z-10 flex flex-col bg-slate-950 font-sans`}>
      {/* Top Floating Heatmap Control Bar */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl text-xs text-slate-200">
          {/* Left: Heatmap Toggle & Metric Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Heatmap Visibility Toggle Button */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                showHeatmap
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
              }`}
              title="Toggle Neighborhood Value Density Heatmap"
            >
              <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-amber-300 animate-pulse' : 'text-slate-400'}`} />
              <span>{showHeatmap ? 'Heatmap Active' : 'Heatmap Off'}</span>
            </button>

            {/* Metric Mode Dropdown */}
            {showHeatmap && (
              <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-800 rounded-lg px-2 py-1">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-blue-400" />
                  <span>Metric:</span>
                </span>
                <select
                  value={densityMetric}
                  onChange={(e) => setDensityMetric(e.target.value as HeatmapMetric)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="price_sqft" className="bg-slate-900 text-white">
                    ₹/sq.ft Value Density
                  </option>
                  <option value="demand" className="bg-slate-900 text-white">
                    Market Demand Index
                  </option>
                  <option value="growth" className="bg-slate-900 text-white">
                    Annual Capital Growth (%)
                  </option>
                  <option value="yield" className="bg-slate-900 text-white">
                    Rental Yield (%)
                  </option>
                  <option value="investment" className="bg-slate-900 text-white">
                    AI Investment Score
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Right: Map Style & Layer Options */}
          <div className="flex items-center gap-1.5">
            {/* Intensity & Radius Adjusters (Quick Popover/Toggles) */}
            {showHeatmap && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
                <span className="text-slate-400 font-medium">Density:</span>
                <div className="flex gap-1">
                  {[0.4, 0.65, 0.85].map((level, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeatIntensity(level)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        heatIntensity === level
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {idx === 0 ? 'Soft' : idx === 1 ? 'Med' : 'Vivid'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle Property Pins */}
            {properties.length > 0 && (
              <button
                onClick={() => setShowPropertyPins(!showPropertyPins)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  showPropertyPins
                    ? 'bg-slate-800 border-slate-700 text-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
                title={showPropertyPins ? 'Hide Property Pins' : 'Show Property Pins'}
              >
                {showPropertyPins ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Map Tile Theme Switcher */}
            <div className="flex items-center bg-slate-950/90 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setMapTheme('dark')}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                  mapTheme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Dark Matter GIS View"
              >
                Dark
              </button>
              <button
                onClick={() => setMapTheme('light')}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                  mapTheme === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Light GIS View"
              >
                Light
              </button>
              <button
                onClick={() => setMapTheme('satellite')}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                  mapTheme === 'satellite'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Esri Satellite Imagery"
              >
                Satellite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Map Container */}
      <div className="flex-1 w-full h-full relative">
        <MapContainer
          center={activeCenter}
          zoom={zoom}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          {/* Dynamic Map Recenter Controller */}
          <MapController
            center={activeCenter}
            zoom={zoom}
            selectedProperty={selectedProperty}
          />

          {/* Base Tile Layer */}
          <TileLayer
            attribution={tileLayerConfig.attribution}
            url={tileLayerConfig.url}
          />

          {/* ================================================================= */}
          {/* NEIGHBORHOOD VALUE DENSITY HEATMAP OVERLAY                         */}
          {/* Multi-tiered concentric gradient regions                          */}
          {/* ================================================================= */}
          {showHeatmap &&
            activeNeighborhoods.map((n) => {
              // Determine value according to selected metric
              let metricValue = n.average_price_per_sqft;
              if (densityMetric === 'demand') metricValue = n.demand_score;
              else if (densityMetric === 'growth') metricValue = n.annual_growth;
              else if (densityMetric === 'yield') metricValue = n.rental_yield;
              else if (densityMetric === 'investment') metricValue = n.investment_score;

              const colorInfo = getHeatmapColor(metricValue, densityMetric);
              const isHovered = activeHoveredLocality === n.id;

              // Radius calculations
              const outerRadius = 3200 * heatRadiusScale;
              const midRadius = 1800 * heatRadiusScale;
              const coreRadius = 850 * heatRadiusScale;

              return (
                <React.Fragment key={`heat-${n.id}`}>
                  {/* Layer 1: Outer Halo Heat Diffuser (Softest falloff) */}
                  <Circle
                    center={[n.latitude, n.longitude]}
                    radius={outerRadius}
                    pathOptions={{
                      color: colorInfo.hex,
                      fillColor: colorInfo.hex,
                      fillOpacity: heatIntensity * 0.12,
                      weight: 0,
                      interactive: false
                    }}
                  />

                  {/* Layer 2: Mid-Range Density Gradient Ring */}
                  <Circle
                    center={[n.latitude, n.longitude]}
                    radius={midRadius}
                    pathOptions={{
                      color: colorInfo.hex,
                      fillColor: colorInfo.hex,
                      fillOpacity: heatIntensity * 0.28,
                      weight: isHovered ? 1.5 : 0.5,
                      dashArray: isHovered ? '4 4' : undefined,
                      interactive: false
                    }}
                  />

                  {/* Layer 3: High-Density Core Hub with interactive Popup */}
                  <Circle
                    center={[n.latitude, n.longitude]}
                    radius={coreRadius}
                    eventHandlers={{
                      mouseover: () => setActiveHoveredLocality(n.id),
                      mouseout: () => setActiveHoveredLocality(null),
                      click: () => {
                        if (onSelectNeighborhood) onSelectNeighborhood(n);
                      }
                    }}
                    pathOptions={{
                      color: colorInfo.hex,
                      fillColor: colorInfo.hex,
                      fillOpacity: isHovered ? Math.min(0.85, heatIntensity * 0.75 + 0.15) : heatIntensity * 0.55,
                      weight: isHovered ? 2.5 : 1.5
                    }}
                  >
                    {/* Tooltip on Hover */}
                    <LeafletTooltip direction="top" offset={[0, -10]} opacity={0.95}>
                      <div className="text-xs font-bold text-slate-900 px-1 py-0.5">
                        <span className="text-slate-950">{n.locality}</span>
                        <span className="text-blue-600 font-extrabold ml-1">
                          ({formatMetricValue(metricValue, densityMetric)})
                        </span>
                      </div>
                    </LeafletTooltip>

                    {/* Rich Popup on Click */}
                    <Popup>
                      <div className="p-2 space-y-2.5 text-xs text-slate-100 min-w-[220px]">
                        {/* Header */}
                        <div className="border-b border-slate-700/80 pb-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {colorInfo.tier}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {n.city}
                            </span>
                          </div>
                          <h4 className="text-base font-extrabold text-white mt-1">
                            {n.locality}, {n.city}
                          </h4>
                        </div>

                        {/* Active Density Metric Highlight Box */}
                        <div
                          className="p-2.5 rounded-lg border flex items-center justify-between"
                          style={{
                            backgroundColor: `${colorInfo.hex}15`,
                            borderColor: `${colorInfo.hex}40`
                          }}
                        >
                          <div>
                            <span className="text-[10px] font-bold text-slate-300 block uppercase tracking-wider">
                              {metricInfo[densityMetric].name}
                            </span>
                            <span
                              className="text-base font-extrabold block"
                              style={{ color: colorInfo.hex }}
                            >
                              {formatMetricValue(metricValue, densityMetric)}
                            </span>
                          </div>
                          <div
                            className="w-3 h-3 rounded-full animate-ping"
                            style={{ backgroundColor: colorInfo.hex }}
                          />
                        </div>

                        {/* Locality Quick KPI Grid */}
                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Avg Price</span>
                            <span className="font-bold text-slate-200">
                              ₹{(n.average_price / 10000000).toFixed(2)} Cr
                            </span>
                          </div>
                          <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Annual Growth</span>
                            <span className="font-bold text-emerald-400">+{n.annual_growth}%</span>
                          </div>
                          <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Rental Yield</span>
                            <span className="font-bold text-amber-400">{n.rental_yield}%</span>
                          </div>
                          <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Demand Index</span>
                            <span className="font-bold text-blue-400">{n.demand_score}/100</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                          {n.summary}
                        </p>

                        {/* Action Buttons */}
                        {onSelectNeighborhood && (
                          <button
                            onClick={() => onSelectNeighborhood(n)}
                            className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                          >
                            Inspect Locality Profile
                          </button>
                        )}
                      </div>
                    </Popup>
                  </Circle>
                </React.Fragment>
              );
            })}

          {/* ================================================================= */}
          {/* PROPERTY-LEVEL MICRO DENSITY GLOWS                                */}
          {/* ================================================================= */}
          {showHeatmap &&
            showMicroGlows &&
            properties.map((p) => {
              const rate = p.price_per_sqft || (p.area_sqft ? p.price / p.area_sqft : 8000);
              const colorInfo = getHeatmapColor(rate, 'price_sqft');
              return (
                <Circle
                  key={`micro-glow-${p.id}`}
                  center={[p.latitude, p.longitude]}
                  radius={400}
                  pathOptions={{
                    color: colorInfo.hex,
                    fillColor: colorInfo.hex,
                    fillOpacity: 0.35,
                    weight: 1,
                    dashArray: '2 2',
                    interactive: false
                  }}
                />
              );
            })}

          {/* ================================================================= */}
          {/* PROPERTY MARKERS & PRICE BADGES                                   */}
          {/* ================================================================= */}
          {showPropertyPins &&
            properties.map((p) => {
              const isSelected = selectedProperty?.id === p.id;
              const pinIcon = createPropertyPinIcon(p, isSelected);

              return (
                <Marker
                  key={p.id}
                  position={[p.latitude, p.longitude]}
                  icon={pinIcon}
                  eventHandlers={{
                    click: () => {
                      if (onSelectProperty) onSelectProperty(p);
                    }
                  }}
                >
                  <Popup>
                    <div className="p-1.5 space-y-2 text-xs max-w-[220px] text-slate-100">
                      <div className="relative rounded-lg overflow-hidden h-24 border border-slate-700">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-blue-600/90 text-white font-bold text-[10px] backdrop-blur-xs">
                          {p.property_type}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-extrabold text-white text-sm line-clamp-1">{p.title}</div>
                        <div className="text-blue-400 font-black text-base">
                          {p.price >= 10000000
                            ? `₹${(p.price / 10000000).toFixed(2)} Cr`
                            : `₹${(p.price / 100000).toFixed(2)} Lakhs`}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          ₹{p.price_per_sqft.toLocaleString('en-IN')}/sq.ft • {p.bedrooms} BHK ({p.area_sqft} sqft)
                        </div>
                        <div className="text-slate-400 text-[10px] flex items-center gap-1 truncate pt-0.5">
                          <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                          <span>{p.address}</span>
                        </div>
                      </div>

                      {onSelectProperty && (
                        <button
                          onClick={() => onSelectProperty(p)}
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                        >
                          View Property AI Valuation
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>

      {/* ===================================================================== */}
      {/* FLOATING HEATMAP SPECTRUM LEGEND                                      */}
      {/* ===================================================================== */}
      {showHeatmap && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-xl p-3 shadow-2xl text-xs text-white max-w-[280px] w-full transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded bg-blue-500/20 text-blue-400">
                <Flame className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-[11px] text-slate-100">
                {metricInfo[densityMetric].name}
              </span>
            </div>

            <button
              onClick={() => setIsLegendExpanded(!isLegendExpanded)}
              className="p-0.5 rounded text-slate-400 hover:text-white"
              title={isLegendExpanded ? 'Collapse Legend' : 'Expand Legend'}
            >
              {isLegendExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isLegendExpanded && (
            <div className="space-y-2.5">
              {/* Continuous Gradient Color Ramp Bar */}
              <div className="space-y-1">
                <div className="h-3 w-full rounded-md shadow-inner bg-gradient-to-r from-[#10b981] via-[#06b6d4] via-[#3b82f6] via-[#f59e0b] via-[#f97316] to-[#e11d48]" />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Low Density</span>
                  <span>Average</span>
                  <span>High Value</span>
                </div>
              </div>

              {/* Categorical Tier Color Stops */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] flex-shrink-0" />
                  <span className="text-slate-300">Emerging / Entry</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] flex-shrink-0" />
                  <span className="text-slate-300">Balanced Growth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] flex-shrink-0" />
                  <span className="text-slate-300">Prime Corridor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] flex-shrink-0" />
                  <span className="text-slate-300">Tech Nexus</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48] flex-shrink-0" />
                  <span className="text-slate-300">Ultra-Luxury Hotspot</span>
                </div>
              </div>

              {/* Live Data Scope Badge */}
              <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>{activeNeighborhoods.length} Localities Overlaid</span>
                <span className="text-blue-400 font-semibold">Live GIS Data</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

