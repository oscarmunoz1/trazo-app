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
  }),
  overrideExisting: false,
});

export const { useGetParcelQuery } = productApi;
