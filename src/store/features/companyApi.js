import { LOGIN_URL, USER_DATA_URL } from "../../config";

import { COMPANY_URL } from "../../config";
//   import { EmployeeType } from "../../types/employees";
import baseApi from "./baseApi";
import { logout as logoutUser } from "store/features/authSlice";
import { setCompany } from "./companySlice";

//   import { ProfileFormType, UserInfoType } from "../../types/user";

//   import { generateProfile } from "../helpers";

const companyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompany: build.query({
      query: (companyID) => ({
        url: COMPANY_URL(companyID),
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, companyID) =>
        result ? [{ type: "Company", companyID }] : [],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCompanyQuery } = companyApi;
