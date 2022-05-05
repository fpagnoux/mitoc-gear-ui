import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIError as APIErrorClass } from "apiClient/client";

import { authClient } from "apiClient/auth";
import type { User, APIErrorType } from "apiClient/types";

import { createCustomAsyncThunk } from "../tools";
export interface AuthState {
  loadingStatus: "loading" | "idle" | "blank";
  loggedIn?: boolean;
  user?: User;
  error?: APIErrorType;
}

const initialState: AuthState = { loadingStatus: "blank" };

export const checkLoggedIn = createCustomAsyncThunk(
  "auth/checkLoggedIn",
  authClient.loggedIn
);

export const logIn = createCustomAsyncThunk("auth/logIn", authClient.logIn);
export const logOut = createAsyncThunk("auth/logOut", authClient.logOut);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkLoggedIn.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(checkLoggedIn.fulfilled, (state, action) => {
        state.loadingStatus = "idle";
        state.loggedIn = action.payload.loggedIn;
        state.user = action.payload.user;
      })
      .addCase(checkLoggedIn.rejected, (state, action) => {
        console.log({ action, payload: action.payload });
        state.loadingStatus = "idle";
        if ((action.payload.err = "userDoesNotMatchPerson")) {
          state.error = {
            msg:
              "Your user account is not associated with a desk worker person. Please contact mitoc-desk@mit.edu to fix the issue.",
            err: action.payload.err,
          };
          return;
        }
        if (action.payload != null) {
          state.error = action.payload;
        }
        state.error = {
          msg:
            "Unable to reach API server. Please try again later and/or contact mitoc-webmaster@mit.edu",
          err: "unavailableServer",
        };
      })
      .addCase(logIn.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loadingStatus = "idle";
        state.loggedIn = true;
        state.user = action.payload as User;
        delete state.error;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loadingStatus = "idle";
        state.error = action.payload as APIErrorType;
      })
      .addCase(logOut.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loadingStatus = "idle";
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.loadingStatus = "idle";
        delete state.user;
        state.loggedIn = false;
      });
  },
});

export default authSlice.reducer;
