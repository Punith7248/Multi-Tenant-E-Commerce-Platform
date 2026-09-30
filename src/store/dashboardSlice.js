import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalOrders: 24,
  activeOrders: 3,
  wishlist: 12,
  totalSpent: 12450,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
});

export default dashboardSlice.reducer;