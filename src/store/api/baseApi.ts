import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBase from './customFetchBase';

export const baseApi = createApi({
  baseQuery: customFetchBase,
  endpoints: () => ({}),
  reducerPath: 'baseApi',
  tagTypes: [
    'User',
    'Company',
    'Parcel',
    'History',
    'Establishment',
    'Event',
    'Subscription',
    'Addon',
    'PaymentMethod',
    'Invoice'
  ]
});

export default baseApi;
