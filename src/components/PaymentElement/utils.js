import i18next from 'i18next';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { PAYMENT_METHOD_TYPE } from '@/models/stripe';
import routes from '@/routes';
import { delay } from '@/utils';

export const mapErrCode = {
	requires_payment_method: i18next.t(
		'checkout.stripe.errors.requiresPaymentMethod'
	),
	card_declined: i18next.t('checkout.stripe.errors.cardDeclined'),
	processing_error: i18next.t('checkout.stripe.errors.processingError'),
	incorrect_cvc: i18next.t('checkout.stripe.errors.incorrectCvc'),
	expired_card: i18next.t('checkout.stripe.errors.expiredCard'),
	insufficient_funds: i18next.t('checkout.stripe.errors.insufficientFunds'),
	// Do not tell the customer the actual reason
	stolen_card: i18next.t('checkout.stripe.errors.stolenCard'),
	// Do not tell the customer the actual reason
	lost_card: i18next.t('checkout.stripe.errors.lostCard'),
	incorrect_number: i18next.t('checkout.stripe.errors.incorrectNumber'),
	incorrect_zip: i18next.t('checkout.stripe.errors.incorrectZip'),
	invalid_expiry_month: i18next.t('checkout.stripe.errors.invalidExpiryMonth'),
	invalid_expiry_year: i18next.t('checkout.stripe.errors.invalidExpiryYear'),
	// Do not tell the customer the actual reason
	merchant_blacklist: i18next.t('checkout.stripe.errors.merchantBlacklist'),
	withdrawal_count_limit_exceeded: i18next.t(
		'checkout.stripe.errors.withdrawalCountLimitExceeded'
	),
	card_decline_rate_limit_exceeded: i18next.t(
		'checkout.stripe.errors.cardDeclineRateLimitExceeded'
	),
	setup_intent_authentication_failure: i18next.t(
		'checkout.stripe.errors.setupIntentAuthenticationFailure'
	),
	paypal_card_error: i18next.t('checkout.stripe.errors.paypalCardError')
};

export function mapErrors(code, message) {
	return mapErrCode[code] || message || code;
}

export function usePaymentCardErrors() {
	const [finalError, setFinalError] = useState('');
	const [genericError, setGenericError] = useState(false);

	function handleCodeErr(code, error, declineCode) {
		const message = error.message || error.data?.message;

		if (
			code.indexOf('number') !== -1 ||
			code.indexOf('expiry') !== -1 ||
			code.indexOf('cvc') !== -1 ||
			mapErrCode[declineCode] ||
			mapErrCode[code]
		) {
			setFinalError(mapErrors(code, message));
		} else if (mapErrCode[error.extended_code]) {
			setFinalError(mapErrors(error.extended_code, message));
		} else {
			setFinalError(message);
		}
	}

	function handleError(error) {
		if (
			error.code === 'card_declined' &&
			error.payment_method?.card?.brand === 'amex'
		) {
			setFinalError(i18next.t('checkout.stripe.errors.amexDeclined'));
		} else if (
			error.type === 'card_error' ||
			[
				'setup_intent_authentication_failure',
				'card_decline_rate_limit_exceeded'
			].includes(error.code)
		) {
			const { code, decline_code: declineCode } = error;

			handleCodeErr(code, error, declineCode);
		} else if (error.type === 'validation_error') {
			setFinalError('');
		} else {
			setGenericError(true);
		}
	}

	function resetError() {
		setFinalError('');
	}

	function resetGenericError() {
		setGenericError(false);
	}

	return [
		{
			error: finalError,
			genericError
		},
		{
			handleError,
			resetError,
			setGenericError,
			resetGenericError
		}
	];
}

export function useProcessingParams() {
	const [searchParams, setSearchParams] = useSearchParams();

	const redirectStatus = searchParams.get('redirect_status');
	const setupIntentParam = searchParams.get('setup_intent');
	const setupIntentClientSecret = searchParams.get(
		'setup_intent_client_secret'
	);

	return [
		{
			data: {
				redirectStatus,
				setupIntentParam,
				setupIntentClientSecret
			},
			shouldProcessSetupIntent:
				redirectStatus && setupIntentParam && setupIntentClientSecret
		},
		{
			cleanState() {
				searchParams.delete('redirect_status');
				searchParams.delete('setup_intent');
				searchParams.delete('setup_intent_client_secret');

				setSearchParams(searchParams.toString());
			}
		}
	];
}

export async function confirmPayment(
	stripeModule,
	{ type, clientSecret, stripePaymentMethodId }
) {
	let confirmResponse = {
		error: null,
		paymentIntent: null
	};

	if (type === PAYMENT_METHOD_TYPE.CARD) {
		confirmResponse = await stripeModule.confirmCardPayment(clientSecret, {
			payment_method: stripePaymentMethodId
		});
	} else if (type === PAYMENT_METHOD_TYPE.SEPA_DEBIT) {
		confirmResponse = await stripeModule.confirmSepaDebitPayment(
			clientSecret,
			{
				payment_method: stripePaymentMethodId
			}
		);
	} else if (type === PAYMENT_METHOD_TYPE.PAYPAL) {
		confirmResponse = await stripeModule.confirmPayPalPayment(clientSecret, {
			return_url: new URL(routes.myImages, window.location.href).href
		});
	}

	const { error } = confirmResponse;

	if (error) {
		throw error;
	}
}

export async function waitForResourceCondition(
	fetchFn,
	compareFn,
	retries = 4,
	delayTime = 2000
) {
	try {
		const response = await fetchFn();

		if (!compareFn(response) && retries > 0) {
			await delay(delayTime);

			return waitForResourceCondition(
				fetchFn,
				compareFn,
				retries - 1,
				delayTime
			);
		}

		return response;
	} catch (error) {
		if (retries > 0) {
			await delay(delayTime);

			return waitForResourceCondition(
				fetchFn,
				compareFn,
				retries - 1,
				delayTime
			);
		}
		throw error;
	}
}
