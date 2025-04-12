import { baseApi } from './baseApi';

export const fileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Generate presigned URL for S3 uploads (used in production)
    getPresignedUrl: build.mutation<
      { presigned_url: string; file_url: string; s3_key: string },
      { filename: string; fileType: string; folder?: string }
    >({
      query: (data) => ({
        url: '/api/get-presigned-url/',
        method: 'POST',
        body: data
      })
    }),

    // Upload file directly to backend (used in development)
    localUpload: build.mutation<{ file_url: string; path: string }, FormData>({
      query: (formData) => ({
        url: '/api/local-upload/',
        method: 'POST',
        body: formData,
        // Don't set Content-Type, it will be set automatically with the boundary
        formData: true,
        credentials: 'include'
      })
    })
  }),
  overrideExisting: false
});

export const { useGetPresignedUrlMutation, useLocalUploadMutation } = fileApi;
