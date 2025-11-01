import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import songsReducer from "./slices/songsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    songs: songsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
