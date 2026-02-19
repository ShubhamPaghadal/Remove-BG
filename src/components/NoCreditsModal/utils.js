export const NO_CREDITS_ERROR_EVENT = 'noCreditsError';

export function showNoCredits(data = {}) {
	const event = new CustomEvent(NO_CREDITS_ERROR_EVENT, {
		detail: {
			...data
		}
	});

	window.dispatchEvent(event);
}
