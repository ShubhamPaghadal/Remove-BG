import { createSlice } from '@reduxjs/toolkit';
import {
    fetchMe,
    login,
    logout,
    signUp,
    updateUser,
    fetchBillingInfo,
    fetchCurrencies
} from './thunks';

export * from './selectors';
export * from './thunks';
export * from './utils';

export const AUTH_MODAL_TYPES = {
    LOGIN: 'login',
    SIGN_UP: 'sign_up',
    FAST_SIGN_UP: 'fast_sign_up',
    FORGOT_PASSWORD: 'forgot_password',
    RECOVER_PASSWORD: 'recover_password',
    CHANGE_PASSWORD: 'change_password'
};

// Defines redirect URLs per auth scope (e.g. after login from a specific feature)
// Populate with entries like: { editor: { login: '/editor', register: '/editor' } }
export const REDIRECT_SCOPES = {};

const initialState = {
    user: null,
    loggedIn: false,
    me: { status: 'idle', error: null },
    login: { status: 'idle', error: null },
    signUp: { status: 'idle', error: null },
    currency: null,
    billingInfo: null,
    status: 'idle',
    error: null,
    // Billing state (populated by fetchBillingInfo)
    subscriptionInfo: { hasPayment: false, willCancel: false },
    paymentInfo: { stripePriceId: null },
    billingInfoReady: false,
    // Auth modal state
    authModalType: null,
    authModalScope: null,
    authModalRedirect: null,
    authModalEditor: false,
    // UI flags
    legalsReady: true,
    language: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuthError: (state) => {
            state.error = null;
            state.login.error = null;
            state.signUp.error = null;
        },

        // ── Auth Modal ──────────────────────────────────────────────────────
        setAuthModalType: (state, action) => {
            state.authModalType = action.payload;
        },
        /**
         * setAuthModalOptions({ type, scope?, redirect?, editor? })
         * One-shot action to open the auth modal with all relevant options.
         */
        setAuthModalOptions: (state, action) => {
            const { type, scope = null, redirect = null, editor = false } = action.payload ?? {};
            state.authModalType = type;
            state.authModalScope = scope;
            state.authModalRedirect = redirect;
            state.authModalEditor = editor;
        },
        setAuthModalRedirect: (state, action) => {
            state.authModalRedirect = action.payload;
        },
        /**
         * clearAuthModalData — resets all modal-related state after the modal closes.
         * Called with a delay so the closing animation can finish.
         */
        clearAuthModalData: (state) => {
            state.authModalType = null;
            state.authModalScope = null;
            state.authModalRedirect = null;
            state.authModalEditor = false;
        },

        // ── User / Me ───────────────────────────────────────────────────────
        clearMe: (state) => {
            state.me = { status: 'idle', error: null };
        },
        clearShowCreditsAnimation: (state) => {
            if (state.user) {
                state.user.showCreditsAnimation = false;
            }
        },

        // ── Preferences ─────────────────────────────────────────────────────
        setCurrency: (state, action) => {
            state.currency = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setLegalsReady: (state, action) => {
            // Called with no argument or true to mark ready; false to mark loading.
            state.legalsReady = action.payload !== false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loggedIn = !!action.payload;
                state.me.status = 'succeeded';
            })
            .addCase(fetchMe.pending, (state) => {
                state.me.status = 'loading';
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.me.status = 'failed';
                state.me.error = action.payload;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loggedIn = true;
                state.login.status = 'succeeded';
            })
            .addCase(login.pending, (state) => {
                state.login.status = 'loading';
            })
            .addCase(login.rejected, (state, action) => {
                state.login.status = 'failed';
                state.login.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.loggedIn = false;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loggedIn = true;
                state.signUp.status = 'succeeded';
            })
            .addCase(signUp.pending, (state) => {
                state.signUp.status = 'loading';
            })
            .addCase(signUp.rejected, (state, action) => {
                state.signUp.status = 'failed';
                state.signUp.error = action.payload;
            })
            .addCase(fetchCurrencies.fulfilled, (state, action) => {
                if (action.payload?.currencies) {
                    // e.g. state.currencies = action.payload.currencies;
                }
            })
            .addCase(fetchBillingInfo.pending, (state) => {
                state.billingInfoReady = false;
            })
            .addCase(fetchBillingInfo.fulfilled, (state, action) => {
                state.billingInfoReady = true;
                if (action.payload) {
                    const { subscriptionInfo, paymentInfo } = action.payload;
                    if (subscriptionInfo) state.subscriptionInfo = subscriptionInfo;
                    if (paymentInfo) state.paymentInfo = paymentInfo;
                }
            })
            .addCase(fetchBillingInfo.rejected, (state) => {
                state.billingInfoReady = true;
            });
    }
});

export const {
    resetAuthError,
    setAuthModalType,
    setAuthModalOptions,
    setAuthModalRedirect,
    clearAuthModalData,
    clearMe,
    clearShowCreditsAnimation,
    setCurrency,
    setLanguage,
    setLegalsReady
} = authSlice.actions;

export default authSlice.reducer;
