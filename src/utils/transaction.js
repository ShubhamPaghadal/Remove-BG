import routes from '@/routes';

export const DEFAULT_MAX_MB = 20;
export const DEFAULT_MAX_IN_BYTES = DEFAULT_MAX_MB * 1024 * 1024;

export function getLongTextParams(data = {}) {
	return [
		data.error,
		{
			variant: 'long-text',
			...data
		}
	];
}

export function getErrorParams(error, t, navigateFn) {
	const status = error?.status || error?.statusCode;
	const { errorCode, code, maxSize: maxSizeBytes } = error?.data || {};
	const maxSize = maxSizeBytes ? maxSizeBytes / (1024 * 1024) : DEFAULT_MAX_MB;

	const parsedCode = errorCode || code;

	switch (status) {
		case 400:
			if (parsedCode === 'dimensions_exceeded') {
				return getLongTextParams({
					error,
					message: t('errors.imageDimensionsExceeded')
				});
			}

			return getLongTextParams({
				error,
				message: t('errors.imageInvalid')
			});
		case 403:
			if (parsedCode === 'no_credits_available') {
				return getLongTextParams({
					error,
					messageTitle: t('errors.noCreditsAvailable'),
					message: t('errors.noCreditsAvailableText'),
					action: navigateFn
						? {
								children: t('common.buyCredits'),
								onClick: () =>
									navigateFn(routes.billing, {
										state: { subscriptionModal: true }
									}),
								closeAfterClick: true
							}
						: null
				});
			}

			return getLongTextParams({
				error,
				message: t('errors.forbidden')
			});
		case 413:
			return getLongTextParams({
				error,
				messageTitle: t('errors.imageTooLarge'),
				message: t('errors.imageTooLargeText', { maxSize })
			});
		case 415:
			return getLongTextParams({
				error,
				messageTitle: t('errors.imageExtension'),
				message: t('errors.imageExtensionText')
			});
		case 429:
			return [
				error,
				{
					error,
					variant: 'no-credits-modal',
					description: t('errors.tooManyRequests')
				}
			];
		default:
			return getLongTextParams({
				messageTitle: t('errors.image'),
				message: t('errors.imageText'),
				report: true,
				error
			});
	}
}
