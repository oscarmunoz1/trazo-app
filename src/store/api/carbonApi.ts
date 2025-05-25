import { baseApi } from './baseApi';

export interface CarbonSummary {
  totalEmissions: number;
  totalOffsets: number;
  netFootprint: number;
  carbonScore: number;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    isVerified: boolean;
  }>;
}

export interface CarbonBenchmark {
  cropType: string;
  benchmarkValue: number; // kg CO2e/kg
  source: string;
  year: number;
}

export interface CarbonRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  implementationCost: number;
  paybackPeriod: number; // in months
  category: 'energy' | 'water' | 'waste' | 'soil' | 'equipment';
}

export interface CarbonEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'planting' | 'harvesting' | 'weather' | 'chemical' | 'general';
  carbonImpact: number;
  photos?: string[];
}

export interface CarbonCalculationResult {
  co2e: number;
  efficiency_score: number;
  usda_verified: boolean;
  calculation_method: string;
  event_type:
    | 'chemical'
    | 'production'
    | 'weather'
    | 'general'
    | 'equipment'
    | 'soil_management'
    | 'business'
    | 'pest_management';
  timestamp: string;
  breakdown?: {
    nitrogen_emissions?: number;
    phosphorus_emissions?: number;
    potassium_emissions?: number;
    application_efficiency?: number;
    volume_liters?: number;
    area_hectares?: number;
    fuel_amount?: number;
    fuel_type?: string;
    equipment_type?: string;
    carbon_sequestration?: number;
    carbon_release?: number;
    soil_ph?: number;
    organic_matter?: number;
    transport_emissions?: number;
    carbon_credits?: number;
    revenue_impact?: number;
    chemical_avoidance?: number;
    monitoring_emissions?: number;
    pest_pressure?: string;
  };
  cost_analysis?: {
    estimated_cost: number;
    cost_per_co2e: number;
  };
  recommendations?: Array<{
    type: string;
    title: string;
    description: string;
    potential_savings: number;
    carbon_reduction: number;
  }>;
  error?: string;
  warning?: string;
}

export interface EventCarbonCalculationRequest {
  event_type:
    | 'chemical'
    | 'production'
    | 'weather'
    | 'general'
    | 'equipment'
    | 'soil_management'
    | 'business'
    | 'pest_management';
  event_data: Record<string, any>;
}

export interface QRCodeSummary {
  carbonScore: number;
  totalEmissions: number;
  totalOffsets: number;
  netFootprint: number;
  relatableFootprint: string; // e.g., "like driving 1 mile"
  industryPercentile: number;
  industryAverage: number;
  isUsdaVerified?: boolean;
  verificationDate?: string;
  reports?: Array<{
    id: string;
    period_start: string;
    period_end: string;
    total_emissions: number;
    total_offsets: number;
    net_footprint: number;
    document: string | null;
    report_type: string;
  }>;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  farmer?: {
    id: string;
    name: string;
    location: string;
    description: string;
    photo?: string;
    email?: string;
    phone?: string;
    website?: string;
    certifications?: Array<{
      name: string;
      icon?: string;
      description?: string;
    }>;
  };
  farmerStory?: string;
  timeline?: Array<{
    date: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  emissionsByCategory?: Record<string, number>;
  emissionsBySource?: Record<string, number>;
  offsetsByAction?: Record<string, number>;
  recommendations?: string[];
  socialProof?: {
    totalScans: number;
    totalOffsets: number;
    totalUsers: number;
    averageRating: number;
  };
}

export const carbonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Producer endpoints
    getEstablishmentCarbonSummary: builder.query<CarbonSummary, string>({
      query: (establishmentId) => ({
        url: `carbon/establishments/${establishmentId}/summary/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    getProductionCarbonSummary: builder.query<CarbonSummary, string>({
      query: (productionId) => ({
        url: `carbon/productions/${productionId}/summary/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    getCarbonBenchmarks: builder.query<CarbonBenchmark[], void>({
      query: () => ({
        url: 'carbon/benchmarks/',
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['CarbonBenchmarks']
    }),

    // Consumer endpoints
    getQRCodeSummary: builder.query<QRCodeSummary, string>({
      query: (productionId) => ({
        url: `carbon/public/productions/${productionId}/qr-summary/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    getPublicCarbonSummary: builder.query<CarbonSummary, string>({
      query: (productionId) => ({
        url: `carbon/public/productions/${productionId}/summary/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    getProductionTimeline: builder.query<CarbonEvent[], string>({
      query: (productionId) => ({
        url: `carbon/productions/${productionId}/timeline/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    // Offset endpoints
    createOffset: builder.mutation<
      { success: boolean; transactionId: string },
      {
        production: string; // Changed from productionId to production to match backend expectations
        amount: number;
        source_id: string;
        type: string;
        year: number;
      }
    >({
      query: (data) => ({
        url: 'carbon/offsets/',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['CarbonSummary']
    }),

    // Real-time event carbon calculation
    calculateEventCarbonImpact: builder.mutation<
      CarbonCalculationResult,
      EventCarbonCalculationRequest
    >({
      query: (data) => ({
        url: 'carbon/calculate-event-impact/',
        method: 'POST',
        body: data,
        credentials: 'include'
      })
    })
  })
});

export const {
  useGetEstablishmentCarbonSummaryQuery,
  useGetProductionCarbonSummaryQuery,
  useGetCarbonBenchmarksQuery,
  useGetQRCodeSummaryQuery,
  useGetPublicCarbonSummaryQuery,
  useGetProductionTimelineQuery,
  useCreateOffsetMutation,
  useCalculateEventCarbonImpactMutation
} = carbonApi;
