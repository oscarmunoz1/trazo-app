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
  useGetCompanyMembersQuery
} = companyApi;
