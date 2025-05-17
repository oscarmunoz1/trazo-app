import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../index';

// Define the API slice for carbon-related endpoints
export const carbonApi = createApi({
  reducerPath: 'carbonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/carbon/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    // Endpoint for fetching QR code summary data (consumer-facing)
    getQRCodeSummary: builder.query<any, string>({
      query: (qrCodeId) => `qr_summary/${qrCodeId}/`
    })
    // Add other carbon-related endpoints here as needed
  })
});

// Export hooks for usage in components
export const { useGetQRCodeSummaryQuery } = carbonApi;
