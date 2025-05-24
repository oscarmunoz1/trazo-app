import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentForm: null
};

export const formSlice = createSlice({
  initialState,
  name: 'companySlice',
  reducers: {
    setForm: (state, action) => {
      console.log('action.payload', action.payload);
      console.log('state.currentForm', state.currentForm);
      // Deep merge establishment if present
      if (action.payload.establishment && state.currentForm?.establishment) {
        state.currentForm = {
          ...state.currentForm,
          ...action.payload,
          establishment: {
            ...state.currentForm.establishment,
            ...action.payload.establishment
          }
        };
      } else {
        state.currentForm = { ...state.currentForm, ...action.payload };
      }
    },
    clearForm: (state) => {
      state.currentForm = initialState.currentForm;
    }
  }
});

export default formSlice.reducer;

export const { setForm, clearForm } = formSlice.actions;
