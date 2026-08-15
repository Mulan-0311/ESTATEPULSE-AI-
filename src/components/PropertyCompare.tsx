import React, { useState } from 'react';
import { Property, ValuationResult, SavedProperty } from '../types';
import {
  GitCompare,
  ArrowRightLeft,
  Check,
  Award,
  TrendingUp,
  Maximize2,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  ShieldCheck,
  Wifi,
  Building2,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';

interface PropertyCompareProps {
  portfolio: SavedProperty[];
  allProperties?: Property[];
  initialPropertyA?: Property;
  initialPropertyB?: Property;
  onClose?: () => void;
  onSelectProperty?: (property: Property) => void;
}

export const PropertyCompare: React.FC<PropertyCompareProps> = ({
  portfolio,
  allProperties = [],
  initialPropertyA,
  initialPropertyB,
  onClose,
  onSelectProperty
}) => {
  // Available pool of properties: Portfolio items combined with seed properties if needed
  const availableProperties: Property[] = React.useMemo(() => {
    const fromPortfolio = portfolio.map((p) => p.property);
    const combined = [...fromPortfolio];
    allProperties.forEach((p) => {
      if (!combined.some((item) => item.id === p.id)) {
        combined.push(p);
      }
    });
    return combined;
  }, [portfolio, allProperties]);

  // Selected Properties State
  const [propertyAId, setPropertyAId] = useState<string>(
    initialPropertyA?.id || availableProperties[0]?.id || ''
  );
  const [propertyBId, setPropertyBId] = useState<string>(
    initialPropertyB?.id || availableProperties[1]?.id || availableProperties[0]?.id || ''
  );

  const propA = availableProperties.find((p) => p.id === propertyAId) || availableProperties[0];
  const propB = availableProperties.find((p) => p.id === propertyBId) || availableProperties[1] || availableProperties[0];

  // Formatting helpers
  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Calculations for comparisons
  const priceDiff = (propB?.price || 0) - (propA?.price || 0);
  const priceDiffPct = propA?.price ? ((priceDiff / propA.price) * 100).toFixed(1) : '0';

  const areaDiff = (propB?.area_sqft || 0) - (propA?.area_sqft || 0);
  const areaDiffPct = propA?.area_sqft ? ((areaDiff / propA.area_sqft) * 100).toFixed(1) : '0';

  const rateA = propA?.price_per_sqft || (propA?.area_sqft ? Math.round(propA.price / propA.area_sqft) : 0);
  const rateB = propB?.price_per_sqft || (propB?.area_sqft ? Math.round(propB.price / propB.area_sqft) : 0);
  const rateDiff = rateB - rateA;
  const rateDiffPct = rateA ? ((rateDiff / rateA) * 100).toFixed(1) : '0';

  // Rental Yield calculations
  const yieldA = propA?.price ? (((propA.rental_estimate * 12) / propA.price) * 100).toFixed(2) : '0.00';
  const yieldB = propB?.price ? (((propB.rental_estimate * 12) / propB.price) * 100).toFixed(2) : '0.00';

  // Winner logic
  const bestValueProp = rateA <= rateB ? 'A' : 'B';
  const largestAreaProp = propA?.area_sqft >= propB?.area_sqft ? 'A' : 'B';
  const highestYieldProp = Number(yieldA) >= Number(yieldB) ? 'A' : 'B';

  // Common and unique amenities
  const amenitiesA = propA?.amenities || [];
  const amenitiesB = propB?.amenities || [];
  const allAmenities = Array.from(new Set([...amenitiesA, ...amenitiesB]));

  // Swap Property A & B
  const handleSwap = () => {
    const temp = propertyAId;
    setPropertyAId(propertyBId);
    setPropertyBId(temp);
  };

  if (!propA || !propB) {
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-xl text-center space-y-3">
        <p className="text-sm font-semibold text-slate-700">Please save properties to portfolio or load data to compare.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <GitCompare className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Side-by-Side Property Comparison</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Select two properties to analyze price differences, square footage efficiency, and investment potential.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwap}
              className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Swap Sides</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Selection Dropdowns Row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 space-y-1">
            <label className="block text-[11px] font-bold uppercase text-blue-700 tracking-wider">
              Property A (Baseline)
            </label>
            <select
              value={propertyAId}
              onChange={(e) => setPropertyAId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 shadow-sm"
            >
              {availableProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.locality}, {p.city}) - {formatINR(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-1">
            <label className="block text-[11px] font-bold uppercase text-indigo-700 tracking-wider">
              Property B (Comparison)
            </label>
            <select
              value={propertyBId}
              onChange={(e) => setPropertyBId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 shadow-sm"
            >
              {availableProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.locality}, {p.city}) - {formatINR(p.price)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-Side Property Overview Cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Property A Overview Card */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
            Property A
          </div>
          <div className="h-40 rounded-lg overflow-hidden relative border border-slate-200">
            <img src={propA.image} alt={propA.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-xs font-semibold opacity-90">{propA.property_type}</span>
              <h3 className="text-lg font-bold leading-tight">{propA.title}</h3>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900">{formatINR(propA.price)}</div>
            <div className="text-xs text-slate-500 font-medium">
              ₹{rateA.toLocaleString('en-IN')} / sq.ft • {propA.area_sqft} sq.ft
            </div>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>{propA.address}</span>
            </div>
          </div>

          {onSelectProperty && (
            <button
              onClick={() => onSelectProperty(propA)}
              className="w-full py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors border border-slate-200"
            >
              View Full Property Details
            </button>
          )}
        </div>

        {/* Property B Overview Card */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
            Property B
          </div>
          <div className="h-40 rounded-lg overflow-hidden relative border border-slate-200">
            <img src={propB.image} alt={propB.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <span className="text-xs font-semibold opacity-90">{propB.property_type}</span>
              <h3 className="text-lg font-bold leading-tight">{propB.title}</h3>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900">{formatINR(propB.price)}</div>
            <div className="text-xs text-slate-500 font-medium">
              ₹{rateB.toLocaleString('en-IN')} / sq.ft • {propB.area_sqft} sq.ft
            </div>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>{propB.address}</span>
            </div>
          </div>

          {onSelectProperty && (
            <button
              onClick={() => onSelectProperty(propB)}
              className="w-full py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors border border-slate-200"
            >
              View Full Property Details
            </button>
          )}
        </div>
      </div>

      {/* Key Calculated Difference Highlights Banner */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Calculated Difference Metrics</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Quantitative variance between Property A and Property B.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Price Variance */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Price Variance
            </span>
            <div className="text-lg font-extrabold text-slate-900">
              {priceDiff === 0 ? (
                'Identical Price'
              ) : (
                <span className={priceDiff < 0 ? 'text-emerald-600' : 'text-slate-900'}>
                  {priceDiff > 0 ? '+' : ''}{formatINR(priceDiff)} ({priceDiffPct}%)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {priceDiff === 0
                ? 'Both properties carry the same asking price.'
                : priceDiff > 0
                ? `Property B costs ${formatINR(priceDiff)} more than Property A.`
                : `Property B costs ${formatINR(Math.abs(priceDiff))} less than Property A.`}
            </p>
          </div>

          {/* Rate per Sq.Ft Variance */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Rate Variance (/sq.ft)
            </span>
            <div className="text-lg font-extrabold text-slate-900">
              {rateDiff === 0 ? (
                'Identical Rate'
              ) : (
                <span className={rateDiff < 0 ? 'text-emerald-600' : 'text-slate-900'}>
                  {rateDiff > 0 ? '+' : ''}₹{Math.abs(rateDiff).toLocaleString('en-IN')}/sq.ft
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {rateA <= rateB
                ? `Property A offers a cheaper unit rate (₹${rateA.toLocaleString('en-IN')}/sq.ft).`
                : `Property B offers a cheaper unit rate (₹${rateB.toLocaleString('en-IN')}/sq.ft).`}
            </p>
          </div>

          {/* Area & Space Variance */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Area Variance (sq.ft)
            </span>
            <div className="text-lg font-extrabold text-slate-900">
              {areaDiff === 0 ? (
                'Identical Area'
              ) : (
                <span>
                  {areaDiff > 0 ? '+' : ''}{areaDiff} sq.ft ({areaDiffPct}%)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {areaDiff === 0
                ? 'Both properties share exact same carpet area.'
                : areaDiff > 0
                ? `Property B offers ${areaDiff} sq.ft additional floor area.`
                : `Property A offers ${Math.abs(areaDiff)} sq.ft additional floor area.`}
            </p>
          </div>
        </div>

        {/* Category Winner Highlights */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-3">
            <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-emerald-900 block">Best Price Value</span>
              <span className="text-emerald-700 font-medium">
                Property {bestValueProp} (₹{Math.min(rateA, rateB).toLocaleString('en-IN')}/sq.ft)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs flex items-center gap-3">
            <Maximize2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-blue-900 block">Largest Footprint</span>
              <span className="text-blue-700 font-medium">
                Property {largestAreaProp} ({Math.max(propA.area_sqft, propB.area_sqft)} sq.ft)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-indigo-900 block">Highest Rental Yield</span>
              <span className="text-indigo-700 font-medium">
                Property {highestYieldProp} ({Math.max(Number(yieldA), Number(yieldB))}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Attribute Matrix Table */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Detailed Specification Comparison Matrix</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                <th className="p-3.5 w-1/3">Property Attribute</th>
                <th className="p-3.5 w-1/3 text-blue-600">Property A ({propA.locality})</th>
                <th className="p-3.5 w-1/3 text-indigo-600">Property B ({propB.locality})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Asking Market Price</td>
                <td className="p-3.5 font-bold text-slate-900">{formatINR(propA.price)}</td>
                <td className="p-3.5 font-bold text-slate-900">{formatINR(propB.price)}</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Price per Sq.Ft</td>
                <td className="p-3.5 font-medium">₹{rateA.toLocaleString('en-IN')} / sq.ft</td>
                <td className="p-3.5 font-medium">₹{rateB.toLocaleString('en-IN')} / sq.ft</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Carpet Area</td>
                <td className="p-3.5 font-medium">{propA.area_sqft} sq.ft</td>
                <td className="p-3.5 font-medium">{propB.area_sqft} sq.ft</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Layout & Bedrooms</td>
                <td className="p-3.5 font-medium">{propA.bedrooms} BHK ({propA.bathrooms} Bath)</td>
                <td className="p-3.5 font-medium">{propB.bedrooms} BHK ({propB.bathrooms} Bath)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Est. Monthly Rental Income</td>
                <td className="p-3.5 font-medium text-emerald-700 font-bold">₹{propA.rental_estimate?.toLocaleString('en-IN') || '0'} / mo</td>
                <td className="p-3.5 font-medium text-emerald-700 font-bold">₹{propB.rental_estimate?.toLocaleString('en-IN') || '0'} / mo</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Gross Rental Yield</td>
                <td className="p-3.5 font-medium">{yieldA}% / yr</td>
                <td className="p-3.5 font-medium">{yieldB}% / yr</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Floor Elevation</td>
                <td className="p-3.5 font-medium">Floor {propA.floor} of {propA.total_floors}</td>
                <td className="p-3.5 font-medium">Floor {propB.floor} of {propB.total_floors}</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Property Age</td>
                <td className="p-3.5 font-medium">{propA.property_age} Years</td>
                <td className="p-3.5 font-medium">{propB.property_age} Years</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Furnishing Status</td>
                <td className="p-3.5 font-medium">{propA.furnished}</td>
                <td className="p-3.5 font-medium">{propB.furnished}</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Facing Direction</td>
                <td className="p-3.5 font-medium">{propA.facing}</td>
                <td className="p-3.5 font-medium">{propB.facing}</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Locality Safety Score</td>
                <td className="p-3.5 font-medium">{propA.safety_score}/100</td>
                <td className="p-3.5 font-medium">{propB.safety_score}/100</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900">Infrastructure Score</td>
                <td className="p-3.5 font-medium">{propA.infra_score}/100</td>
                <td className="p-3.5 font-medium">{propB.infra_score}/100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Amenities Comparison Section */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Amenities & Lifestyle Features</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {allAmenities.map((amenity, idx) => {
            const hasA = amenitiesA.includes(amenity);
            const hasB = amenitiesB.includes(amenity);
            return (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-800">{amenity}</span>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-bold">A:</span>
                    {hasA ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-bold">B:</span>
                    {hasB ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
