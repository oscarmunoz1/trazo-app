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
    setEventToHistory: (state, action) => {
      if (!state.currentHistory?.events) {
        state.currentHistory.events = [action.payload];
      } else {
        state.currentHistory.events.push(action.payload);
      }
    },
  },
});

export default historySlice.reducer;

export const { setCurrentHistory, setEventToHistory } = historySlice.actions;
