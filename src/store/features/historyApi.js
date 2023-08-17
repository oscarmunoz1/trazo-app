import {
  COMMENT_HISTORY_URL,
  CURRENT_HISTORY,
  EVENT_URL,
  FINISH_HISTORY,
  HISTORY_URL,
  PARCEL_HISTORY_URL,
  PRODUCTION_URL,
  PUBLIC_HISTORY_URL,
  SCANS_BY_ESTABLISHMENT_URL,
} from "../../config";

import baseApi from "./baseApi";

export const historyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentHistory: build.query({
      query: (parcelId) => ({
        url: CURRENT_HISTORY(parcelId),
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, parcelId) =>
        result ? [{ type: "History", parcelId }] : [],
    }),
    finishCurrentHistory: build.mutation({
      query: ({ parcelId, historyData }) => ({
        url: FINISH_HISTORY(parcelId),
        method: "POST",
        credentials: "include",
        body: historyData,
      }),
      invalidatesTags: (result, error, parcelId) =>
        result ? [{ type: "History", parcelId }] : [],
    }),
    getParcelHistories: build.query({
      query: (parcelId) => {
        return {
          url: PARCEL_HISTORY_URL(parcelId),
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: (result, error, parcelId) =>
        result ? [{ type: "History", parcelId }] : [],
    }),
    getHistory: build.query({
      query: (historyId) => ({
        url: HISTORY_URL(historyId),
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, historyId) =>
        result ? [{ type: "History", historyId }] : [],
    }),
    getEvent: build.query({
      query: (eventId) => ({
        url: EVENT_URL(eventId),
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, eventId) =>
        result ? [{ type: "Event", eventId }] : [],
    }),
    createEvent: build.mutation({
      query: (event) => ({
        url: EVENT_URL(),
        method: "POST",
        credentials: "include",
        body: event,
      }),
      invalidatesTags: (result) => (result ? ["Event", "History"] : []),
    }),
    createProduction: build.mutation({
      query: (production) => ({
        url: PRODUCTION_URL(),
        method: "POST",
        credentials: "include",
        body: production,
      }),
      invalidatesTags: (result) => (result ? ["History"] : []),
    }),
    getPublicHistory: build.query({
      query: (historyId) => ({
        url: PUBLIC_HISTORY_URL(historyId),
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, historyId) =>
        result ? [{ type: "History", historyId }] : [],
    }),
    commentHistory: build.mutation({
      query: ({ comment, scanId }) => ({
        url: COMMENT_HISTORY_URL(scanId),
        method: "POST",
        credentials: "include",
        body: { comment },
      }),
      invalidatesTags: (result) => (result ? ["History"] : []),
    }),
    getScansByEstablishment: build.query({
      query: ({
        establishmentId,
        parcelId,
        productId,
        productionId,
        period,
      }) => ({
        url:
          SCANS_BY_ESTABLISHMENT_URL(establishmentId) +
          (parcelId ? `&parcel=${parcelId} ` : ``) +
          (productId ? `&product=${productId} ` : ``) +
          (productionId ? `&production=${productionId} ` : ``) +
          (period ? `&period=${period} ` : ``),
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, establishmentId) =>
        result ? [{ type: "History", establishmentId }] : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCurrentHistoryQuery,
  useGetParcelHistoriesQuery,
  useGetHistoryQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useCreateProductionMutation,
  useFinishCurrentHistoryMutation,
  useGetPublicHistoryQuery,
  useCommentHistoryMutation,
  useGetScansByEstablishmentQuery,
} = historyApi;
