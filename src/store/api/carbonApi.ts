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

export interface QRCodeSummary {
  carbonScore: number;
  netFootprint: number;
  relatableFootprint: string; // e.g., "like driving 1 mile"
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    isVerified: boolean;
  }>;
  farmer: {
    name: string;
    photo: string;
    bio: string;
    generation: number;
    location: string;
    certifications: string[];
    sustainabilityInitiatives: string[];
    carbonReduction: number;
    yearsOfPractice: number;
  };
  timeline: CarbonEvent[];
  isUsdaVerified: boolean;
  verificationDate: string;
  socialProof: {
    totalScans: number;
    totalOffsets: number;
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

    getCarbonRecommendations: builder.query<CarbonRecommendation[], string>({
      query: (establishmentId) => ({
        url: `carbon/establishments/${establishmentId}/recommendations/`,
        method: 'GET'
      }),
      providesTags: ['CarbonRecommendations']
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
      { productionId: string; amount: number }
    >({
      query: (data) => ({
        url: 'carbon/offsets/',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['CarbonSummary']
    }),

    // IoT endpoints
    getIoTData: builder.query<
      {
        soilMoisture: number;
        temperature: number;
        humidity: number;
        solarRadiation: number;
        waterUsage: number;
        energyConsumption: number;
      },
      string
    >({
      query: (establishmentId) => ({
        url: `carbon/establishments/${establishmentId}/iot-data/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    // Historical data endpoints
    getHistoricalData: builder.query<
      {
        labels: string[];
        emissions: number[];
        offsets: number[];
      },
      { establishmentId: string; timeRange: 'week' | 'month' | 'year' }
    >({
      query: ({ establishmentId, timeRange }) => ({
        url: `carbon/establishments/${establishmentId}/historical-data/`,
        method: 'GET',
        params: { timeRange }
      }),
      providesTags: ['CarbonSummary']
    }),

    // Emissions breakdown endpoints
    getEmissionsBreakdown: builder.query<
      {
        direct: {
          equipment: number;
          irrigation: number;
          storage: number;
        };
        indirect: {
          energy: number;
          transportation: number;
          waste: number;
        };
      },
      string
    >({
      query: (establishmentId) => ({
        url: `carbon/establishments/${establishmentId}/emissions-breakdown/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    })
  })
});

export const {
  useGetEstablishmentCarbonSummaryQuery,
  useGetProductionCarbonSummaryQuery,
  useGetCarbonBenchmarksQuery,
  useGetCarbonRecommendationsQuery,
  useGetQRCodeSummaryQuery,
  useGetPublicCarbonSummaryQuery,
  useGetProductionTimelineQuery,
  useCreateOffsetMutation,
  useGetIoTDataQuery,
  useGetHistoricalDataQuery,
  useGetEmissionsBreakdownQuery
} = carbonApi;
