import { showNoCredits } from '@/components/NoCreditsModal/utils';
import { SENTRY_ENABLED } from '@/config';

export function sendErrorToSentry(error) {
	if (!SENTRY_ENABLED) {
		return;
	}

	import('@/utils/sentry')
		.then(({ initSentry }) => {
			const Sentry = initSentry();
			Sentry.captureException(error);
		})
		// eslint-disable-next-line no-console
		.catch(console.error);
}

export function showError(error, options) {
	let message = '';
	let messageKey = '';

	if (typeof error === 'string') {
		message = error;
	}

	if (error?.status === 403) {
		messageKey = 'errors.forbidden';
	}

	if (options?.variant === 'no-credits-modal') {
		return showNoCredits({ ...options });
	}

	if (options?.error?.status === 402 || error?.status === 402) {
		return showNoCredits();
	}

	if (
		options?.report ||
		(error?.status !== 401 &&
			!message &&
			!messageKey &&
			!options?.message &&
			!options?.messageKey)
	) {
		sendErrorToSentry(error);
	}

	const event = new CustomEvent('showSnackbar', {
		detail: {
			message,
			messageKey: message ? '' : messageKey || 'errors.generic',
			uuid: error?.data?.uuid,
			errorCode: error?.data?.errorCode,
			severity: 'error',
			...options
		}
	});

	window.dispatchEvent(event);
}

export function showSuccess(message, options) {
	const event = new CustomEvent('showSnackbar', {
		detail: {
			message,
			severity: 'success',
			...options
		}
	});

	window.dispatchEvent(event);
}
