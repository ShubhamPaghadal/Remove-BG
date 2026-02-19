import { createSlice } from '@reduxjs/toolkit';
import { fetchPrices, fetchPayments } from './thunks';

export * from './thunks';

// Thunk state shape helper
const thunkState = () => ({
    data: null,
    loading: false,
    error: null,
    completed: false
});

const initialState = {
    info: null,
    page: 1,
    // Thunk status objects (read by components as state.billing.fetchPrices.loading etc.)
    fetchPrices: thunkState(),
    fetchPayments: thunkState()
};

const billingSlice = createSlice({
    name: 'billing',
    initialState,
    reducers: {
        clearData: () => initialState,
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchPrices
            .addCase(fetchPrices.pending, (state) => {
                state.fetchPrices.loading = true;
                state.fetchPrices.completed = false;
                state.fetchPrices.error = null;
            })
            .addCase(fetchPrices.fulfilled, (state, action) => {
                state.fetchPrices.loading = false;
                state.fetchPrices.completed = true;
                state.fetchPrices.data = action.payload;
            })
            .addCase(fetchPrices.rejected, (state, action) => {
                state.fetchPrices.loading = false;
                state.fetchPrices.completed = true;
                state.fetchPrices.error = action.payload;
            })
            // fetchPayments
            .addCase(fetchPayments.pending, (state) => {
                state.fetchPayments.loading = true;
                state.fetchPayments.completed = false;
                state.fetchPayments.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.fetchPayments.loading = false;
                state.fetchPayments.completed = true;
                state.fetchPayments.data = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.fetchPayments.loading = false;
                state.fetchPayments.completed = true;
                state.fetchPayments.error = action.payload;
            });
    }
});

export const { clearData, setPage } = billingSlice.actions;

export default billingSlice.reducer;
