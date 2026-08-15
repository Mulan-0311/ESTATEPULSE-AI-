import React, { useState } from 'react';
import { ValuationInput } from '../types';
import {
  Calculator,
  Building2,
  MapPin,
  Sparkles,
  Bed,
  Bath,
  Maximize2,
  Layers,
  Clock,
  ShieldCheck,
  Train,
  School,
  Hospital,
  Building,
  CheckCircle2
} from 'lucide-react';

interface ValuationFormPageProps {
  onSubmit: (input: ValuationInput) => void;
  isLoading: boolean;
}

export const ValuationFormPage: React.FC<ValuationFormPageProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ValuationInput>({
    property_type: 'Apartment',
    city: 'Pune',
    locality: 'Baner',
    area_sqft: 1450,
    bedrooms: 3,
    bathrooms: 2,
    floor: 7,
    total_floors: 14,
    property_age: 5,
    furnished: 'Semi-Furnished',
    parking: true,
    balcony: 2,
    facing: 'East',
    amenities: ['Gymnasium', 'Swimming Pool', '24/7 Security', 'Power Backup', 'Clubhouse'],
    metro_dist_km: 1.2,
    school_dist_km: 0.8,
    hospital_dist_km: 1.5,
    commercial_dist_km: 2.0,
    crime_safety_score: 88,
    neighborhood_dev_score: 91
  });

  const availableAmenities = [
    'Gymnasium',
    'Swimming Pool',
    '24/7 Security',
    'Power Backup',
    'Clubhouse',
    'Children Play Area',
    'EV Charging Point',
    'Tennis Court',
    'Private Garden',
    'Roof Terrace'
  ];

  const handleAmenityToggle = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({ ...formData, amenities: formData.amenities.filter((a) => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  const handleApplyPreset = (presetType: 'pune' | 'mumbai' | 'blr') => {
    if (presetType === 'pune') {
      setFormData({
        property_type: 'Apartment',
        city: 'Pune',
        locality: 'Baner',
        area_sqft: 1450,
        bedrooms: 3,
        bathrooms: 2,
        floor: 7,
        total_floors: 14,
        property_age: 5,
        furnished: 'Semi-Furnished',
        parking: true,
        balcony: 2,
        facing: 'East',
        amenities: ['Gymnasium', 'Swimming Pool', '24/7 Security', 'Power Backup', 'Clubhouse'],
        metro_dist_km: 1.2,
        school_dist_km: 0.8,
        hospital_dist_km: 1.5,
        commercial_dist_km: 2.0,
        crime_safety_score: 88,
        neighborhood_dev_score: 91
      });
    } else if (presetType === 'mumbai') {
      setFormData({
        property_type: 'Apartment',
        city: 'Mumbai',
        locality: 'Powai',
        area_sqft: 1250,
        bedrooms: 2,
        bathrooms: 2,
        floor: 12,
        total_floors: 28,
        property_age: 4,
        furnished: 'Fully Furnished',
        parking: true,
        balcony: 1,
        facing: 'North-East',
        amenities: ['Gymnasium', 'Swimming Pool', '24/7 Security', 'Power Backup', 'Clubhouse', 'Tennis Court'],
        metro_dist_km: 0.8,
        school_dist_km: 0.5,
        hospital_dist_km: 1.0,
        commercial_dist_km: 1.2,
        crime_safety_score: 92,
        neighborhood_dev_score: 95
      });
    } else if (presetType === 'blr') {
      setFormData({
        property_type: 'Apartment',
        city: 'Bengaluru',
        locality: 'Whitefield',
        area_sqft: 1680,
        bedrooms: 3,
        bathrooms: 3,
        floor: 9,
        total_floors: 18,
        property_age: 3,
        furnished: 'Semi-Furnished',
        parking: true,
        balcony: 2,
        facing: 'East',
        amenities: ['Gymnasium', 'Swimming Pool', '24/7 Security', 'Power Backup', 'Clubhouse', 'EV Charging Point'],
        metro_dist_km: 1.0,
        school_dist_km: 1.2,
        hospital_dist_km: 1.8,
        commercial_dist_km: 1.5,
        crime_safety_score: 90,
        neighborhood_dev_score: 93
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">AI Property Valuation Form</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fill in property details below to calculate predictive market value using machine learning.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('pune')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/30 transition-colors"
          >
            Pune 3BHK
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('mumbai')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/30 transition-colors"
          >
            Mumbai 2BHK
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('blr')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/30 transition-colors"
          >
            Blr 3BHK
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Location & Type */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>1. Location & Property Type</span>
          </h3>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">City</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Locality</label>
              <input
                type="text"
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                placeholder="e.g. Baner, Powai, Whitefield"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Property Type</label>
              <select
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Studio">Studio</option>
                <option value="Plot">Plot</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Physical Specifications */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>2. Size & Physical Specifications</span>
          </h3>

          <div className="grid sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Area (sq.ft)</label>
              <input
                type="number"
                value={formData.area_sqft}
                onChange={(e) => setFormData({ ...formData, area_sqft: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                required
                min={300}
                max={15000}
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Bedrooms (BHK)</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                required
                min={1}
                max={10}
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                required
                min={1}
                max={10}
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Construction Age (Yrs)</label>
              <input
                type="number"
                value={formData.property_age}
                onChange={(e) => setFormData({ ...formData, property_age: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                required
                min={0}
                max={50}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 text-xs pt-2">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Floor Number</label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                min={0}
                max={60}
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Total Floors in Building</label>
              <input
                type="number"
                value={formData.total_floors}
                onChange={(e) => setFormData({ ...formData, total_floors: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                min={1}
                max={60}
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Furnishing</label>
              <select
                value={formData.furnished}
                onChange={(e) => setFormData({ ...formData, furnished: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully Furnished">Fully Furnished</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Facing Direction</label>
              <select
                value={formData.facing}
                onChange={(e) => setFormData({ ...formData, facing: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="East">East</option>
                <option value="North-East">North-East</option>
                <option value="North">North</option>
                <option value="West">West</option>
                <option value="South">South</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Amenities & Society Facilities */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>3. Amenities & Society Features</span>
            </span>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-normal">
              <input
                type="checkbox"
                checked={formData.parking}
                onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                className="rounded accent-cyan-500"
              />
              <span>Reserved Parking Slot</span>
            </label>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
            {availableAmenities.map((amenity) => {
              const isSelected = formData.amenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{amenity}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Connectivity & Neighborhood Metrics */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>4. Connectivity & Neighborhood Ratings</span>
          </h3>

          <div className="grid sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Metro / Railway (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.metro_dist_km}
                onChange={(e) => setFormData({ ...formData, metro_dist_km: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">School Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.school_dist_km}
                onChange={(e) => setFormData({ ...formData, school_dist_km: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Hospital Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.hospital_dist_km}
                onChange={(e) => setFormData({ ...formData, hospital_dist_km: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Commercial Hub (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.commercial_dist_km}
                onChange={(e) => setFormData({ ...formData, commercial_dist_km: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Crime / Safety Index</span>
                <span className="text-cyan-400 font-bold">{formData.crime_safety_score} / 100</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={formData.crime_safety_score}
                onChange={(e) => setFormData({ ...formData, crime_safety_score: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Neighborhood Infra Score</span>
                <span className="text-cyan-400 font-bold">{formData.neighborhood_dev_score} / 100</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={formData.neighborhood_dev_score}
                onChange={(e) => setFormData({ ...formData, neighborhood_dev_score: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform active:scale-98 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Processing XGBoost Model Valuation...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-slate-950" />
                <span>Generate AI Property Valuation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
