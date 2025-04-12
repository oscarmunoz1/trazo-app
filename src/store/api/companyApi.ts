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
      providesTags: (result, error, companyId) => (result ? [{ type: 'Company', companyId }] : [])
    }),
    createCompany: build.mutation({
      query: (formData) => {
        return {
          url: COMPANY_URL(),
          method: 'POST',
          credentials: 'include',
          body: formData
        };
      },
      invalidatesTags: (result) => (result ? ['Company'] : [])
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
            formData.append(key, value);
          }
        }

        // Handle direct file uploads (legacy method)
        if (establishment.album?.images && establishment.album.images.length > 0) {
          establishment.album.images.forEach((file, index) => {
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
      invalidatesTags: (result) => (result ? ['Establishment'] : [])
    }),
    editEstablishment: build.mutation({
      query: ({ companyId, establishmentId, establishmentData }) => ({
        url: ESTABLISHMENT_URL(companyId, establishmentId),
        method: 'PATCH',
        credentials: 'include',
        body: establishmentData
      }),
      invalidatesTags: (result) => (result ? ['Establishment'] : [])
    }),
    getEstablishment: build.query({
      query: ({ companyId, establishmentId }) => ({
        url: ESTABLISHMENT_URL(companyId, establishmentId),
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, { companyId, establishmentId }) =>
        result
          ? [
              { type: 'Establishment', companyId, establishmentId },
              { type: 'Company', companyId }
            ]
          : [{ type: 'Company', companyId }]
    }),
    getCompanyMembers: build.query({
      query: ({ companyId }) => ({
        url: `${COMPANY_URL(companyId)}members/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, companyId) => (result ? [{ type: 'Company', companyId }] : [])
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
