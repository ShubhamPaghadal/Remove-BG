import { createAsyncThunk } from '@reduxjs/toolkit';
import paymentModel from '@/models/payment';
import stripeModel from '@/models/stripe';
import ResponseError from '@/errors/responseError';
import { PLAN_TYPE } from '@/const/plans';

export const fetchPrices = createAsyncThunk(
	'billing/fetchPrices',
	async (payload, { rejectWithValue }) => {
		try {
			const response = await stripeModel.getPrices(payload);

			return response.prices
				.sort((plan1, plan2) => plan1.baseAmount - plan2.baseAmount)
				.filter(
					item =>
						item.active &&
						![PLAN_TYPE.SERVICE, PLAN_TYPE.STORAGE].includes(item.name)
				);
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue({ status: error.status, data: error.data });
			}
			throw error;
		}
	}
);

export const fetchPayments = createAsyncThunk(
	'billing/fetchPayments',
	async (pageSize, { getState, rejectWithValue }) => {
		try {
			const { page } = getState().billing;
			const response = await paymentModel.getPayments(page, pageSize);

			return response;
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue({ status: error.status, data: error.data });
			}
			throw error;
		}
	}
);
