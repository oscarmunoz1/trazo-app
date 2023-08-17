import {
  ESTABLISHMENT_CHART_SCANS_VS_SALES_INFO_URL,
  ESTABLISHMENT_HISTORIES_URL,
  ESTABLISHMENT_PRODUCTS_URL,
  LOGIN_URL,
  PARCEL_URL,
  PRODUCT_URL,
} from "../../config";

//   import { EmployeeType } from "../../types/employees";
import baseApi from "./baseApi";
import { logout as logoutUser } from "store/features/authSlice";
import { setCompany } from "./companySlice";

export const productApi = baseApi.injectEndpoints({
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
    getProducts: build.query({
      query: () => ({
        url: PRODUCT_URL,
        method: "GET",
        credentials: "include",
      }),
    }),
    getEstablishmentProducts: build.query({
      query: ({ establishmentId, parcelId }) => ({
        url:
          ESTABLISHMENT_PRODUCTS_URL(establishmentId) +
          (parcelId ? `?parcel=${parcelId}` : ""),
        method: "GET",
        credentials: "include",
      }),
    }),
    getEstablishmentHistories: build.query({
      query: ({ establishmentId, parcelId, productId, periodId }) => ({
        url:
          ESTABLISHMENT_HISTORIES_URL(establishmentId) +
          (parcelId ? `?parcel=${parcelId}` : "") +
          (productId ? `&product=${productId}` : "") +
          (periodId ? `&period=${periodId}` : ""),
        method: "GET",
        credentials: "include",
      }),
    }),
    getEstablishmentScansVsSalesChartInfo: build.query({
      query: ({
        establishmentId,
        parcelId,
        productId,
        periodId,
        productionId,
      }) => ({
        url:
          ESTABLISHMENT_CHART_SCANS_VS_SALES_INFO_URL(establishmentId) +
          (periodId ? `?period=${periodId}` : "") +
          (parcelId ? `&parcel=${parcelId}` : "") +
          (productionId ? `&production=${productionId}` : "") +
          (productId ? `&product=${productId}` : ""),
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetParcelQuery,
  useCreateParcelMutation,
  useGetProductsQuery,
  useGetEstablishmentProductsQuery,
  useGetEstablishmentHistoriesQuery,
  useGetEstablishmentScansVsSalesChartInfoQuery,
} = productApi;
