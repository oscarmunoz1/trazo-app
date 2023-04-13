import {
  CURRENT_HISTORY,
  EVENT_URL,
  FINISH_HISTORY,
  HISTORY_URL,
} from "../../config";

import baseApi from "./baseApi";

const historyApi = baseApi.injectEndpoints({
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
      invalidatesTags: (result) => (result ? ["History"] : []),
    }),
    getHistory: build.query({
      query: (parcelId) => ({
        url: HISTORY_URL(parcelId),
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, parcelId) =>
        result ? [{ type: "History", parcelId }] : [],
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
  }),
  overrideExisting: false,
});

export const {
  useGetCurrentHistoryQuery,
  useGetHistoryQuery,
  useCreateEventMutation,
  useFinishCurrentHistoryMutation,
} = historyApi;
