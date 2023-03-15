import { LOGIN_URL, USER_DATA_URL } from "../../config";

//   import { EmployeeType } from "../../types/employees";
import baseApi from "./baseApi";
import { logout as logoutUser } from "store/features/authSlice";

//   import { ProfileFormType, UserInfoType } from "../../types/user";

//   import { generateProfile } from "../helpers";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: ({ email, password }) => ({
        url: LOGIN_URL,
        method: "POST",
        body: { email: email.toLowerCase(), password },
        credentials: "include",
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: "auth/logout/",
        method: "POST",
        body: {},
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      transformResult: (result, queryApi, extraOptions) => {
        queryApi.dispatch(logoutUser());
        return { ...result, isAuthenticated: false };
      },
    }),
    userData: build.query({
      query: () => ({
        url: USER_DATA_URL,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) => (result ? ["User"] : []),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUserDataQuery,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
