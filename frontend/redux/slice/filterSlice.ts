import { createSlice } from "@reduxjs/toolkit";

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
  priceRange: [0, 500], // default price range
  tags: [],
  arrivalDate: "",
  availableQuota: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // Toggle brand selection
    setBrand: (state, action) => {
      let brand = action.payload;
      let index = state.brand.indexOf(brand);

      if (index > -1) {
        state.brand.splice(index, 1);
      } else {
        state.brand.push(brand);
      }
    },

    // Toggle filter visibility
    setOpenFilter: (state, action) => {
      state.openFilter = action.payload;
      state.openFilter === true
        ? (document.body.style.overflow = "hidden")
        : (document.body.style.overflow = "visible");
    },

    // Set sorting preferences
    setSort: (state, action) => {
      state.sort = action.payload;
    },

    // Set or reset rating filter
    setRating: (state, action) => {
      state.rating = action.payload === state.rating ? "" : action.payload;
    },

    // Set or reset offer filter
    setOffer: (state, action) => {
      state.offer = action.payload === state.offer ? "" : action.payload;
    },

    // Set the price range filter
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },

    setPrice: (state, action) => {
      state.price = action.payload;
    },

    // Set the tags filter
    setTags: (state, action) => {
      state.tags = action.payload;
    },

    // Set the arrival date filter
    setArrivalDate: (state, action) => {
      state.arrivalDate = action.payload;
    },

    // Set the available quota filter
    setAvailableQuota: (state, action) => {
      state.availableQuota = action.payload;
    },
  },
});

// Export the actions from the slice
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
} = filterSlice.actions;

export default filterSlice.reducer;
