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
      query: (formData) => {
        // Log what we're sending for debugging
        console.log('Sending FormData:', formData);

        return {
          url: '/api/local-upload/',
          method: 'POST',
          body: formData,
          formData: true,
          // IMPORTANT: RTK Query's formData option doesn't properly set the Content-Type
          // So we need to use fetch directly and NOT set Content-Type at all
          // The browser will automatically set it with the correct boundary
          prepareHeaders: (headers: Headers) => {
            // Remove Content-Type completely to let browser set it
            headers.delete('Content-Type');
            // Keep the rest of the headers
            return headers;
          },
          credentials: 'include'
        };
      }
    })
  }),
  overrideExisting: false
});

export const { useGetPresignedUrlMutation, useLocalUploadMutation } = fileApi;
