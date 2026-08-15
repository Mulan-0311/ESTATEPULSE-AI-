import React from 'react';
import { Property } from '../types';
import { MapPin, Bed, Bath, Maximize2, Bookmark, ExternalLink } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onSave?: (property: Property) => void;
  isSaved?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onSave,
  isSaved = false
}) => {
  const formattedPrice =
    property.price >= 10000000
      ? `₹${(property.price / 10000000).toFixed(2)} Cr`
      : `₹${(property.price / 100000).toFixed(0)} Lakhs`;

  return (
    <div className="rounded-xl bg-white border border-slate-200 overflow-hidden hover:border-slate-300 transition-all duration-300 shadow-sm flex flex-col group">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md bg-white/90 text-blue-700 border border-slate-200 shadow-sm backdrop-blur-sm">
            {property.property_type}
          </span>
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md bg-emerald-600 text-white shadow-sm">
            AI Valued
          </span>
        </div>

        {onSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(property);
            }}
            className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/80 text-slate-700 hover:text-slate-900 hover:bg-white shadow-sm'
            }`}
            title={isSaved ? 'Saved in Portfolio' : 'Save Property'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
          <div>
            <div className="text-xl font-extrabold">{formattedPrice}</div>
            <div className="text-[11px] text-slate-200 font-medium">
              ₹{property.price_per_sqft.toLocaleString('en-IN')}/sq.ft
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-blue-300">
              ₹{property.rental_estimate.toLocaleString('en-IN')}/mo
            </div>
            <div className="text-[10px] text-slate-300">Est. Rent</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-blue-600" />
            <span>{property.bedrooms} BHK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-blue-600" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{property.area_sqft} sqft</span>
          </div>
        </div>

        <button
          onClick={() => onSelect(property)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <span>View Valuation Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
