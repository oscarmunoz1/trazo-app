import authReducer from "./features/authSlice";
import { baseApi } from "./api/baseApi";
import companyReducer from "store/features/companySlice";
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./features/formSlice";
import historySlice from "./features/historySlice";
import { logout } from "./features/authSlice";
import productReducer from "./features/productSlice";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    userState: userReducer,
    auth: authReducer,
    company: companyReducer,
    product: productReducer,
    form: formReducer,
    history: historySlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
});
