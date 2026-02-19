import { useState } from 'react';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { InfoIcon } from '@/components/Icons/InfoIcon';
import { TooltipMobileFriendly } from '@/components/Tooltip';
import { useAuthMe } from '@/store/auth/selectors';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Section } from './Section';

const i18nPath = 'myAccount.deleteAccount';

function DeleteAccount() {
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
		useState(false);
	const { t } = useTranslation();
	const authMe = useSelector(useAuthMe);

	const handleDeleteClick = () => {
		setIsConfirmationModalOpen(true);
	};

	const canDeleteAccount = authMe?.data?.canDeleteAccount;

	return (
		<Section
			title={t(`${i18nPath}.title`)}
			titleSuffix={
				!canDeleteAccount && (
					<TooltipMobileFriendly
						isIcon
						tooltipi18nPath={`${i18nPath}.tooltip`}
					>
						<InfoIcon
							sx={{
								width: '16px',
								height: '16px',
								mb: {
									xs: 3,
									md: 1
								},
								ml: 1
							}}
						/>
					</TooltipMobileFriendly>
				)
			}
			subtitle={t(`${i18nPath}.subtitle`)}
			action={
				<Button
					color="error"
					disabled={!canDeleteAccount}
					onClick={handleDeleteClick}
					variant="contained"
				>
					{t(`${i18nPath}.button`)}
				</Button>
			}
		>
			<DeleteConfirmationModal
				onClose={() => setIsConfirmationModalOpen(false)}
				open={isConfirmationModalOpen}
			/>
		</Section>
	);
}

export default DeleteAccount;
