import { LOGIN_URL, USER_DATA_URL } from "../../config";

import baseApi from "./baseApi";
import { companyApi } from "./companyApi";
import { logout as logoutUser } from "store/features/authSlice";
import { setCompany } from "../features/companySlice";
import { setUser } from "../features/user.slice";
//   import { EmployeeType } from "../../types/employees";
import { useMutation } from "@reduxjs/toolkit/query/react";

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
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(setUser(result.data.user));
          const { data } = await dispatch(
            baseApi.endpoints.getCompany.initiate(
              result.data.user["companies"][0].id
            )
          );
          dispatch(setCompany(data));
        } catch (error) {
          console.error(error);
        }
      },
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
      query: () => {
        return {
          url: USER_DATA_URL,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: (result) => (result ? ["User"] : []),
      // async onQueryStarted(args, { dispatch, queryFulfilled }) {
      //   try {
      //     debugger;
      //     const { data } = await queryFulfilled;
      //     debugger;
      //     dispatch(setUser(data));
      //     debugger;
      //     const companyID = data["companies"][0].id;
      //     return queryFulfilled({ args: [companyID] });
      //     // await dispatch(baseApi.endpoints.getCompany(data["companies"][0].id));
      //     // debugger;
      //     // dispatch(setCompany(companyData));
      //   } catch (error) {}
      // },
      // onSuccess(result, { dispatch, queryFulfilled }) {
      //   debugger;
      //   dispatch(setUser(result.data));
      //   const companyID = result.data["companies"][0].id;
      //   debugger;
      //   return queryFulfilled({ args: [companyID] });
      // },
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(setUser(result.data));
          const { data } = await dispatch(
            baseApi.endpoints.getCompany.initiate(
              result.data["companies"][0].id
            )
          );
          dispatch(setCompany(data));
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useUserDataQuery,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
