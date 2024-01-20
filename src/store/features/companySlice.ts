import { Company, Establishment } from 'types/company';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type CompanyState = {
  currentCompany: Company | {};
  currentEstablishment: Establishment | {};
};

const initialState: CompanyState = {
  currentCompany: {},
  currentEstablishment: {}
};

export const companySlice = createSlice({
  initialState,
  name: 'companySlice',
  reducers: {
    setCompany: (state, action: PayloadAction<Company | {}>) => {
      state.currentCompany = action.payload;
    },
    setEstablishment: (state, action: PayloadAction<Establishment | {}>) => {
      state.currentEstablishment = action.payload;
    },
    clearCurrentCompany: (state) => {
      state.currentCompany = {};
    },
    setCompanyEstablishment: (state: CompanyState, action: PayloadAction<Establishment | {}>) => {
      state.currentCompany.establishments = [action.payload];
    },
    addCompanyEstablishment: (state, action) => {
      if (!state.currentCompany.establishments) {
        state.currentCompany.establishments = [];
      }
      state.currentCompany.establishments = [
        ...state.currentCompany.establishments,
        action.payload
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
          }))
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
    setEstablishmentParcelHasProduction: (state, action) => {
      const { establishmentId, parcelId } = action.payload;
      const establishment = state.currentCompany.establishments.find(
        (establishment) => establishment.id === parseInt(establishmentId)
      );
      if (establishment && establishment.parcels) {
        establishment.parcels = establishment.parcels.map((parcel) => {
          if (parcel.id === parseInt(parcelId)) {
            return { ...parcel, has_current_production: true };
          }
          return parcel;
        });
      }
    }
  }
});

export default companySlice.reducer;

export const {
  setCompany,
  clearCurrentCompany,
  setCompanyEstablishment,
  addCompanyEstablishment,
  editCompanyEstablishment,
  setEstablishmentParcel,
  setEstablishmentParcelHasProduction
} = companySlice.actions;
