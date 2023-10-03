import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { CSRF_HEADER_KEY, CSRF_TOKEN } from "../../config";

import { Mutex } from "async-mutex";

// const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/api/`;
const baseUrl = "http://18.218.86.192/";

// Create a new mutex
const mutex = new Mutex();

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
}

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    if (!headers.get("Accept")) headers.set("Accept", "application/json");
    if (!headers.get("default-content-type"))
      if (!headers.get("Content-Type"))
        headers.set("Content-Type", "application/json");
    const csrftoken = getCookie(CSRF_TOKEN);
    if (csrftoken) headers.set(CSRF_HEADER_KEY, csrftoken);
    return headers;
  },
});

const customFetchBase = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error?.data?.detail ===
    "Authentication credentials were not provided."
  ) {
    window.replace = "auth/signin";
    return;
  }
  if (result.error?.data?.code === "token_not_valid") {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          { credentials: "include", url: "auth/refresh" },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          // api.dispatch(logout());
          if (window.location.pathname !== "/auth/signin") {
            window.location.replace = "auth/signin";
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

  return result;
};

export default customFetchBase;
