import authReducer from "./features/authSlice";
import { baseApi } from "./features/baseApi";
import companyReducer from "./features/companySlice";
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/productSlice";
import { useSelector } from "react-redux";
import userReducer from "./features/user.slice";

export const store = configureStore({
  reducer: {
    userState: userReducer,
    auth: authReducer,
    company: companyReducer,
    product: productReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
});

export const useAppSelector = useSelector;
