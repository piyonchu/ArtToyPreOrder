import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAllArtToys, IArtToy } from "@/lib/interface";

interface InitialState {
  allArtToys: IAllArtToys;
  allArtToyLoading: boolean;
  artToy: IArtToy;
  artToyLoading: boolean;
}

const initialState: InitialState = {
  allArtToys: {
    page: 0,
    totalPages: 0,
    totalProducts: 0,
    products: [],
  },
  artToy: {
    _id: "",
    sku: "",
    name: "",
    description: "",
    arrivalDate: "",
    availableQuota: 0,
    posterPicture: "",
    price: 0,
    discountPercentage: 0,
    discountedPrice: 0,
    rating: 0,
    images: [],
    tags: [],
  },
  allArtToyLoading: false,
  artToyLoading: false,
};

const artToySlice = createSlice({
  name: "artToy",
  initialState,
  reducers: {
    setAllArtToys: (state, action: PayloadAction<IAllArtToys>) => {
      state.allArtToys = action.payload;
    },

    setAllArtToyLoading: (state, action: PayloadAction<boolean>) => {
      state.allArtToyLoading = action.payload;
    },

    setArtToy: (state, action: PayloadAction<IArtToy>) => {
      state.artToy = action.payload;
    },

    setArtToyLoading: (state, action: PayloadAction<boolean>) => {
      state.artToyLoading = action.payload;
    },
  },
});

export const {
  setAllArtToys,
  setAllArtToyLoading,
  setArtToy,
  setArtToyLoading,
} = artToySlice.actions;

export default artToySlice.reducer;
