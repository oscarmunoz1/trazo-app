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
      query: ({ companyId, establishment }) => ({
        url: ESTABLISHMENT_URL(companyId),
        method: 'POST',
        credentials: 'include',
        body: establishment
      }),
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
    })
  }),
  overrideExisting: false
});

export const {
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useCreateEstablishmentMutation,
  useEditEstablishmentMutation,
  useGetEstablishmentQuery
} = companyApi;
