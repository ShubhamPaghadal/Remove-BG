import BaseModel from './base';

/**
 * Payment intent's status
 * See: https://stripe.com/docs/payments/intents#intent-statuses
 */
export const PAYMENT_INTENT_STATUS = {
	SUCCEEDED: 'succeeded',
	REQUIRES_ACTION: 'requires_action',
	REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
	REQUIRES_CONFIRMATION: 'requires_confirmation',
	PROCESSING: 'processing',
	CANCELED: 'canceled'
};

/**
 * Invoice statuses, visit https://stripe.com/docs/invoicing/overview#invoice-statuses to see how they work.
 */
export const INVOICE_STATUS = {
	DRAFT: 'draft',
	OPEN: 'open',
	PAID: 'paid',
	VOID: 'void',
	UNCOLLECTIBLE: 'uncollectible'
};

/**
 * Custom api err types.
 */
export const CUSTOM_API_ERR_TYPES = {
	STRIPE_CARD_ERROR: 'STRIPE_CARD_ERROR'
};

/**
 * Stripe's subscription statuses.
 * See: https://stripe.com/docs/api/subscriptions/object#subscription_object-status
 */
export const SUBSCRIPTION_STATUS = {
	INCOMPLETE: 'incomplete',
	INCOMPLETE_EXPIRED: 'incomplete_expired',
	ACTIVE: 'active',
	PAST_DUE: 'past_due',
	CANCELED: 'canceled',
	UNPAID: 'unpaid',
	TRIALLING: 'trialing' // 'trialing' is how is in stripe.
};

export const PAYMENT_METHOD_TYPE = {
	SEPA_DEBIT: 'sepa_debit',
	CARD: 'card',
	SOFORT: 'sofort',
	PAYPAL: 'paypal'
};

export const USER_COUNTRY_HEADER_KEY = 'x-user-country';

class Stripe extends BaseModel {
	/**
	 * Make a payment
	 * @param {object} data
	 * @param {string} data.priceId - Stripe's price id.
	 */
	subscribe({ priceId, currency }) {
		return this.post('/subscribe', {
			body: {
				priceId,
				currency
			}
		});
	}

	/**
	 * Get all application prices.
	 */
	async getPrices({ country, currency, filterActive = false } = {}) {
		const queryParams = new URLSearchParams();
		if (country) {
			queryParams.append('country', country);
		}
		if (currency) {
			queryParams.append('currency', currency);
		}

		const response = await this.get(`/prices?${queryParams.toString()}`, {
			completeResponse: true
		});
		const prices = await response.json();

		const { headers = {} } = response || {};

		if (!filterActive) {
			return { prices, headers };
		}

		return { prices: prices.filter(price => price.active), headers };
	}

	/**
	 * Cancel subscription at the end of current period.
	 * @param {boolean} value
	 */
	cancelSubscription(value) {
		return this.patch('/subscription/cancel', {
			body: {
				value
			}
		});
	}

	/**
	 * Unsubscribe from a plan.
	 * @param {email: string, cfChallengeToken: string, cfIdempotencyKey: string} body
	 */
	unsubscribe(body) {
		return this.post('/subscription/cancel-by-email', {
			body: {
				...body
			}
		});
	}

	/**
	 * Preview a proration.
	 * @param {string} priceId
	 * @returns {Promise<'subscribe' | 'switch'>}
	 */
	async getNextAction(priceId) {
		const data = await this.get(
			`/subscription/next-action?priceId=${priceId}`
		);

		return data.nextAction;
	}

	/**
	 * Creates a new setup intent
	 */
	createSetupIntent(planName) {
		const planQuery = planName ? `?plan=${planName}` : '';

		return this.get(`/setup-intent${planQuery}`);
	}

	/**
	 * Get new payment method.
	 * @param {string} stripePaymentMethodId
	 * @returns {Promise<object>}
	 */
	getNewPaymentMethod(stripePaymentMethodId) {
		return this.get(`/new-payment-method/${stripePaymentMethodId}`);
	}

	/**
	 * Get payment method details saved in database.
	 */
	getPaymentMethodDetails() {
		return this.get('/payment-method');
	}

	/**
	 * Remove user payment method
	 */
	removePaymentMethod() {
		return this.delete('/payment-method');
	}

	/**
	 * Get currencies list
	 * */
	getCurrencies() {
		return this.get('/currencies');
	}

	switchSubscription(priceId) {
		return this.patch('/subscription/switch', {
			body: {
				priceId
			}
		});
	}

	addServiceSubscription(types = []) {
		return this.post('/service-charge', {
			body: { types }
		});
	}
}

export default new Stripe('/stripe');
