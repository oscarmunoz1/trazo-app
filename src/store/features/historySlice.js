import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentHistory: null,
};

export const historySlice = createSlice({
  initialState,
  name: "historySlice",
  reducers: {
    setCurrentHistory: (state, action) => {
      state.currentHistory = action.payload;
    },
  },
});

export default historySlice.reducer;

export const { setCurrentHistory } = historySlice.actions;
