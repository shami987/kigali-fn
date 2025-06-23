import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Assuming logout comes from authSlice
// import { logout } from '../auth/authSlice'; // Uncomment if you want to dispatch logout from here on 401

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Helper function for API calls with auth
const fetchWithAuth = async (url, options = {}, { rejectWithValue, dispatch }) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { ...options, headers });
        const data = await response.json();

        if (response.status === 401) { // Unauthorized
            dispatch(setErrorMessage('Session expired or unauthorized. Please log in again.'));
            // If you want to force logout on 401:
            // if (dispatch && typeof logout === 'function') { // Check if logout is imported and callable
            //     dispatch(logout());
            // }
            return rejectWithValue(data.message || 'Unauthorized');
        }

        if (!response.ok) {
            return rejectWithValue(data.message || 'Request failed');
        }
        return data;
    } catch (error) {
        console.error('API call error:', error);
        return rejectWithValue(error.message || 'Network error');
    }
};

// Async Thunks for Laptop Operations

export const fetchLaptops = createAsyncThunk(
    'laptops/fetchLaptops',
    async (_, { rejectWithValue, dispatch }) => {
        return fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/api/laptops`, { method: 'GET' }, { rejectWithValue, dispatch });
    }
);

export const addLaptop = createAsyncThunk(
    'laptops/addLaptop',
    async (laptopData, { rejectWithValue, dispatch }) => {
        // laptopData should now include 'model'
        return fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/api/laptops`, {
            method: 'POST',
            body: JSON.stringify(laptopData),
        }, { rejectWithValue, dispatch });
    }
);

export const updateLaptop = createAsyncThunk(
    'laptops/updateLaptop',
    async ({ id, laptopData }, { rejectWithValue, dispatch }) => {
        // laptopData now expects name, serialNumber, model (as per backend schema)
        return fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/api/laptops/${id}`, {
            method: 'PUT',
            body: JSON.stringify(laptopData),
        }, { rejectWithValue, dispatch });
    }
);

export const deleteLaptop = createAsyncThunk(
    'laptops/deleteLaptop',
    async (id, { rejectWithValue, dispatch }) => {
        return fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/api/laptops/${id}`, {
            method: 'DELETE',
        }, { rejectWithValue, dispatch });
    }
);

export const distributeLaptop = createAsyncThunk(
    'laptops/distributeLaptop',
    async (distributionData, { rejectWithValue, dispatch }) => {
        return fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/api/laptops/distribute`, {
            method: 'POST',
            body: JSON.stringify(distributionData),
        }, { rejectWithValue, dispatch });
    }
);

export const returnLaptop = createAsyncThunk(
    'laptops/returnLaptop',
    async ({ laptopId, returnedReason }, { rejectWithValue, dispatch }) => {
        return fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/api/laptops/return`, {
            method: 'POST',
            body: JSON.stringify({ laptopId, returnedReason }),
        }, { rejectWithValue, dispatch });
    }
);

const laptopSlice = createSlice({
    name: 'laptops',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
        message: null, // For success messages
        appView: 'home', // 'home', 'listLaptops', 'addLaptop', 'distributeLaptop', 'returnLaptop', 'editLaptop'
        editingLaptopId: null, // NEW: ID of the laptop currently being edited
    },
    reducers: {
        setAppView: (state, action) => {
            state.appView = action.payload;
            state.error = null;
            state.message = null;
            // Clear editing state when changing views
            if (action.payload !== 'editLaptop') {
                state.editingLaptopId = null;
            }
        },
        clearMessages: (state) => {
            state.error = null;
            state.message = null;
        },
        setErrorMessage: (state, action) => {
            state.error = action.payload;
        },
        setEditingLaptopId: (state, action) => { // NEW: Reducer to set the ID of the laptop to edit
            state.editingLaptopId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Laptops
            .addCase(fetchLaptops.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.message = null;
            })
            .addCase(fetchLaptops.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchLaptops.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add Laptop
            .addCase(addLaptop.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.message = null;
            })
            .addCase(addLaptop.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items.push(action.payload);
                state.message = 'Laptop added successfully!';
            })
            .addCase(addLaptop.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Update Laptop
            .addCase(updateLaptop.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.message = null;
            })
            .addCase(updateLaptop.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.items.findIndex(laptop => laptop._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload; // Update the laptop in the list
                }
                state.message = 'Laptop updated successfully!';
                state.editingLaptopId = null; // Clear editing state after successful update
            })
            .addCase(updateLaptop.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Delete Laptop
            .addCase(deleteLaptop.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.message = null;
            })
            .addCase(deleteLaptop.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = state.items.filter(laptop => laptop._id !== action.meta.arg);
                state.message = action.payload.message || 'Laptop deleted successfully!';
            })
            .addCase(deleteLaptop.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Distribute Laptop
            .addCase(distributeLaptop.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.message = null;
            })
            .addCase(distributeLaptop.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.items.findIndex(laptop => laptop._id === action.payload.laptop._id);
                if (index !== -1) {
                    state.items[index] = action.payload.laptop;
                }
                state.message = action.payload.message || 'Laptop distributed successfully!';
            })
            .addCase(distributeLaptop.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Return Laptop
            .addCase(returnLaptop.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.message = null;
            })
            .addCase(returnLaptop.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.items.findIndex(laptop => laptop._id === action.payload.laptop._id);
                if (index !== -1) {
                    state.items[index] = action.payload.laptop;
                }
                state.message = action.payload.message || 'Laptop returned successfully!';
            })
            .addCase(returnLaptop.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setAppView, clearMessages, setErrorMessage, setEditingLaptopId } = laptopSlice.actions;

export default laptopSlice.reducer;