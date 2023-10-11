import { COMPANY_URL, ESTABLISHMENT_URL } from "../../config";
import { LOGIN_URL, USER_DATA_URL } from "../../config";

//   import { EmployeeType } from "../../types/employees";
import baseApi from "./baseApi";
import { logout as logoutUser } from "store/features/authSlice";
import { setCompany } from "store/features/companySlice";

const companyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompany: build.query({
      query: (companyId) => ({
        url: COMPANY_URL(companyId),
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, companyId) =>
        result ? [{ type: "Company", companyId }] : [],
    }),
    createCompany: build.mutation({
      query: (formData) => {
        return {
          url: COMPANY_URL(),
          method: "POST",
          credentials: "include",
          body: formData,
        };
      },
      invalidatesTags: (result) => (result ? ["Company"] : []),
    }),
    createEstablishment: build.mutation({
      query: ({ companyId, establishment }) => ({
        url: ESTABLISHMENT_URL(companyId),
        method: "POST",
        credentials: "include",
        body: establishment,
      }),
      invalidatesTags: (result) => (result ? ["Establishment"] : []),
    }),
    editEstablishment: build.mutation({
      query: ({ companyId, establishmentId, establishmentData }) => ({
        url: ESTABLISHMENT_URL(companyId, establishmentId),
        method: "PATCH",
        credentials: "include",
        body: establishmentData,
      }),
      invalidatesTags: (result) => (result ? ["Establishment"] : []),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useCreateEstablishmentMutation,
  useEditEstablishmentMutation,
} = companyApi;
