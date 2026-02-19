import { useTranslation } from 'react-i18next';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { dialogContentClasses } from '@mui/material';

export function UnsavedChangesModal(props) {
	const { t } = useTranslation();

	return (
		<ConfirmationModal
			closeText={t('common.close')}
			confirmText={t('editor.unsavedChanges.confirm')}
			sx={{
				[` .${dialogContentClasses.root} > p`]: {
					fontWeight: 400,
					textAlign: 'left'
				}
			}}
			text={t('editor.unsavedChanges.description')}
			title={t('editor.unsavedChanges.title')}
			{...props}
		/>
	);
}
