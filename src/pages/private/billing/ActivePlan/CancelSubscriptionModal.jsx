import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { fetchBillingInfo } from '@/store/auth/thunks';
import stripeModel from '@/models/stripe';
import { showError } from '@/utils';

export function CancelSubscriptionModal({ onClose, ...props }) {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	async function handleConfirm() {
		try {
			setLoading(true);
			await stripeModel.cancelSubscription(true);
			await dispatch(fetchBillingInfo()).unwrap();

			onClose();
		} catch (err) {
			showError(err);
		}
		setLoading(false);
	}

	return (
		<ConfirmationModal
			loading={loading}
			text={t('billing.subscription.cancelConfirmation')}
			closeText={t('common.close')}
			confirmText={t('billing.yesCancel')}
			onConfirm={handleConfirm}
			onClose={onClose}
			{...props}
		/>
	);
}
