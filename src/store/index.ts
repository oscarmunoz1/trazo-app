import authReducer from './features/authSlice';
import { baseApi } from './api/baseApi';
import companyReducer from 'store/features/companySlice';
import { configureStore } from '@reduxjs/toolkit';
import formReducer from './features/formSlice';
import historySlice from './features/historySlice';
import productReducer from './features/productSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    userState: userReducer,
    auth: authReducer,
    company: companyReducer,
    product: productReducer,
    form: formReducer,
    history: historySlice,
    [baseApi.reducerPath]: baseApi.reducer
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(baseApi.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
