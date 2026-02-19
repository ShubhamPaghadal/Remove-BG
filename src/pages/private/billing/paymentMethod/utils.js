import { PAYMENT_METHOD_TYPE } from '@/models/stripe';

export function getPaymentMethodLabel({
	stripePaymentMethodType,
	stripePaymentMethodLast4
}) {
	if (stripePaymentMethodType === PAYMENT_METHOD_TYPE.CARD) {
		return `**** **** **** ${stripePaymentMethodLast4}`;
	}

	if (stripePaymentMethodType === PAYMENT_METHOD_TYPE.PAYPAL) {
		return 'PayPal';
	}

	return '';
}
