import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import cacheReducer from "../features/cache/cacheSlice";
import { gearDbApi } from "../features/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cache: cacheReducer,
    [gearDbApi.reducerPath]: gearDbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gearDbApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
