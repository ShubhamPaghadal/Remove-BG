import { createAsyncThunk } from '@reduxjs/toolkit';
import authModel from '@/models/auth';
import userModel from '@/models/user';
import stripeModel from '@/models/stripe';
import billingModel from '@/models/billing';
import ResponseError from '@/errors/responseError';

import { PAYMENT_BREAKDOWN_KEY } from '@/pages/private/editor/PaymentBreakdownModal/constants';
import { clearData, clearImages } from '../editor';

export const fetchMe = createAsyncThunk(
	'auth/me',
	async (_, { rejectWithValue }) => {
		try {
			const response = await userModel.me();

			localStorage.removeItem('gclid');

			return response;
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue({ status: error.status, data: error.data });
			}
			throw error;
		}
	}
);

export const updateUser = createAsyncThunk(
	'profile/updateUser',
	async (values, { rejectWithValue, dispatch }) => {
		try {
			const response = await userModel.update(values);

			if (!response.success) {
				throw new Error(response.statusText);
			}

			dispatch(fetchMe());

			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const fetchBillingInfo = createAsyncThunk(
	'customAuth/fetchBillingInfo',
	async (_, { rejectWithValue }) => {
		try {
			const response = await billingModel.getInfo();

			return response;
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue({ status: error.status, data: error.data });
			}
			throw error;
		}
	}
);

export const login = createAsyncThunk(
	'auth/login',
	async (payload, { rejectWithValue }) => {
		try {
			const response = await authModel.login(payload);

			return response;
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue({ status: error.status, data: error.data });
			}

			throw error;
		}
	}
);

export const logout = createAsyncThunk(
	'auth/logout',
	async (_, { dispatch }) => {
		const response = await authModel.logout();

		setTimeout(() => {
			dispatch(clearImages());
			dispatch(clearData());
		}, 200);

		localStorage.removeItem('user');
		localStorage.removeItem(PAYMENT_BREAKDOWN_KEY);

		return response;
	}
);

export const signUp = createAsyncThunk(
	'auth/signUp',
	async (payload, { rejectWithValue }) => {
		try {
			const response = await userModel.create(payload);

			return response;
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue(error);
			}

			throw error;
		}
	}
);

export const fetchCurrencies = createAsyncThunk(
	'auth/fetchCurrencies',
	async (_, { rejectWithValue }) => {
		try {
			return await stripeModel.getCurrencies();
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue({ status: error.status, data: error.data });
			}

			throw error;
		}
	}
);
