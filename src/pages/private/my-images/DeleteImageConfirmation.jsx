import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import transactionModel from '@/models/transaction';
import { showError } from '@/utils';

export function DeleteImageConfirmation({ onClose, id, onDelete, ...props }) {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);

	async function handleConfirm() {
		try {
			setLoading(true);
			await transactionModel.deleteTransaction(id);
			onDelete();
			onClose();
		} catch (err) {
			showError(err);
		}
		setLoading(false);
	}

	return (
		<ConfirmationModal
			loading={loading}
			text={t('myImages.deleteConfirmationMessage')}
			confirmText={t('common.delete')}
			onConfirm={handleConfirm}
			onClose={onClose}
			{...props}
		/>
	);
}
