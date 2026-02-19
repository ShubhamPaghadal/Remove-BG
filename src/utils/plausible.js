export const PLAUSIBLE_EVENTS = {
	upload: 'Upload',
	clickSD: 'ClickSD',
	clickHD: 'ClickHD',
	plan: 'CheckoutPlan',
	billing: 'CheckoutBilling',
	checkout: 'Checkout',
	download: 'Download'
};

export function sendPlausible(eventName) {
	if (!window.plausible) {
		// eslint-disable-next-line no-console
		console.warn('Plausible script should be added.');
		return;
	}

	window.plausible(eventName);
}
