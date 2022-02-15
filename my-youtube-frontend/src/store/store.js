import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authentication/auth';

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
})