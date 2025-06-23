import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for user login
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If response is not ok, throw an error with the message from the backend
                return rejectWithValue(data.message || 'Login failed');
            }

            // Store token and user data in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            console.error('Login API call error:', error);
            return rejectWithValue(error.message || 'Network error during login');
        }
    }
);

// Async thunk for user registration
export const register = createAsyncThunk(
    'auth/register',
    async ({ username, email, password, role }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || 'Registration failed');
            }

            // Store token and user data in localStorage upon successful registration
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            console.error('Register API call error:', error);
            return rejectWithValue(error.message || 'Network error during registration');
        }
    }
);

// Async thunk for user logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            // Optionally call the backend logout endpoint (though token invalidation is client-side for JWT)
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Send token for server-side logging/blacklist if implemented
                },
            });

            const data = await response.json();

            if (!response.ok) {
                // Even if backend fails, clear client-side state
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return rejectWithValue(data.message || 'Logout failed on server, but client state cleared.');
            }

            // Clear token and user data from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return data;
        } catch (error) {
            console.error('Logout API call error:', error);
            // Ensure client-side state is cleared even on network errors
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return rejectWithValue(error.message || 'Network error during logout, client state cleared.');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null, // Initialize token from localStorage
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null, // Initialize user from localStorage
        isAuthenticated: !!localStorage.getItem('token'), // Check if token exists
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        // Reducer to manually set initial auth state based on localStorage
        setAuthInitialState: (state) => {
            state.token = localStorage.getItem('token') || null;
            state.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
            state.isAuthenticated = !!localStorage.getItem('token');
            state.error = null;
            state.successMessage = null;
        },
        clearAuthMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.successMessage = action.payload.message;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
                state.isAuthenticated = false; // Set to false on login rejection
                state.token = null;
                state.user = null;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.successMessage = action.payload.message;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Registration failed';
                state.isAuthenticated = false; // Set to false on registration rejection
                state.token = null;
                state.user = null;
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.successMessage = action.payload.message;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.token = null; // Always clear token on client-side logout rejection
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Logout failed';
            });
    },
});

export const { setAuthInitialState, clearAuthMessages } = authSlice.actions;

export default authSlice.reducer;