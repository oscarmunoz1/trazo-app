import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  isAuthenticated: false,
  isLoading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload }) => {
      const newData = state.data ? { ...state.data, ...payload.data } : payload.data;
      state.data = newData;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.data = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setData: (state, { payload }) => {
      const newData = state.data ? { ...state.data, ...payload.data } : payload.data;
      state.data = newData;
      state.isLoading = false;
    }
  }
});

export const { login, logout, setData } = authSlice.actions;
export default authSlice.reducer;
