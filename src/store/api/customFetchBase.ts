import { CSRF_HEADER_KEY, CSRF_TOKEN } from 'config';

import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { Mutex } from 'async-mutex';
import { fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const baseUrl = import.meta.env.VITE_APP_BACKEND_URL || '/api';

// Create a new mutex
const mutex = new Mutex();

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const part = parts.pop();
    return part ? part.split(';').shift() : undefined;
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    // if (!headers.get('Accept')) headers.set('Accept', 'application/json');
    // if (!headers.get('default-content-type'))
    //   if (!headers.get('Content-Type')) headers.set('Content-Type', 'application/json');
    const csrftoken = getCookie(CSRF_TOKEN);
    if (csrftoken) headers.set(CSRF_HEADER_KEY, csrftoken);
    return headers;
  }
});

const customFetchBase = async (args: any, api: BaseQueryApi, extraOptions: any) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  // Type guard for error checking
  const hasErrorData = (error: any): error is FetchBaseQueryError & { data: any } => {
    return error && typeof error === 'object' && 'data' in error && error.data;
  };

  if (hasErrorData(result.error)) {
    const errorData = result.error.data;
    const currentPath = window.location.pathname;
    const isOnAuthPage = currentPath.startsWith('/auth/');

    // Check for authentication error
    if (
      typeof errorData === 'object' &&
      'detail' in errorData &&
      errorData.detail === 'Authentication credentials were not provided.'
    ) {
      // Only redirect if not already on an auth page
      if (!isOnAuthPage) {
        // Include current path as 'next' parameter for protected routes
        const isProtectedRoute = currentPath.startsWith('/admin/');
        const redirectUrl = isProtectedRoute
          ? `/auth/signin?next=${encodeURIComponent(currentPath + window.location.search)}`
          : '/auth/signin';
        window.location.href = redirectUrl;
      }
      return result;
    }

    // Check for token validation error
    if (
      typeof errorData === 'object' &&
      'code' in errorData &&
      errorData.code === 'token_not_valid'
    ) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();

        try {
          const refreshResult = await baseQuery(
            { credentials: 'include', url: 'auth/refresh' },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            // Retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Only redirect if not already on signin page
            if (currentPath !== '/auth/signin' && !isOnAuthPage) {
              // Include current path as 'next' parameter for protected routes
              const isProtectedRoute = currentPath.startsWith('/admin/');
              const redirectUrl = isProtectedRoute
                ? `/auth/signin?next=${encodeURIComponent(currentPath + window.location.search)}`
                : '/auth/signin';
              window.location.href = redirectUrl;
            }
          }
        } finally {
          // release must be called once the mutex should be released again.
          release();
        }
      } else {
        // wait until the mutex is available without locking it
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

export default customFetchBase;
