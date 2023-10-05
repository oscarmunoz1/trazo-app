import { CSRF_HEADER_KEY, CSRF_TOKEN } from "../../config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import customFetchBase from "./customFetchBase";

// import { cookie } from "react-cookie";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export const baseApi = createApi({
  baseQuery: customFetchBase,
  endpoints: () => ({}),
  reducerPath: "baseApi",
  tagTypes: ["User", "Company", "Parcel", "History", "Establishment", "Event"],
});

export default baseApi;
