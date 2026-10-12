import { configureStore, createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], tenantId: null, storeName: '' },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      if (state.tenantId && state.tenantId !== item.tenantId) return;
      state.tenantId = item.tenantId;
      state.storeName = item.storeName || state.storeName;
      const existing = state.items.find(x => x.productId === item.productId);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...item, quantity: 1 });
    },
    increment: (state, action) => { const item = state.items.find(x => x.productId === action.payload); if (item) item.quantity += 1; },
    decrement: (state, action) => { const item = state.items.find(x => x.productId === action.payload); if (item && item.quantity > 1) item.quantity -= 1; },
    removeFromCart: (state, action) => { state.items = state.items.filter(x => x.productId !== action.payload); if (!state.items.length) { state.tenantId = null; state.storeName = ''; } },
    clearCart: state => { state.items = []; state.tenantId = null; state.storeName = ''; }
  }
});

export const { addToCart, increment, decrement, removeFromCart, clearCart } = cartSlice.actions;
export default configureStore({ reducer: { cart: cartSlice.reducer } });
