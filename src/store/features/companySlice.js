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
    addCompanyEstablishment: (state, action) => {
      state.currentCompany.establishments = [
        ...state.currentCompany.establishments,
        action.payload,
      ];
      state.currentEstablishment = action.payload;
    },
    editCompanyEstablishment: (state, action) => {
      state.currentCompany.establishments = [
        ...(state.currentCompany.establishments &&
          state.currentCompany.establishments.map((establishment) => {
            if (establishment.id === action.payload.id) {
              return action.payload;
            }
            return establishment;
          })),
      ];
    },
    setEstablishmentParcel: (state, action) => {
      const { establishmentId, parcel } = action.payload;
      const establishment = state.currentCompany.establishments.find(
        (establishment) => establishment.id === establishmentId
      );
      if (establishment) {
        if (!establishment.parcels) {
          establishment.parcels = [];
        }
        establishment.parcels.push(parcel);
      }
    },
  },
});

export default companySlice.reducer;

export const {
  setCompany,
  clearCurrentCompany,
  setCompanyEstablishment,
  addCompanyEstablishment,
  editCompanyEstablishment,
  setEstablishmentParcel,
} = companySlice.actions;
