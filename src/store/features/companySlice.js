import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCompany: null,
};

export const companySlice = createSlice({
  initialState,
  name: "companySlice",
  reducers: {
    setCompany: (state, action) => {
      state.currentCompany = action.payload;
    },
    setEstablishment: (state, action) => {
      state.currentEstablishment = action.payload;
    },
    clearCurrentCompany: (state) => {
      state.currentCompany = null;
    },
    setCompanyEstablishment: (state, action) => {
      state.currentCompany.establishments = [action.payload];
    },
  },
});

export default companySlice.reducer;

export const {
  setCompany,
  clearCurrentCompany,
  setCompanyEstablishment,
} = companySlice.actions;
