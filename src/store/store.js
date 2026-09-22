import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import signupReducer from "../features/signup/signupSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
  },
});