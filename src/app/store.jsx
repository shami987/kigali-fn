// This file sets up your Redux store, combining all your slices.

import { configureStore } from '@reduxjs/toolkit';
import laptopReducer from '../features/laptops/laptopSlice';
import authReducer from '../features/auth/authSlice'; // NEW: Import auth slice

export const store = configureStore({
    reducer: {
        laptops: laptopReducer,
        auth: authReducer, // NEW: Add your auth slice here
    },
});