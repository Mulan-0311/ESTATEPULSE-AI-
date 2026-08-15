export type PropertyType = 'Apartment' | 'Villa' | 'Penthouse' | 'Plot' | 'Commercial' | 'Studio';

export interface Property {
  id: string;
  title: string;
  city: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  property_type: PropertyType;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  total_floors: number;
  property_age: number; // in years
  furnished: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  parking: boolean;
  balcony: number;
  facing: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'South-East';
  amenities: string[];
  price: number; // in INR
  price_per_sqft: number;
  rental_estimate: number; // monthly INR
  image: string;
  description: string;
  safety_score: number; // 0-100
  connectivity_score: number; // 0-100
  infra_score: number; // 0-100
  created_at: string;
}

export interface ValuationInput {
  property_type: PropertyType;
  city: string;
  locality: string;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  total_floors: number;
  property_age: number;
  furnished: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  parking: boolean;
  balcony: number;
  facing: string;
  amenities: string[];
  metro_dist_km: number;
  school_dist_km: number;
  hospital_dist_km: number;
  commercial_dist_km: number;
  crime_safety_score: number;
  neighborhood_dev_score: number;
}

export interface FeatureContribution {
  feature: string;
  impact_amount: number; // +/- INR
  impact_percentage: number; // +/- %
  description: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface ValuationResult {
  id: string;
  property_input: ValuationInput;
  estimated_value: number; // in INR
  lower_range: number;
  upper_range: number;
  price_per_sqft: number;
  reliability_score: number; // 0-100
  investment_score: number; // 0-100
  rental_estimate: number;
  annual_appreciation_pct: number;
  market_percentile: number;
  valuation_explanation: string;
  feature_contributions: FeatureContribution[];
  top_positives: string[];
  top_negatives: string[];
  is_demo_valuation?: boolean;
  created_at: string;
}

export interface ComparableProperty {
  property: Property;
  similarity_score: number; // 0-100
  distance_km: number;
  price_diff_pct: number;
  why_comparable: string;
}

export interface NeighborhoodData {
  id: string;
  city: string;
  locality: string;
  latitude: number;
  longitude: number;
  average_price: number;
  average_price_per_sqft: number;
  annual_growth: number; // %
  three_year_growth: number; // %
  rental_yield: number; // %
  demand_score: number; // 0-100
  infrastructure_score: number; // 0-100
  connectivity_score: number; // 0-100
  safety_score: number; // 0-100
  investment_score: number; // 0-100
  summary: string;
  nearby_landmarks: string[];
  historical_prices: { year: string; price_sqft: number }[];
}

export interface InvestmentInput {
  purchase_price: number;
  down_payment: number;
  loan_amount: number;
  interest_rate: number;
  tenure_years: number;
  monthly_rent: number;
  maintenance_monthly: number;
  property_tax_annual: number;
  expected_appreciation_pct: number;
  holding_period_years: number;
}

export interface InvestmentResult {
  annual_rental_income: number;
  net_annual_cashflow: number;
  rental_yield_pct: number;
  cash_on_cash_return_pct: number;
  total_roi_pct: number;
  estimated_future_value: number;
  total_net_profit: number;
  break_even_years: number;
  investment_verdict: 'Strong Buy' | 'Good Investment' | 'Moderate Opportunity' | 'High Risk' | 'Overpriced';
  verdict_reason: string;
  yearly_projections: {
    year: number;
    property_value: number;
    cumulative_rent: number;
    loan_balance: number;
    net_equity: number;
  }[];
}

export interface EMIInput {
  property_price: number;
  down_payment_pct: number;
  loan_amount: number;
  interest_rate: number;
  tenure_years: number;
}

export interface EMIResult {
  monthly_emi: number;
  principal_amount: number;
  total_interest: number;
  total_payment: number;
  affordability_rating: 'Extremely Affordable' | 'Comfortable' | 'Stretch Budget' | 'High Financial Strain';
  monthly_income_required: number;
  amortization_schedule: {
    year: number;
    principal_paid: number;
    interest_paid: number;
    remaining_balance: number;
  }[];
}

export interface VisionAnalysisResult {
  visual_score: number; // 0-100
  interior_condition: 'Luxury/Modern' | 'Well Maintained' | 'Average' | 'Needs Renovation';
  natural_lighting_score: number;
  finish_quality_score: number;
  space_perception_score: number;
  renovation_potential: 'High Upside' | 'Moderate' | 'Already Turnkey';
  estimated_value_impact_pct: number; // e.g. +5% or -3%
  detected_features: string[];
  recommendations: string[];
}

export interface SavedProperty {
  id: string;
  property: Property;
  notes?: string;
  saved_at: string;
  custom_valuation?: ValuationResult;
}

export interface MLMetrics {
  best_model: string;
  models: {
    name: string;
    r2_score: number;
    mae_inr: number;
    rmse_inr: number;
    training_samples: number;
  }[];
  feature_importance: { feature: string; importance_pct: number }[];
  last_trained: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  related_property_id?: string;
}

export interface LocalitySentimentData {
  locality: string;
  city: string;
  sentiment_score: number; // 0-100
  sentiment_label: 'Strong Seller Market' | 'Bullish Momentum' | 'Balanced Growth' | 'Cooling' | 'Buyer Favored';
  sentiment_momentum: string;
  weekly_search_volume: number;
  search_growth_mom: number; // %
  recent_transactions_count: number;
  avg_deal_price_sqft: number;
  avg_days_on_market: number;
  asking_price_realization: number; // %
  buyer_to_seller_ratio: number;
  trend_history: {
    period: string;
    search_volume: number;
    transactions: number;
    sentiment_index: number;
  }[];
  recent_deeds: {
    id: string;
    project_name: string;
    unit_type: string;
    area_sqft: number;
    transacted_price: number;
    date: string;
    price_sqft: number;
  }[];
  sentiment_drivers: {
    factor: string;
    impact: 'positive' | 'neutral' | 'negative';
    detail: string;
  }[];
}
