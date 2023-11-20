import { LOGIN_URL, SIGNUP_URL, USER_DATA_URL, VERIFY_EMAIL_URL } from '../../config';

import baseApi from './baseApi';
import { setCompany } from 'store/features/companySlice';
import { setUser } from 'store/features/userSlice';

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: ({ email, password }) => ({
        url: LOGIN_URL,
        method: 'POST',
        body: { email: email.toLowerCase(), password },
        credentials: 'include'
      }),
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(setUser(result.data.user));
          const { data } = await dispatch(
            baseApi.endpoints.getCompany.initiate(result.data.user['companies'][0].id)
          );
          dispatch(setCompany(data));
        } catch (error) {
          console.error(error);
        }
      }
    }),
    signUp: build.mutation({
      query(data) {
        return {
          url: SIGNUP_URL,
          method: 'POST',
          body: data
        };
      }
    }),
    logout: build.mutation({
      query: () => ({
        url: 'auth/logout/',
        method: 'POST',
        body: {},
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: (result) => (result ? ['User', 'Company', 'Parcel', 'History'] : [])
      // transformResult: (result, queryApi, extraOptions) => {
      //   // queryApi.dispatch(logoutUser());
      //   // return { ...result, isAuthenticated: false };
      //   dispatch(queryApi.util.resetApiState());
      // },
    }),
    verifyEmail: build.mutation({
      query({ verificationCode }) {
        return {
          url: VERIFY_EMAIL_URL,
          method: 'POST',
          body: {
            code: verificationCode
          },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        };
      }
    }),
    userData: build.query({
      query: () => {
        return {
          url: USER_DATA_URL,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: (result) => (result ? ['User'] : []),
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(setUser(result.data));
          if (result.data['companies'].length > 0) {
            const { data } = await dispatch(
              baseApi.endpoints.getCompany.initiate(result.data['companies'][0].id)
            );
            dispatch(setCompany(data));
          }
        } catch (error) {
          console.error(error);
        }
      }
    })
  }),
  overrideExisting: false
});

export const {
  useUserDataQuery,
  useLoginMutation,
  useSignUpMutation,
  useLogoutMutation,
  useVerifyEmailMutation
} = authApi;
