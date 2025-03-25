import { baseApi } from './baseApi';
import { UPLOAD_URLS_URL } from 'config';

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPresignedUrls: build.mutation<
      Array<{ url: string; fields: Record<string, string> }>,
      {
        files: Array<{ name: string; type: string; size: number }>;
        entityType: string;
        entityId?: string;
      }
    >({
      query: (body) => ({
        url: UPLOAD_URLS_URL,
        method: 'POST',
        body,
        credentials: 'include'
      })
    })
  }),
  overrideExisting: false
});

export const { useGetPresignedUrlsMutation } = uploadApi;
