import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { AuthState, LoginDetails, UserActivePlan } from "./types";
import { RootState } from "..";

const initialState: AuthState = {
  LoginDetails: {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    country: {
      value: "",
      label: "",
    },
    state: {
      value: "",
      label: "",
    },
    city: {
      value: "",
      label: "",
    },
    zipCode: "",
    occupation: "",
    insurancePlans: [],
    role: "",
    isDeleted: false,
    isSubscribed: false,
    token: "",
    avatar: "",
  },
  headerTitle: "",
  userActivePlan: {
    _id: "",
    name: "",
    type: "",
    price: "",
    isActivePlan: false,
  },
  themeColorMode: "light",
  providerId: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginDetails: (state, action: PayloadAction<LoginDetails>) => {
      state.LoginDetails = action.payload;
    },
    setHeaderTitle: (state, action: PayloadAction<string>) => {
      state.headerTitle = action.payload;
    },
    setThemeColorMode: (state, action: PayloadAction<string>) => {
      state.themeColorMode = action.payload;
    },
    setProviderId: (state, action: PayloadAction<string>) => {
      state.providerId = action.payload;
    },
    setUserActivePlanDetails: (
      state,
      action: PayloadAction<UserActivePlan>
    ) => {
      state.userActivePlan = action.payload;
    },
  },
});

export const {
  setLoginDetails,
  setHeaderTitle,
  setUserActivePlanDetails,
  setThemeColorMode,
  setProviderId,
} = authSlice.actions;

export const auth = (state: RootState) => state.auth;

export default authSlice.reducer;
