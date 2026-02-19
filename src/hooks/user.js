import { useSelector } from 'react-redux';
import { SUBSCRIPTION_STATUS, PAYMENT_METHOD_TYPE } from '@/models/stripe';
import schemas from '@/validations';
import { useShallowSelector } from './redux';

/**
 * Use this hook to know user current payment method details.
 */
export function usePaymentMethod() {
	const {
		stripePaymentMethodLast4,
		stripePaymentMethodBrand,
		stripePaymentMethodSepaDebitLast4,
		stripePaymentMethodType,
		stripePaymentMethodSepaDebitBankCode,
		stripePaymentMethodSepaDebitBranchCode,
		stripePaymentMethodSepaDebitCountry,
		stripePaymentMethodId
	} = useSelector(state => state.auth?.paymentInfo) || {};

	const hasPaymentMethodMap = {
		[PAYMENT_METHOD_TYPE.SEPA_DEBIT]: !!stripePaymentMethodSepaDebitLast4,
		[PAYMENT_METHOD_TYPE.CARD]: !!stripePaymentMethodLast4,
		[PAYMENT_METHOD_TYPE.PAYPAL]: true,
		default: !!stripePaymentMethodSepaDebitLast4 // Edge case
	};

	return {
		hasPaymentMethod:
			hasPaymentMethodMap[stripePaymentMethodType] ||
			hasPaymentMethodMap.default,
		info: {
			stripePaymentMethodLast4,
			stripePaymentMethodBrand,
			stripePaymentMethodSepaDebitLast4,
			stripePaymentMethodSepaDebitBankCode,
			stripePaymentMethodSepaDebitBranchCode,
			stripePaymentMethodSepaDebitCountry,
			stripePaymentMethodType,
			stripePaymentMethodId
		}
	};
}

/**
 * Use this hook to interact with billing data logic.
 */
export function useTaxInformation() {
	const data =
		useShallowSelector(state => ({
			email: state.auth?.user?.email,
			...state.auth?.user?.taxInformation
		})) || {};

	return {
		hasContent: Object.keys(data).length > 1,
		isValid: schemas.taxInformation({ sync: true }).isValidSync(data),
		data
	};
}

export function useShowCurrencySelector() {
	const subscriptionStatus = useSelector(
		state => state.auth.user?.subscriptionStatus
	);

	return (
		!subscriptionStatus ||
		[
			SUBSCRIPTION_STATUS.CANCELED,
			SUBSCRIPTION_STATUS.TRIALLING,
			SUBSCRIPTION_STATUS.TRIAL_ENDED
		].includes(subscriptionStatus)
	);
}

export function useSubscribed() {
	const subscriptionStatus = useSelector(
		state => state.auth.user?.subscriptionStatus
	);

	return (
		subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE ||
		subscriptionStatus === SUBSCRIPTION_STATUS.TRIALLING
	);
}

export function useHasStorageCharge() {
	return useSelector(state => state.auth?.user?.hasStorageServiceCharge);
}

export function useIsTrialing() {
	const subscriptionStatus = useSelector(
		state => state.auth.user?.subscriptionStatus
	);

	return subscriptionStatus === SUBSCRIPTION_STATUS.TRIALLING;
}

export function useTrialDiscount() {
	return useSelector(state => state.auth?.user?.trialDiscount);
}

export function useUser() {
	const user = useSelector(state => state.auth.user);

	return user;
}
