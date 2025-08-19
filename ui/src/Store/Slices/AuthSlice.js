import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    profile: {},
    profileLoaded: false,
    credentials: {},
    displayError: false,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setCredentials: (state, action) => {
      state.credentials = action.payload;
    },
    setProfileLoaded: (state, action) => {
      state.profileLoaded = action.payload;
    },
    setDisplayError: (state, action) => {
      state.displayError = action.payload;
    },
    clearAuth: (state) => {
      state = this.initialState;
    },
  },
});

export const {
  setProfile,
  setCredentials,
  setProfileLoaded,
  setDisplayError,
} = authSlice.actions;

export const selectProfile = (state) => state.auth.profile;
export const selectProfileLoaded = (state) => state.auth.profileLoaded;
export const selectCredentials = (state) => state.auth.credentials;
export const selectDisplayError = (state) => state.auth.displayError;

export default authSlice.reducer;
