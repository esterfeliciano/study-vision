import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/reducers/auth';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  }
})