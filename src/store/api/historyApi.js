import {
  COMMENT_HISTORY_URL,
  CURRENT_HISTORY,
  EVENT_CREATE_URL,
  EVENT_URL,
  FINISH_HISTORY,
  HISTORY_URL,
  PARCEL_HISTORY_URL,
  PRODUCTION_URL,
  PUBLIC_HISTORY_URL,
  SCANS_BY_ESTABLISHMENT_URL
} from '../../config';

import baseApi from '../api/baseApi';

export const historyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentHistory: build.query({
      query: ({ companyId, establishmentId, parcelId }) => ({
        url: CURRENT_HISTORY(companyId, establishmentId, parcelId),
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, parcelId) => (result ? [{ type: 'History', parcelId }] : [])
    }),
    finishCurrentHistory: build.mutation({
      query: ({ companyId, establishmentId, parcelId, historyData }) => {
        const formData = new FormData();

        historyData.album.images.forEach((file) => {
          formData.append('album[images]', file);
        });

        for (const [key, value] of Object.entries(historyData)) {
          if (key !== 'album') {
            formData.append(key, value);
          }
        }
        return {
          url: FINISH_HISTORY(companyId, establishmentId, parcelId),
          method: 'POST',
          credentials: 'include',
          body: formData,
          formData: true
        };
      },
      invalidatesTags: (result, error, parcelId) => (result ? [{ type: 'History', parcelId }] : [])
    }),
    getParcelHistories: build.query({
      query: ({ companyId, establishmentId, parcelId }) => {
        return {
          url: PARCEL_HISTORY_URL(companyId, establishmentId, parcelId),
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: (result, error, parcelId) => (result ? [{ type: 'History', parcelId }] : [])
    }),
    getUserProductionScans: build.query({
      query: () => ({
        url: 'histories/my_scans/',
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result) => (result ? ['History'] : [])
    }),
    getUserReviews: build.query({
      query: () => ({
        url: 'histories/my_reviews/',
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result) => (result ? ['History'] : [])
    }),
    getHistory: build.query({
      query: (historyId) => ({
        url: HISTORY_URL(historyId),
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, historyId) => (result ? [{ type: 'History', historyId }] : [])
    }),
    getEvent: build.query({
      query: ({ companyId, establishmentId, eventId, eventType }) => ({
        url: EVENT_URL(companyId, establishmentId, eventId, eventType),
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, eventId) => (result ? [{ type: 'Event', eventId }] : [])
    }),
    createEvent: build.mutation({
      query: ({ companyId, establishmentId, ...eventData }) => {
        const formData = new FormData();

        eventData.album.images.forEach((file) => {
          formData.append('album[images]', file);
        });

        eventData.parcels.forEach((parcel) => {
          formData.append('parcels', parcel);
        });

        for (const [key, value] of Object.entries(eventData)) {
          if (key !== 'album' && key !== 'parcels') {
            formData.append(key, value);
          }
        }
        return {
          url: EVENT_CREATE_URL(companyId, establishmentId),
          method: 'POST',
          credentials: 'include',
          body: formData,
          formData: true
        };
      },
      invalidatesTags: (result) => (result ? ['Event', 'History'] : [])
    }),
    updateEvent: build.mutation({
      query: ({ companyId, establishmentId, eventId, eventType, ...eventData }) => {
        const formData = new FormData();

        // Handle album images if present
        if (eventData.album?.images) {
          eventData.album.images.forEach((file) => {
            formData.append('album[images]', file);
          });
        }

        // Handle parcels if present
        if (eventData.parcels) {
          eventData.parcels.forEach((parcel) => {
            formData.append('parcels', parcel);
          });
        }

        // Add other fields
        for (const [key, value] of Object.entries(eventData)) {
          if (key !== 'album' && key !== 'parcels' && value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }

        return {
          url: EVENT_URL(companyId, establishmentId, eventId, eventType),
          method: 'PUT',
          credentials: 'include',
          body: formData,
          formData: true
        };
      },
      invalidatesTags: (result, error, { eventId }) =>
        result ? [{ type: 'Event', eventId }, 'History'] : []
    }),
    createProduction: build.mutation({
      query: (production) => ({
        url: PRODUCTION_URL(),
        method: 'POST',
        credentials: 'include',
        body: production
      }),
      invalidatesTags: (result) => (result ? ['History'] : [])
    }),
    updateProduction: build.mutation({
      query: ({ historyId, ...production }) => ({
        url: PRODUCTION_URL(historyId),
        method: 'PUT',
        credentials: 'include',
        body: production
      }),
      invalidatesTags: (result, error, { historyId }) =>
        result ? [{ type: 'History', historyId }, 'History'] : []
    }),
    getPublicHistory: build.query({
      query: (historyId) => ({
        url: PUBLIC_HISTORY_URL(historyId),
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, historyId) => (result ? [{ type: 'History', historyId }] : [])
    }),
    commentHistory: build.mutation({
      query: ({ comment, scanId }) => ({
        url: COMMENT_HISTORY_URL(scanId),
        method: 'POST',
        credentials: 'include',
        body: { comment }
      }),
      invalidatesTags: (result) => (result ? ['History'] : [])
    }),
    getScansByEstablishment: build.query({
      query: ({ companyId, establishmentId, parcelId, productId, productionId, period }) => ({
        url:
          SCANS_BY_ESTABLISHMENT_URL(companyId, establishmentId) +
          (parcelId || productId || productionId || period ? '?' : '') +
          (parcelId ? `&parcel=${parcelId} ` : ``) +
          (productId ? `&product=${productId} ` : ``) +
          (productionId ? `&production=${productionId} ` : ``) +
          (period ? `&period=${period} ` : ``),
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, establishmentId) =>
        result ? [{ type: 'History', establishmentId }] : []
    }),
    getProductionsByEstablishment: build.query({
      query: ({ establishmentId }) => ({
        url: `/history/productions/?establishment=${establishmentId}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, establishmentId) =>
        result ? [{ type: 'Productions', id: establishmentId }] : []
    })
  }),
  overrideExisting: false
});

export const {
  useGetCurrentHistoryQuery,
  useGetParcelHistoriesQuery,
  useGetHistoryQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useCreateProductionMutation,
  useUpdateProductionMutation,
  useFinishCurrentHistoryMutation,
  useGetPublicHistoryQuery,
  useCommentHistoryMutation,
  useGetScansByEstablishmentQuery,
  useGetUserProductionScansQuery,
  useGetUserReviewsQuery,
  useGetProductionsByEstablishmentQuery
} = historyApi;
