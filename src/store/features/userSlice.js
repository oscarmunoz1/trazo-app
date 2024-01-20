import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null
};

export const userSlice = createSlice({
  initialState,
  name: 'userSlice',
  reducers: {
    logout: () => initialState,
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setUserCompany: (state, action) => {
      state.user.companies = [action.payload];
    }
  }
});

export default userSlice.reducer;

export const { logout, setUser, clearUser, setUserCompany } = userSlice.actions;
