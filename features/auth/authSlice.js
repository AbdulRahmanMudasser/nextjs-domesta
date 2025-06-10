import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("actionsss:", action.payload);
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      storage.removeItem("persist:root"); // Persisted state remove karega
      localStorage.clear(); // Pura localStorage clear karega
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
