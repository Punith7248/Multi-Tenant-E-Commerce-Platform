import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  rememberMe: false,
  showPassword: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
      state.error = null;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
      state.error = null;
    },
    toggleRememberMe: (state) => {
      state.rememberMe = !state.rememberMe;
    },
    toggleShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },
    loginStart: (state) => {
      state.status = "loading";
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    logout: () => initialState,
  },
});

export const {
  setEmail,
  setPassword,
  toggleRememberMe,
  toggleShowPassword,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
