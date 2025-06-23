import { COMPANY_URL, ESTABLISHMENT_URL } from 'config';

import { Company } from 'types/company';
import baseApi from './baseApi';

const companyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompany: build.query<Company, string>({
      query: (companyId: string) => ({
        url: COMPANY_URL(companyId),
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, companyId) => [
        { type: 'Company', id: companyId },
        ...(result?.establishments?.map((est) => ({
          type: 'Establishment' as const,
          id: est.id
        })) || []),
        { type: 'Subscription', id: result?.subscription?.id }
      ]
    }),
    createCompany: build.mutation({
      query: (formData) => {
        return {
          url: COMPANY_URL(),
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: formData
        };
      },
      invalidatesTags: ['Company']
    }),
    createEstablishment: build.mutation({
      query: ({ companyId, establishment }) => {
        // If we have uploaded image URLs, send them as JSON
        if (establishment.uploaded_image_urls && establishment.uploaded_image_urls.length > 0) {
          return {
            url: ESTABLISHMENT_URL(companyId),
            method: 'POST',
            body: establishment,
            credentials: 'include'
          };
        }

        // Otherwise, use the existing form data approach as a fallback
        const formData = new FormData();

        // Add all regular fields to formData
        for (const [key, value] of Object.entries(establishment)) {
          if (key !== 'album') {
            formData.append(key, value as string);
          }
        }

        // Handle direct file uploads (legacy method)
        if (establishment.album?.images && establishment.album.images.length > 0) {
          establishment.album.images.forEach((file: File, index: number) => {
            formData.append(`album_${index}`, file);
          });
        }

        return {
          url: ESTABLISHMENT_URL(companyId),
          method: 'POST',
          body: formData,
          formData: true,
          credentials: 'include'
        };
      },
      invalidatesTags: ['Establishment', 'Company']
    }),
    editEstablishment: build.mutation({
      query: ({ companyId, establishmentId, establishmentData }) => ({
        url: ESTABLISHMENT_URL(companyId, establishmentId),
        method: 'PATCH',
        credentials: 'include',
        body: establishmentData
      }),
      invalidatesTags: ['Establishment', 'Company']
    }),
    getEstablishment: build.query({
      query: ({ companyId, establishmentId }) => ({
        url: ESTABLISHMENT_URL(companyId, establishmentId),
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['Establishment', 'Company']
    }),
    getCompanyMembers: build.query({
      query: ({ companyId }) => ({
        url: `${COMPANY_URL(companyId)}members/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['Company']
    }),
    getCarbonEmissionSources: build.query<any[], void>({
      query: () => ({
        url: '/carbon/sources/',
        method: 'GET',
        credentials: 'include'
      })
    }),
    getCarbonOffsetActions: build.query<any[], void>({
      query: () => ({
        url: '/carbon/offset-actions/',
        method: 'GET',
        credentials: 'include'
      })
    }),
    getEstablishmentCarbonFootprints: build.query<
      any[],
      { establishmentId: number; productionId?: number; year?: number }
    >({
      query: ({ establishmentId, productionId, year }) => {
        let url,
          params = '';
        if (productionId) {
          url = `/carbon/productions/${productionId}/summary/`;
          if (year) params = `?year=${year}`;
        } else {
          url = `/carbon/establishments/${establishmentId}/summary/`;
          if (year) params = `?year=${year}`;
        }
        return {
          url: url + params,
          method: 'GET',
          credentials: 'include'
        };
      }
    }),
    getCarbonFootprintSummary: build.query<
      any,
      { establishmentId?: number; productionId?: number; year?: number }
    >({
      query: ({ establishmentId, productionId, year }) => {
        let url,
          params = '';
        if (productionId) {
          url = `/carbon/productions/${productionId}/summary/`;
          if (year) params = `?year=${year}`;
        } else if (establishmentId) {
          url = `/carbon/establishments/${establishmentId}/summary/`;
          if (year) params = `?year=${year}`;
        } else {
          url = '/carbon/entries/summary/';
        }
        return {
          url: url + params,
          method: 'GET',
          credentials: 'include'
        };
      }
    }),
    addEstablishmentCarbonFootprint: build.mutation({
      query: ({ establishmentId, footprintData }) => ({
        url: `carbon/establishments/${establishmentId}/footprint/`,
        method: 'POST',
        body: footprintData,
        credentials: 'include'
      }),
      invalidatesTags: ['CarbonSummary']
    }),
    updateEstablishmentCarbonFootprint: build.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/carbon/entries/${id}/`,
        method: 'PUT',
        body: data,
        credentials: 'include'
      })
    }),
    deleteEstablishmentCarbonFootprint: build.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `/carbon/entries/${id}/`,
        method: 'DELETE',
        credentials: 'include'
      })
    }),
    getCarbonCertifications: build.query<any[], { establishmentId: number }>({
      query: ({ establishmentId }) => ({
        url: `/carbon/certifications/?establishment=${establishmentId}`,
        method: 'GET',
        credentials: 'include'
      })
    }),
    addCarbonCertification: build.mutation<any, any>({
      query: (data) => ({
        url: '/certifications/',
        method: 'POST',
        body: data,
        credentials: 'include'
      })
    }),
    updateCarbonCertification: build.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/certifications/${id}/`,
        method: 'PUT',
        body: data,
        credentials: 'include'
      })
    }),
    deleteCarbonCertification: build.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `/certifications/${id}/`,
        method: 'DELETE',
        credentials: 'include'
      })
    }),
    getCarbonBenchmarks: build.query<any[], { industry?: string; year?: number }>({
      query: ({ industry, year }) => {
        let url = '/carbon/benchmarks/';
        const params = new URLSearchParams();
        if (industry) params.append('industry', industry);
        if (year) params.append('year', year.toString());
        return {
          url: `${url}?${params.toString()}`,
          method: 'GET',
          credentials: 'include'
        };
      }
    }),
    getCarbonReports: build.query<
      any[],
      { establishmentId: number; year?: number; reportType?: string }
    >({
      query: ({ establishmentId, year, reportType }) => {
        let url = `/carbon/reports/?establishment=${establishmentId}`;
        if (year) url += `&year=${year}`;
        if (reportType) url += `&report_type=${reportType}`;
        return {
          url: url,
          method: 'GET',
          credentials: 'include'
        };
      }
    }),
    generateCarbonReport: build.mutation<
      any,
      | FormData
      | {
          establishment: number;
          year: number;
          reportType: 'annual' | 'quarterly' | 'custom';
          quarter?: number;
          startDate?: string;
          endDate?: string;
          document?: File;
        }
    >({
      query: (data) => {
        // Check if data is FormData (for file uploads) or regular object
        const isFormData = data instanceof FormData;

        return {
          url: '/carbon/reports/generate/',
          method: 'POST',
          body: data,
          // Don't set content-type for FormData to let the browser set it with boundary
          formData: isFormData,
          credentials: 'include'
        };
      },
      // Invalidate any queries that might have cached report data
      invalidatesTags: ['CarbonSummary']
    }),
    getProductionsByEstablishment: build.query({
      query: ({ establishmentId }) => ({
        url: `/carbon/productions-flat/?establishment=${establishmentId}`,
        method: 'GET',
        credentials: 'include'
      })
    }),
    getCarbonEntries: build.query<any[], { establishmentId: number; year?: number }>({
      query: ({ establishmentId, year }) => {
        let url = `/carbon/entries/?establishment=${establishmentId}`;
        if (year) url += `&year=${year}`;
        return {
          url,
          method: 'GET',
          credentials: 'include'
        };
      }
    }),
    // Public endpoint for consumer-facing establishment view
    getPublicEstablishment: build.query({
      query: (establishmentId: string) => ({
        url: `companies/public/establishments/${establishmentId}/`,
        method: 'GET'
      }),
      providesTags: (result, error, establishmentId) => [
        { type: 'Establishment', id: establishmentId }
      ]
    }),
    // Enhanced Production Start - Create new production with crop selection and blockchain
    startProduction: build.mutation<
      any,
      {
        name: string;
        parcel_id: number;
        crop_type: number; // Changed to number to match backend expectation
        start_date: string;
        expected_harvest?: string;
        description?: string;
        production_method?: string;
        estimated_yield?: number;
        irrigation_method?: string;
        age_of_plants?: string;
        number_of_plants?: number;
        soil_ph?: number;
        is_outdoor?: boolean;
        type?: string;
        notes?: string;
      }
    >({
      query: (productionData) => ({
        url: 'histories/start-production/',
        method: 'POST',
        body: productionData,
        credentials: 'include'
      }),
      invalidatesTags: ['History', 'Company', 'Parcel']
    }),
    // Get crop types for the production form
    getCropTypes: build.query<any[], void>({
      query: () => ({
        url: '/carbon/crop-types/',
        method: 'GET',
        credentials: 'include'
      })
    }),
    // Get lightweight crop types for dropdowns (performance optimized)
    getCropTypesDropdown: build.query<
      Array<{ id: number; name: string; category: string; slug: string }>,
      void
    >({
      query: () => ({
        url: '/carbon/crop-types/dropdown/',
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['CropType']
    })
  }),
  overrideExisting: false
});

export const {
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useCreateEstablishmentMutation,
  useEditEstablishmentMutation,
  useGetEstablishmentQuery,
  useGetCompanyMembersQuery,
  useGetCarbonEmissionSourcesQuery,
  useGetCarbonOffsetActionsQuery,
  useGetEstablishmentCarbonFootprintsQuery,
  useGetCarbonFootprintSummaryQuery,
  useAddEstablishmentCarbonFootprintMutation,
  useUpdateEstablishmentCarbonFootprintMutation,
  useDeleteEstablishmentCarbonFootprintMutation,
  useGetCarbonCertificationsQuery,
  useAddCarbonCertificationMutation,
  useUpdateCarbonCertificationMutation,
  useDeleteCarbonCertificationMutation,
  useGetCarbonBenchmarksQuery,
  useGetCarbonReportsQuery,
  useGenerateCarbonReportMutation,
  useGetProductionsByEstablishmentQuery,
  useGetCarbonEntriesQuery,
  useGetPublicEstablishmentQuery,
  useStartProductionMutation,
  useGetCropTypesQuery,
  useGetCropTypesDropdownQuery
} = companyApi;
