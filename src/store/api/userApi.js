import { USER_URL } from '../../config';
import baseApi from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({ userId, userData }) => {
        const formData = new FormData();

        for (const [key, value] of Object.entries(userData)) {
          formData.append(key, value);
        }

        return {
          url: USER_URL(userId),
          method: 'PATCH',
          credentials: 'include',
          body: formData,
          formData: true
        };
      },
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', userId }]
    }),
    getUserRoles: builder.query({
      query: () => ({
        url: USER_URL() + 'roles',
        credentials: 'include'
      })
    })
  })
});

export const { useGetMeQuery, useUpdateUserMutation, useGetUserRolesQuery } = userApi;
