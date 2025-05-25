import baseApi from './baseApi';

// ROI API Types
export interface ROIAnalysisRequest {
  establishment_id: number;
}

export interface ROIAnalysisResponse {
  establishment_id: number;
  analysis_date: string;
  total_annual_savings: number;
  analysis_categories: {
    equipment_efficiency: {
      fuel_savings: number;
      maintenance_savings: number;
    };
    chemical_optimization: {
      efficiency_savings: number;
      bulk_purchasing_savings: number;
      precision_application_savings: number;
    };
    energy_optimization: {
      irrigation_savings: number;
      solar_potential_savings: number;
    };
    market_opportunities: {
      premium_pricing_potential: number;
      sustainability_certification_value: number;
    };
    sustainability_incentives: {
      carbon_credits_potential: number;
      government_programs_value: number;
    };
  };
  recommendations: ROIRecommendation[];
}

export interface ROIRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  annual_savings: number;
  implementation_cost: number;
  payback_months: number;
  priority: 'high' | 'medium' | 'low';
  carbon_impact: number;
  difficulty_level: string;
}

export interface EquipmentMarketplaceRequest {
  establishment_id: string;
}

export interface EquipmentMarketplaceResponse {
  establishment_id: string;
  equipment_recommendations: EquipmentRecommendation[];
  financing_options: FinancingOption[];
}

export interface EquipmentRecommendation {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  price: number;
  annual_savings: number;
  payback_months: number;
  carbon_reduction: number;
  efficiency_improvement: number;
  features: string[];
}

export interface FinancingOption {
  type: string;
  provider: string;
  terms: string;
  interest_rate?: number;
  down_payment?: number;
}

export interface GovernmentIncentivesRequest {
  establishment_id: string;
}

export interface GovernmentIncentivesResponse {
  establishment_id: string;
  available_incentives: GovernmentIncentive[];
  total_potential_value: number;
}

export interface GovernmentIncentive {
  id: string;
  program_name: string;
  agency: string;
  description: string;
  max_payment: number;
  application_deadline: string;
  eligibility_requirements: string[];
  contact_info: {
    phone: string;
    email: string;
    website: string;
  };
}

export interface BulkPurchasingRequest {
  establishment_ids: number[];
  chemical_types: string[];
}

export interface BulkPurchasingResponse {
  total_farms: number;
  estimated_volume: number;
  potential_discount: number;
  annual_savings: number;
  coordination_details: {
    contact_person: string;
    phone: string;
    email: string;
  };
}

// ROI API endpoints
const roiApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    calculateROI: build.mutation<any, { establishment_id: number }>({
      query: (data) => ({
        url: `/carbon/roi/calculate-savings/`,
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['CarbonSummary']
    }),
    getEquipmentMarketplace: build.query<any, { establishment_id: number }>({
      query: ({ establishment_id }) => ({
        url: `/carbon/roi/equipment-marketplace/?establishment_id=${establishment_id}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['Equipment']
    }),
    getBulkPurchasingOpportunities: build.mutation<
      any,
      { establishment_ids: number[]; chemical_types?: string[] }
    >({
      query: (data) => ({
        url: `/carbon/roi/bulk-purchasing/`,
        method: 'POST',
        body: data,
        credentials: 'include'
      })
    }),
    getGovernmentIncentives: build.query<any, { establishment_id: number; location?: string }>({
      query: ({ establishment_id, location = 'US' }) => ({
        url: `/carbon/roi/government-incentives/?establishment_id=${establishment_id}&location=${location}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['GovernmentIncentives']
    })
  }),
  overrideExisting: false
});

export const {
  useCalculateROIMutation,
  useGetEquipmentMarketplaceQuery,
  useGetBulkPurchasingOpportunitiesMutation,
  useGetGovernmentIncentivesQuery
} = roiApi;

// Export alias for backward compatibility
export const useCalculateSavingsMutation = useCalculateROIMutation;

export default roiApi;
