import React, { useState } from 'react';
import { VisionAnalysisResult } from '../types';
import { Eye, Upload, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const PropertyVisionPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult>({
    visual_score: 86,
    interior_condition: 'Well Maintained',
    natural_lighting_score: 90,
    finish_quality_score: 84,
    space_perception_score: 88,
    renovation_potential: 'High Upside',
    estimated_value_impact_pct: 4.5,
    detected_features: [
      'Abundant natural sunlight from east-facing balconies',
      'Vitrified tile flooring in pristine condition',
      'Modern modular kitchen setup with quartz countertop',
      'Spacious open floor plan layout'
    ],
    recommendations: [
      'Adding accent LED cove lighting in living area can increase buyer appeal.',
      'Minor bathroom fixture upgrades estimated to boost total valuation by +₹1.5 Lakhs.'
    ]
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        runVisionAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const runVisionAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        visual_score: 89,
        interior_condition: 'Luxury/Modern',
        natural_lighting_score: 92,
        finish_quality_score: 88,
        space_perception_score: 90,
        renovation_potential: 'Already Turnkey',
        estimated_value_impact_pct: 6.2,
        detected_features: [
          'Italian marble flooring throughout living hall',
          'Full-height double glazed floor-to-ceiling balcony glass',
          'Custom oak wood paneling & ambient lighting recessed fixtures',
          'Prerelease smart home automation hubs'
        ],
        recommendations: [
          'Property is in turnkey luxury condition requiring no capital expenditure prior to sale.',
          'Highlighted luxury finishes justify top-tier valuation benchmark (+6.2% premium).'
        ]
      });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">Property Vision Analysis</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual heuristic evaluation scoring natural lighting, interior finish, and renovation potential.
          </p>
        </div>

        <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20">
          <Upload className="w-4 h-4" />
          <span>Upload Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Main Analysis Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Photo Preview Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Selected Property Photo</h3>
          {selectedImage ? (
            <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={selectedImage}
                alt="Property Photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-900/90 text-cyan-400 font-bold border border-cyan-500/30">
                  Visual Analysis Loaded
                </span>
                <button
                  onClick={runVisionAnalysis}
                  className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold rounded hover:bg-cyan-400 transition-colors"
                >
                  Re-Analyze
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-xl border border-dashed border-slate-700 bg-slate-950 flex flex-col items-center justify-center text-xs text-slate-500 space-y-2">
              <Upload className="w-8 h-8 text-slate-600" />
              <span>Drag & drop or upload property photo</span>
            </div>
          )}
        </div>

        {/* Visual Score Gauge */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Visual Property Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl font-extrabold text-white">
                {isAnalyzing ? '...' : analysisResult.visual_score}
              </span>
              <span className="text-sm text-slate-400 font-semibold">/ 100</span>
              <span className="ml-auto px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                +{analysisResult.estimated_value_impact_pct}% Value Premium
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Natural Lighting</span>
                <span className="text-cyan-400">{analysisResult.natural_lighting_score}%</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${analysisResult.natural_lighting_score}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Finish Quality</span>
                <span className="text-cyan-400">{analysisResult.finish_quality_score}%</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${analysisResult.finish_quality_score}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Space Perception</span>
                <span className="text-cyan-400">{analysisResult.space_perception_score}%</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${analysisResult.space_perception_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Breakdown List */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Detected Architectural & Interior Features</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          {analysisResult.detected_features.map((feat, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
