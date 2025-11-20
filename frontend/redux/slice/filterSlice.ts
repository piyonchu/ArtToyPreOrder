import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state type for the filters
interface InitialState {
  brand: string[];
  openFilter: boolean;
  sort: { field: string; order: string };
  rating: string;
  offer: string;
  price: string;
  priceRange: [number, number];
  tags: string[];
  arrivalDate: string;
  availableQuota: string;
  searchQuery: string; // <--- Added this
}

const initialState: InitialState = {
  brand: [],
  openFilter: false,
  sort: {
    field: "",
    order: "",
  },
  rating: "",
  price: "",
  offer: "",
  priceRange: [0, 500],
  tags: [],
  arrivalDate: "",
  availableQuota: "",
  searchQuery: "", // <--- Initialize this
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // Set the search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setBrand: (state, action) => {
      let brand = action.payload;
      let index = state.brand.indexOf(brand);

      if (index > -1) {
        state.brand.splice(index, 1);
      } else {
        state.brand.push(brand);
      }
    },

    setOpenFilter: (state, action) => {
      state.openFilter = action.payload;
      state.openFilter === true
        ? (document.body.style.overflow = "hidden")
        : (document.body.style.overflow = "visible");
    },

    setSort: (state, action) => {
      state.sort = action.payload;
    },

    setRating: (state, action) => {
      state.rating = action.payload === state.rating ? "" : action.payload;
    },

    setOffer: (state, action) => {
      state.offer = action.payload === state.offer ? "" : action.payload;
    },

    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },

    setPrice: (state, action) => {
      state.price = action.payload;
    },

    setTags: (state, action) => {
      state.tags = action.payload;
    },

    setArrivalDate: (state, action) => {
      state.arrivalDate = action.payload;
    },

    setAvailableQuota: (state, action) => {
      state.availableQuota = action.payload;
    },
  },
});

export const {
  setBrand,
  setOpenFilter,
  setSort,
  setRating,
  setOffer,
  setPrice,
  setPriceRange,
  setTags,
  setArrivalDate,
  setAvailableQuota,
  setSearchQuery, // <--- Export this
} = filterSlice.actions;

export default filterSlice.reducer;