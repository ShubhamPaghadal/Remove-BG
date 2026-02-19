import { createAsyncThunk } from '@reduxjs/toolkit';

import { PLAN_TYPE } from '@/const/plans';
import stripeModel, {
	SUBSCRIPTION_STATUS,
	USER_COUNTRY_HEADER_KEY
} from '@/models/stripe';
import schemas from '@/validations';
import ResponseError from '@/errors/responseError';
import { fetchBillingInfo } from '../auth/thunks';
import { STEPS } from './constants';

export function getUserCurrency(user) {
	if (user?.paymentInfo?.stripeCustomerCurrency) {
		return user.paymentInfo.stripeCustomerCurrency;
	}
}

export const getPrices = createAsyncThunk(
	'checkout/getPrices',
	async (payload, { rejectWithValue, getState }) => {
		const { country, allowSelectedCurrency } = payload;
		const { user, currency } = getState().auth;
		const userCurrency = getUserCurrency(user);

		try {
			const { prices, headers = {} } = await stripeModel.getPrices({
				country: country || user?.taxInformation?.country,
				currency: allowSelectedCurrency
					? currency || userCurrency
					: userCurrency,
				filterActive: true
			});

			const userCountry =
				country ||
				user?.billingData?.country ||
				headers[USER_COUNTRY_HEADER_KEY]?.toLowerCase() ||
				null;

			const filteredPrices = prices.filter(item => item.name !== 'service');

			return { prices: filteredPrices, userCountry };
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue({ status: error.status, data: error.data });
			}

			throw error;
		}
	}
);

export const changePlan = createAsyncThunk(
	'checkout/changePlan',
	async (payload, { rejectWithValue }) => {
		try {
			const { priceId } = payload;

			const response = await stripeModel.getNextAction(priceId);

			return { priceId, nextAction: response };
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue({ status: error.status, data: error.data });
			}

			throw error;
		}
	}
);

export const initCheckout = createAsyncThunk(
	'checkout/initCheckout',
	async (_, { rejectWithValue, dispatch, getState }) => {
		try {
			const userState = getState().auth;
			const { taxInformation, email = '' } = userState.user;
			let step = STEPS.SELECT_PLAN;
			const queryParams = new URLSearchParams(window.location.search);

			const clientSecret = queryParams.get('clientSecret');
			const priceIdParam = queryParams.get('priceId');
			const priceNameParam = queryParams.get('priceName');

			const userCurrency = getUserCurrency(userState.user);

			const [{ prices, headers = {} }, { subscriptionInfo }] =
				await Promise.all([
					stripeModel.getPrices({
						country: taxInformation?.country,
						currency: userState.currency || userCurrency,
						filterActive: false
					}),
					dispatch(fetchBillingInfo()).unwrap()
				]);

			const activePrices = prices.filter(price => {
				return (
					price.active &&
					(price.id !== subscriptionInfo.stripePriceId ||
						subscriptionInfo.status !== SUBSCRIPTION_STATUS.ACTIVE) &&
					(!price.name !== PLAN_TYPE.TRIAL ||
						subscriptionInfo.status !== SUBSCRIPTION_STATUS.ACTIVE)
				);
			});

			const userCountry =
				headers[USER_COUNTRY_HEADER_KEY]?.toLowerCase() || null;

			/*
                I check here if price id belongs to a real price on price list, if not I look for the Annually one as
                the default price for the ckeckout. This checking is to avoid a possible scenario in which users could've
                an old priceId saved on localstorage. And after that I save data again on localstorage.
            */

			let validPriceId = activePrices.find(
				price =>
					(priceNameParam === PLAN_TYPE.TRIAL ||
						priceIdParam === price.id) &&
					// price trial when user is subscribed is not allowed
					(price.name !== PLAN_TYPE.TRIAL ||
						subscriptionInfo.status !== SUBSCRIPTION_STATUS.ACTIVE)
			);

			if (!validPriceId?.id) {
				const validInactivePrice = prices.find(
					price => price.id === priceIdParam && !price.active
				);

				validPriceId = activePrices.find(
					price => price.name === validInactivePrice?.name
				);
			}

			if (validPriceId) {
				step = schemas
					.taxInformation({ sync: true })
					.isValidSync(taxInformation)
					? STEPS.PAYMENT
					: STEPS.BILLING;
			}

			const priceId =
				priceIdParam !== 'none' &&
				(validPriceId?.id ||
					activePrices.find(
						price =>
							(price.name === PLAN_TYPE.TRIAL &&
								![
									SUBSCRIPTION_STATUS.ACTIVE,
									SUBSCRIPTION_STATUS.TRIALLING
								].includes(subscriptionInfo.status)) ||
							price.name !== PLAN_TYPE.TRIAL
					)?.id);

			let relevantBillingData;

			if (taxInformation) {
				relevantBillingData = {
					country: taxInformation?.country || '',
					accountType: taxInformation?.type || '',
					email: taxInformation?.email || email || ''
				};
			}

			const nextAction = await stripeModel.getNextAction(priceId);

			return {
				priceId,
				nextAction,
				clientSecret,
				userCountry,
				activePrices,
				step,
				relevantBillingData
			};
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue({ status: error.status, data: error.data });
			}

			throw error;
		}
	}
);
