import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [
    {
      id: "#NC-1024",
      product: "Wireless Headphones",
      date: "Sep 28, 2026",
      amount: 2499,
      status: "Delivered",
    },
    {
      id: "#NC-1023",
      product: "Smart Watch",
      date: "Sep 25, 2026",
      amount: 3999,
      status: "Processing",
    },
    {
      id: "#NC-1022",
      product: "Running Shoes",
      date: "Sep 21, 2026",
      amount: 2799,
      status: "Shipped",
    },
  ],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
});

export default ordersSlice.reducer;