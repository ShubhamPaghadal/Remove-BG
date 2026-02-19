import { useTranslation } from 'react-i18next';

export function useGetPaymentReference() {
	const { t } = useTranslation();

	function getPaymentReference(data) {
		if (data.trial) {
			return t('billing.subscription.references.trial');
		}

		if (data.service) {
			return t('billing.subscription.references.service');
		}

		if (data.storage) {
			return t('billing.subscription.references.storage');
		}

		return t('billing.subscription.references.generic');
	}

	return getPaymentReference;
}
