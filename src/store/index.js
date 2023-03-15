import authReducer from "./features/authSlice";
import { baseApi } from "./features/baseApi";
import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import userReducer from "./features/user.slice";

export const store = configureStore({
  reducer: {
    userState: userReducer,
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
});

export const useAppSelector = useSelector;
