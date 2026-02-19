import { createSlice } from '@reduxjs/toolkit';
import { getPrices, changePlan, initCheckout } from './thunks';

export * from './thunks';

const initialState = {
    prices: [],
    userCountry: null,
    status: 'idle',
    error: null,
    checkoutData: null,
    isPaymentBreakdownModalOpen: false
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        resetCheckout: (state) => {
            return initialState;
        },
        setIsPaymentBreakdownModalOpen: (state, action) => {
            state.isPaymentBreakdownModalOpen = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPrices.fulfilled, (state, action) => {
                state.prices = action.payload.prices;
                state.userCountry = action.payload.userCountry;
            })
            .addCase(initCheckout.fulfilled, (state, action) => {
                state.checkoutData = action.payload;
            });
    }
});

export const { resetCheckout, setIsPaymentBreakdownModalOpen } = checkoutSlice.actions;

export default checkoutSlice.reducer;
