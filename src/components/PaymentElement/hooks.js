import { useState } from 'react';
import { useSelector } from 'react-redux';
import { redirectTo } from '@/pages/private/checkout/utils';
import routes from '@/routes';
import stripeModel, {
	PAYMENT_INTENT_STATUS,
	SUBSCRIPTION_STATUS
} from '@/models/stripe';
import userModel from '@/models/user';

import { confirmPayment, waitForResourceCondition } from './utils';

export function usePaymentUtils({
	successRedirectTo = `${routes.myImages}?success=true`,
	onPaymentSuccess = () => { }
} = {}) {
	const [newErr, setNewErr] = useState(null);
	const [executingPayment, setExecutingPayment] = useState(false);

	const { stripeSubscriptionId } = useSelector(
		state => state.auth?.user || {}
	);
	const currency = useSelector(state => state.auth.currency);

	function clearError() {
		setNewErr(null);
	}

	async function executePayment(stripe, config = {}) {
		try {
			const {
				priceId,
				clientSecret = null,
				nextAction = 'subscribe',
				hasTrialDiscount = false
			} = config;

			if (!priceId) {
				return;
			}

			setExecutingPayment(true);

			if (clientSecret) {
				if (!stripe) {
					return;
				}

				const response = await stripeModel.getPaymentMethodDetails();

				await confirmPayment(stripe, {
					type: response.stripePaymentMethodType,
					stripePaymentMethodId: response.stripePaymentMethodId,
					clientSecret,
					stripeSubscriptionId
				});

				onPaymentSuccess?.();
				return redirectTo(successRedirectTo);
			}

			let response = null;

			if (nextAction === 'subscribe') {
				response = await stripeModel.subscribe({
					priceId,
					currency
				});

				if (response.isFree) {
					const fetchProfileFn = () => userModel.me();
					await waitForResourceCondition(
						fetchProfileFn,
						profileResponse => {
							return [
								SUBSCRIPTION_STATUS.ACTIVE,
								SUBSCRIPTION_STATUS.TRIALLING
							].includes(profileResponse?.subscription?.status);
						}
					);

					onPaymentSuccess?.();

					return redirectTo(successRedirectTo);
				}
			} else {
				await stripeModel.switchSubscription(priceId);
				return redirectTo(`${routes.myImages}?redirect=true`);
			}

			if (!response.paymentIntent) {
				onPaymentSuccess?.();

				if (hasTrialDiscount) {
					return redirectTo(`${routes.myImages}?redirect=true`);
				}

				return redirectTo(routes.billing);
			}

			if (
				[
					PAYMENT_INTENT_STATUS.REQUIRES_ACTION,
					PAYMENT_INTENT_STATUS.REQUIRES_CONFIRMATION
				].includes(response.paymentIntent.status)
			) {
				await confirmPayment(stripe, {
					type: response.paymentIntent.payment_method.type,
					stripePaymentMethodId: response.paymentIntent.payment_method.id,
					clientSecret: response.paymentIntent.clientSecret,
					stripeSubscriptionId: response.subscription.id
				});
			}

			/*
				Payment intent is succeeded, requires_payment_method, processing, or `stripeModule.confirmPayment` was successful
			*/
			onPaymentSuccess?.();
			redirectTo(successRedirectTo);
			setExecutingPayment(false);
		} catch (err) {
			setExecutingPayment(false);
			// 3dSecure 2 failure
			if (err.code === 'payment_intent_authentication_failure') {
				return redirectTo(routes.billing);
			}

			setNewErr(err);
		}
	}

	return {
		executePayment,
		paymentError: newErr,
		executingPayment,
		clearError
	};
}
