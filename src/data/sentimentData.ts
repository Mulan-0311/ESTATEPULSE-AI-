import { LocalitySentimentData } from '../types';

export const SENTIMENT_DATA_MAP: Record<string, LocalitySentimentData> = {
  'Baner': {
    locality: 'Baner',
    city: 'Pune',
    sentiment_score: 88,
    sentiment_label: 'Bullish Momentum',
    sentiment_momentum: '+6.2 pts (30D)',
    weekly_search_volume: 46800,
    search_growth_mom: 18.5,
    recent_transactions_count: 342,
    avg_deal_price_sqft: 8750,
    avg_days_on_market: 22,
    asking_price_realization: 98.4,
    buyer_to_seller_ratio: 3.8,
    trend_history: [
      { period: 'Apr 2026', search_volume: 38200, transactions: 280, sentiment_index: 80 },
      { period: 'May 2026', search_volume: 40500, transactions: 295, sentiment_index: 82 },
      { period: 'Jun 2026', search_volume: 42100, transactions: 310, sentiment_index: 84 },
      { period: 'Jul 2026', search_volume: 44900, transactions: 328, sentiment_index: 86 },
      { period: 'Aug 2026', search_volume: 46800, transactions: 342, sentiment_index: 88 }
    ],
    recent_deeds: [
      {
        id: 'deed-01',
        project_name: 'Supreme Estia Phase 2',
        unit_type: '3 BHK High-Rise',
        area_sqft: 1420,
        transacted_price: 12500000,
        date: '10 Aug 2026',
        price_sqft: 8802
      },
      {
        id: 'deed-02',
        project_name: 'VTP Skylights Tower B',
        unit_type: '2 BHK Smart',
        area_sqft: 1040,
        transacted_price: 9350000,
        date: '08 Aug 2026',
        price_sqft: 8990
      },
      {
        id: 'deed-03',
        project_name: 'Pride Purple Park Connect',
        unit_type: '3 BHK Luxury',
        area_sqft: 1380,
        transacted_price: 11900000,
        date: '05 Aug 2026',
        price_sqft: 8623
      },
      {
        id: 'deed-04',
        project_name: 'Kasturi Apostle Residences',
        unit_type: '4 BHK Duplex',
        area_sqft: 2850,
        transacted_price: 26800000,
        date: '02 Aug 2026',
        price_sqft: 9403
      }
    ],
    sentiment_drivers: [
      {
        factor: 'High Buyer Inquiries',
        impact: 'positive',
        detail: 'Search volume spiked +18.5% MoM following announcement of Metro Line 3 trial runs.'
      },
      {
        factor: 'Fast Absorption Speed',
        impact: 'positive',
        detail: 'Average days on market lowered to 22 days against Pune city average of 42 days.'
      },
      {
        factor: 'Narrow Negotiation Gap',
        impact: 'positive',
        detail: 'Asking price realization sits at 98.4%, indicating minimal seller discounting.'
      }
    ]
  },
  'Kharadi': {
    locality: 'Kharadi',
    city: 'Pune',
    sentiment_score: 92,
    sentiment_label: 'Strong Seller Market',
    sentiment_momentum: '+8.1 pts (30D)',
    weekly_search_volume: 52400,
    search_growth_mom: 22.4,
    recent_transactions_count: 395,
    avg_deal_price_sqft: 10450,
    avg_days_on_market: 18,
    asking_price_realization: 99.1,
    buyer_to_seller_ratio: 4.5,
    trend_history: [
      { period: 'Apr 2026', search_volume: 41200, transactions: 310, sentiment_index: 83 },
      { period: 'May 2026', search_volume: 44000, transactions: 330, sentiment_index: 85 },
      { period: 'Jun 2026', search_volume: 47500, transactions: 360, sentiment_index: 88 },
      { period: 'Jul 2026', search_volume: 50100, transactions: 380, sentiment_index: 90 },
      { period: 'Aug 2026', search_volume: 52400, transactions: 395, sentiment_index: 92 }
    ],
    recent_deeds: [
      {
        id: 'deed-kh-01',
        project_name: 'Gera Planet of Joy',
        unit_type: '3 BHK ChildCentric',
        area_sqft: 1510,
        transacted_price: 15800000,
        date: '11 Aug 2026',
        price_sqft: 10463
      },
      {
        id: 'deed-kh-02',
        project_name: 'Panchshil Towers B4',
        unit_type: '3.5 BHK Luxury',
        area_sqft: 2200,
        transacted_price: 25500000,
        date: '07 Aug 2026',
        price_sqft: 11590
      },
      {
        id: 'deed-kh-03',
        project_name: 'Kolte Patil Tuscan Estate',
        unit_type: '3 BHK Signature',
        area_sqft: 1650,
        transacted_price: 17200000,
        date: '04 Aug 2026',
        price_sqft: 10424
      }
    ],
    sentiment_drivers: [
      {
        factor: 'WTC & IT Corridor Proximity',
        impact: 'positive',
        detail: 'Sustained hiring expansions across Barclays & UBS campus fueling 3BHK demand.'
      },
      {
        factor: 'Ultra-Low Inventory',
        impact: 'positive',
        detail: 'Under-construction inventory levels down 28% YoY driving intense bidding.'
      }
    ]
  },
  'Powai': {
    locality: 'Powai',
    city: 'Mumbai',
    sentiment_score: 86,
    sentiment_label: 'Bullish Momentum',
    sentiment_momentum: '+4.5 pts (30D)',
    weekly_search_volume: 61200,
    search_growth_mom: 12.8,
    recent_transactions_count: 288,
    avg_deal_price_sqft: 24350,
    avg_days_on_market: 29,
    asking_price_realization: 97.6,
    buyer_to_seller_ratio: 3.2,
    trend_history: [
      { period: 'Apr 2026', search_volume: 54000, transactions: 250, sentiment_index: 80 },
      { period: 'May 2026', search_volume: 56200, transactions: 260, sentiment_index: 82 },
      { period: 'Jun 2026', search_volume: 58000, transactions: 272, sentiment_index: 84 },
      { period: 'Jul 2026', search_volume: 59800, transactions: 280, sentiment_index: 85 },
      { period: 'Aug 2026', search_volume: 61200, transactions: 288, sentiment_index: 86 }
    ],
    recent_deeds: [
      {
        id: 'deed-pw-01',
        project_name: 'Hiranandani Castle Rock',
        unit_type: '2 BHK Premium',
        area_sqft: 880,
        transacted_price: 22800000,
        date: '09 Aug 2026',
        price_sqft: 25909
      },
      {
        id: 'deed-pw-02',
        project_name: 'L&T Emerald Isle Phase 2',
        unit_type: '3 BHK Lake View',
        area_sqft: 1350,
        transacted_price: 33500000,
        date: '06 Aug 2026',
        price_sqft: 24814
      }
    ],
    sentiment_drivers: [
      {
        factor: 'Township Living Demand',
        impact: 'positive',
        detail: 'Strong institutional and senior tech executive preference for integrated Hiranandani amenities.'
      },
      {
        factor: 'High Ticket Values',
        impact: 'neutral',
        detail: 'Slightly elongated due-diligence cycles on properties priced above ₹4.5 Crore.'
      }
    ]
  },
  'Bandra': {
    locality: 'Bandra',
    city: 'Mumbai',
    sentiment_score: 90,
    sentiment_label: 'Strong Seller Market',
    sentiment_momentum: '+3.8 pts (30D)',
    weekly_search_volume: 78500,
    search_growth_mom: 15.2,
    recent_transactions_count: 195,
    avg_deal_price_sqft: 48800,
    avg_days_on_market: 34,
    asking_price_realization: 98.9,
    buyer_to_seller_ratio: 5.1,
    trend_history: [
      { period: 'Apr 2026', search_volume: 70000, transactions: 170, sentiment_index: 86 },
      { period: 'May 2026', search_volume: 72500, transactions: 178, sentiment_index: 87 },
      { period: 'Jun 2026', search_volume: 74800, transactions: 185, sentiment_index: 88 },
      { period: 'Jul 2026', search_volume: 76900, transactions: 190, sentiment_index: 89 },
      { period: 'Aug 2026', search_volume: 78500, transactions: 195, sentiment_index: 90 }
    ],
    recent_deeds: [
      {
        id: 'deed-ba-01',
        project_name: 'Rustomjee Seasons BKC Con.',
        unit_type: '3 BHK Sea Breeze',
        area_sqft: 1450,
        transacted_price: 71000000,
        date: '11 Aug 2026',
        price_sqft: 48965
      },
      {
        id: 'deed-ba-02',
        project_name: 'Pali Hill Boutique Residences',
        unit_type: '4 BHK Penthouse',
        area_sqft: 2600,
        transacted_price: 135000000,
        date: '03 Aug 2026',
        price_sqft: 51923
      }
    ],
    sentiment_drivers: [
      {
        factor: 'Prestige Scarcity',
        impact: 'positive',
        detail: 'Severe scarcity of land parcels in West Bandra keeps buyer competition elevated.'
      }
    ]
  },
  'Whitefield': {
    locality: 'Whitefield',
    city: 'Bengaluru',
    sentiment_score: 89,
    sentiment_label: 'Bullish Momentum',
    sentiment_momentum: '+7.4 pts (30D)',
    weekly_search_volume: 58900,
    search_growth_mom: 21.0,
    recent_transactions_count: 420,
    avg_deal_price_sqft: 10850,
    avg_days_on_market: 20,
    asking_price_realization: 98.7,
    buyer_to_seller_ratio: 4.1,
    trend_history: [
      { period: 'Apr 2026', search_volume: 46000, transactions: 330, sentiment_index: 80 },
      { period: 'May 2026', search_volume: 49500, transactions: 355, sentiment_index: 83 },
      { period: 'Jun 2026', search_volume: 53000, transactions: 380, sentiment_index: 85 },
      { period: 'Jul 2026', search_volume: 56500, transactions: 405, sentiment_index: 87 },
      { period: 'Aug 2026', search_volume: 58900, transactions: 420, sentiment_index: 89 }
    ],
    recent_deeds: [
      {
        id: 'deed-wf-01',
        project_name: 'Prestige Boulevard Vista',
        unit_type: '3 BHK Tech-Park View',
        area_sqft: 1680,
        transacted_price: 18200000,
        date: '12 Aug 2026',
        price_sqft: 10833
      },
      {
        id: 'deed-wf-02',
        project_name: 'Sobha Windsor Tudor',
        unit_type: '4 BHK Luxury',
        area_sqft: 2250,
        transacted_price: 24800000,
        date: '08 Aug 2026',
        price_sqft: 11022
      }
    ],
    sentiment_drivers: [
      {
        factor: 'Purple Metro Line Extension',
        impact: 'positive',
        detail: 'Direct commute to CBD without traffic bottlenecks has boosted end-user demand.'
      }
    ]
  },
  'Gachibowli': {
    locality: 'Gachibowli',
    city: 'Hyderabad',
    sentiment_score: 91,
    sentiment_label: 'Strong Seller Market',
    sentiment_momentum: '+9.3 pts (30D)',
    weekly_search_volume: 51200,
    search_growth_mom: 24.6,
    recent_transactions_count: 365,
    avg_deal_price_sqft: 11050,
    avg_days_on_market: 19,
    asking_price_realization: 99.0,
    buyer_to_seller_ratio: 4.6,
    trend_history: [
      { period: 'Apr 2026', search_volume: 39000, transactions: 270, sentiment_index: 81 },
      { period: 'May 2026', search_volume: 42000, transactions: 295, sentiment_index: 84 },
      { period: 'Jun 2026', search_volume: 46000, transactions: 325, sentiment_index: 87 },
      { period: 'Jul 2026', search_volume: 49000, transactions: 350, sentiment_index: 89 },
      { period: 'Aug 2026', search_volume: 51200, transactions: 365, sentiment_index: 91 }
    ],
    recent_deeds: [
      {
        id: 'deed-gb-01',
        project_name: 'My Home Bhooja Sky',
        unit_type: '3 BHK High-Floor',
        area_sqft: 2595,
        transacted_price: 29000000,
        date: '10 Aug 2026',
        price_sqft: 11175
      },
      {
        id: 'deed-gb-02',
        project_name: 'Aparna Serene Park',
        unit_type: '2 BHK Compact',
        area_sqft: 1290,
        transacted_price: 13900000,
        date: '06 Aug 2026',
        price_sqft: 10775
      }
    ],
    sentiment_drivers: [
      {
        factor: 'Financial District Expansion',
        impact: 'positive',
        detail: 'Global capability centres (GCCs) expanding headcounts in Hyderabad.'
      }
    ]
  },
  'DLF Phase 5': {
    locality: 'DLF Phase 5',
    city: 'Delhi NCR',
    sentiment_score: 87,
    sentiment_label: 'Bullish Momentum',
    sentiment_momentum: '+5.1 pts (30D)',
    weekly_search_volume: 44600,
    search_growth_mom: 14.3,
    recent_transactions_count: 145,
    avg_deal_price_sqft: 29400,
    avg_days_on_market: 32,
    asking_price_realization: 98.2,
    buyer_to_seller_ratio: 3.5,
    trend_history: [
      { period: 'Apr 2026', search_volume: 38000, transactions: 120, sentiment_index: 80 },
      { period: 'May 2026', search_volume: 40000, transactions: 128, sentiment_index: 82 },
      { period: 'Jun 2026', search_volume: 42000, transactions: 135, sentiment_index: 84 },
      { period: 'Jul 2026', search_volume: 43500, transactions: 140, sentiment_index: 85 },
      { period: 'Aug 2026', search_volume: 44600, transactions: 145, sentiment_index: 87 }
    ],
    recent_deeds: [
      {
        id: 'deed-dlf-01',
        project_name: 'The Camellias Super Luxury',
        unit_type: '4 BHK Golf View',
        area_sqft: 7200,
        transacted_price: 215000000,
        date: '07 Aug 2026',
        price_sqft: 29861
      }
    ],
    sentiment_drivers: [
      {
        factor: 'Golf Course Road Infrastructure',
        impact: 'positive',
        detail: 'Signal-free corridor and luxury club amenities commanding top national pricing.'
      }
    ]
  }
};
