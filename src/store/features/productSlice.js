import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentParcel: null,
};

export const productSlice = createSlice({
  initialState,
  name: "productSlice",
  reducers: {
    setParcel: (state, action) => {
      state.currentParcel = action.payload;
    },
  },
});

export default productSlice.reducer;

export const { setParcel } = productSlice.actions;
