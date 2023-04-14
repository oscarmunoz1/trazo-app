import { LOGIN_URL, PARCEL_URL, USER_DATA_URL } from "../../config";

//   import { EmployeeType } from "../../types/employees";
import baseApi from "./baseApi";
import { logout as logoutUser } from "store/features/authSlice";
import { setCompany } from "./companySlice";

const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getParcel: build.query({
      query: (parcelId) => ({
        url: PARCEL_URL(parcelId),
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, parcelId) =>
        result ? [{ type: "Parcel", parcelId }] : [],
    }),
    createParcel: build.mutation({
      query: (parcel) => ({
        url: PARCEL_URL(),
        method: "POST",
        credentials: "include",
        body: parcel,
      }),
      invalidatesTags: (result) => (result ? ["Parcel"] : []),
    }),
  }),
  overrideExisting: false,
});

export const { useGetParcelQuery, useCreateParcelMutation } = productApi;
