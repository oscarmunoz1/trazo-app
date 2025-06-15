import baseApi from './baseApi';

export interface CarbonCreditPotential {
  tons_sequestered: number;
  market_rate_per_ton: number;
  potential_revenue: number;
  confidence: string;
  verification_needed: boolean;
  next_steps: string[];
}

export interface EfficiencyTip {
  category: string;
  title: string;
  description: string;
  potential_savings: string;
  carbon_impact: string;
  priority: string;
}

export interface PremiumEligibility {
  eligible: boolean;
  level: string;
  score: number;
  criteria_met: {
    carbon_tracking: boolean;
    regular_monitoring: boolean;
    carbon_sequestration: boolean;
  };
  potential_premium: string;
  next_steps: string[];
}

export interface NextAction {
  action: string;
  description: string;
  impact: string;
}

export interface CarbonEconomics {
  carbon_credit_potential: CarbonCreditPotential;
  efficiency_tips: EfficiencyTip[];
  premium_eligibility: PremiumEligibility;
  next_actions: NextAction[];
  generated_at: string;
}

export interface EstablishmentCarbonSummary {
  establishment_name: string;
  total_productions: number;
  total_carbon_sequestered_tons: number;
  total_carbon_credit_potential: number;
  average_per_production: number;
  summary_date: string;
}

const carbonCostApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProductionCarbonEconomics: build.query<
      { success: boolean; production_id: number; production_name: string; data: CarbonEconomics },
      number
    >({
      query: (productionId) => ({
        url: `/carbon/productions/${productionId}/economics/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, productionId) => [{ type: 'CarbonSummary', id: productionId }]
    }),

    getCarbonCreditPotential: build.query<
      { success: boolean; production_id: number; carbon_credits: CarbonCreditPotential },
      number
    >({
      query: (productionId) => ({
        url: `/carbon/productions/${productionId}/carbon-credits/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, productionId) => [{ type: 'CarbonSummary', id: productionId }]
    }),

    getEstablishmentCarbonSummary: build.query<
      { success: boolean; establishment_id: number; data: EstablishmentCarbonSummary },
      number
    >({
      query: (establishmentId) => ({
        url: `/carbon/establishments/${establishmentId}/carbon-summary/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, establishmentId) => [
        { type: 'CarbonSummary', id: establishmentId },
        { type: 'Establishment', id: establishmentId }
      ]
    })
  }),
  overrideExisting: false
});

export const {
  useGetProductionCarbonEconomicsQuery,
  useGetCarbonCreditPotentialQuery,
  useGetEstablishmentCarbonSummaryQuery
} = carbonCostApi;
