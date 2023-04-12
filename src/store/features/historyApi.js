import { CURRENT_HISTORY, EVENT_URL, HISTORY_URL } from "../../config";
import { LOGIN_URL, USER_DATA_URL } from "../../config";

//   import { EmployeeType } from "../../types/employees";
import baseApi from "./baseApi";
import { logout as logoutUser } from "store/features/authSlice";
import { setCompany } from "./companySlice";

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
      invalidatesTags: (result) => (result ? ["Event"] : []),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCurrentHistoryQuery,
  useGetHistoryQuery,
  useCreateEventMutation,
} = historyApi;
