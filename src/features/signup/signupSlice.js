import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Swap this out for a real API call to your backend when it's ready.
export const registerCustomer = createAsyncThunk(
  "signup/registerCustomer",
  async ({ fullName, email, phone, password }, { rejectWithValue }) => {
    try {
      // const res = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ fullName, email, phone, password }),
      // });
      // if (!res.ok) throw new Error("Could not create account");
      // return await res.json();

      await new Promise((resolve) => setTimeout(resolve, 600));
      return { fullName, email };
    } catch (err) {
      return rejectWithValue(err.message || "Registration failed");
    }
  }
);

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  showPassword: false,
  showConfirmPassword: false,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setFullName(state, action) {
      state.fullName = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setConfirmPassword(state, action) {
      state.confirmPassword = action.payload;
    },
    toggleShowPassword(state) {
      state.showPassword = !state.showPassword;
    },
    toggleShowConfirmPassword(state) {
      state.showConfirmPassword = !state.showConfirmPassword;
    },
    resetSignupForm() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const {
  setFullName,
  setEmail,
  setPhone,
  setPassword,
  setConfirmPassword,
  toggleShowPassword,
  toggleShowConfirmPassword,
  resetSignupForm,
} = signupSlice.actions;

export default signupSlice.reducer;
