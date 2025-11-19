import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IArtToy } from "@/lib/interface";  // Assuming IArtToy interface is imported

// Define the structure for user data
interface User {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: string;
}

interface OrderState {
  orders: {
    _id: string;
    artToy: IArtToy;
    orderAmount: number;
    totalQuantity: number;
    totalPrice: number;
    user?: User;  // Include user info if present (for admins)
  }[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: null,
  loading: false,
  error: null,
};

// Async thunk for fetching orders from the API
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // Handle possible non-200 status codes here
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders.");
      }
      console.log("fecteh order", data);
      // Return orders data which can optionally include user info
      return data.data;  // Assuming the backend includes user info for admin requests
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch orders.");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;

        const ordersWithUserData = action.payload.map((order: any) => {
          // Check if the logged-in user is an admin
          const isAdmin = localStorage.getItem("role") === "admin";

          // If admin, include user data with each order
          if (isAdmin) {
            return { ...order, user: order.user || null };
          }

          // For non-admin, exclude user data
          return { ...order, user: undefined };
        });

        state.orders = ordersWithUserData;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
