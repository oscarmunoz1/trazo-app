import { baseApi } from './baseApi';

// Quick carbon score data - minimal payload for fastest loading
export interface CarbonQuickScore {
  carbonScore: number;
  netFootprint: number;
  relatableFootprint?: string;
}

// Basic product info - second priority for loading
export interface ProductBasics {
  id: string;
  name: string;
  image?: string;
  company: {
    name: string;
    logo?: string;
  };
  isVerified: boolean;
}

// Full details - loaded last after the essentials
export interface ProductFullDetails {
  timeline: Array<{
    date: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  blockchainVerification?: {
    verified: boolean;
    transaction_hash?: string;
    record_hash?: string;
    verification_url?: string;
    network?: string;
    verification_date?: string;
  };
  farmerStory?: string;
  establishment: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    location?: {
      latitude?: number;
      longitude?: number;
      address?: string;
    };
    certifications?: Array<{
      name: string;
      icon?: string;
      description?: string;
    }>;
  };
  recommendations?: string[];
  badges?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  industryPercentile?: number;
  industryAverage?: number;
  isUsdaVerified?: boolean;
}

const optimizedQrApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Priority 1: Fast carbon score - minimal payload (< 1KB)
    getCarbonQuickScore: build.query<CarbonQuickScore, string>({
      query: (productionId) => ({
        url: `/carbon/public/qr/${productionId}/quick-score`,
        method: 'GET',
        credentials: 'include'
      }),
      // Fake endpoint until backend implementation - we'll adapt the existing endpoint response
      // This transform simulates what the backend would do
      transformResponse: (response: any) => {
        // If we get full QR data, extract just what we need for quick score
        if (response?.carbonScore !== undefined) {
          return {
            carbonScore: response.carbonScore,
            netFootprint: response.netFootprint,
            relatableFootprint: response.relatableFootprint
          };
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'CarbonSummary', id }]
    }),

    // Priority 2: Basic product details - medium payload
    getProductBasics: build.query<ProductBasics, string>({
      query: (productionId) => ({
        url: `/carbon/public/qr/${productionId}/basics`,
        method: 'GET',
        credentials: 'include'
      }),
      // Fake endpoint until backend implementation
      transformResponse: (response: any) => {
        // If we get full history data, extract just what we need for basics
        if (response?.product) {
          return {
            id: response.id,
            name: response.product.name,
            image: response.product.image,
            company: {
              name: response.parcel?.establishment?.company?.name || 'Unknown',
              logo: response.parcel?.establishment?.company?.logo
            },
            isVerified: response.blockchain_tx_hash ? true : false
          };
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'History', id }]
    }),

    // Priority 3: Full details - larger payload, loaded last
    getProductFullDetails: build.query<ProductFullDetails, string>({
      query: (productionId) => ({
        url: `/carbon/public/qr/${productionId}/full-details`,
        method: 'GET',
        credentials: 'include'
      }),
      // Fake endpoint until backend implementation
      transformResponse: (response: any) => {
        // If we get full QR data, extract details
        if (response) {
          return {
            timeline: response.timeline || [],
            blockchainVerification: response.blockchainVerification,
            farmerStory: response.farmerStory,
            establishment: {
              id: response.farmer?.id || '',
              name: response.farmer?.name || '',
              description: response.farmer?.description,
              image: response.farmer?.photo,
              location: {
                address: response.farmer?.location
              },
              certifications: response.farmer?.certifications
            },
            recommendations: response.recommendations,
            badges: response.badges,
            industryPercentile: response.industryPercentile,
            industryAverage: response.industryAverage,
            isUsdaVerified: response.isUsdaVerified
          };
        }
        return response;
      },
      providesTags: (result, error, id) => [
        { type: 'CarbonSummary', id },
        { type: 'History', id }
      ]
    })
  }),
  overrideExisting: false
});

export const {
  useGetCarbonQuickScoreQuery,
  useGetProductBasicsQuery,
  useGetProductFullDetailsQuery
} = optimizedQrApi;
