import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentForm: null,
};

export const formSlice = createSlice({
  initialState,
  name: "companySlice",
  reducers: {
    setForm: (state, action) => {
      state.currentForm = { ...state.currentForm, ...action.payload };
    },
    clearForm: (state, action) => {
      state.currentForm = initialState.currentForm;
    },
  },
});

export default formSlice.reducer;

export const { setForm, clearForm } = formSlice.actions;
