import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';
import { DeleteIcon } from '@/components/Icons';
import {
	CardContent,
	CardHeader,
	Stack,
	cardHeaderClasses
} from '@mui/material';
import routes from '@/routes';
import { AlertDeletePaymentMethodModal } from './AlertDeletePaymentMethod';
import { DeletePaymentMethodConfirmation } from './DeletePaymentMethodConfirmation';
import { getPaymentMethodLabel } from './utils';
import { useUserPermissions } from '../../hooks/hooks';

export function PaymentMethod({ paymentInfo, subscriptionInfo }) {
	const { t } = useTranslation();
	const [alertDeletePaymentOpen, setAlertDeletePaymentOpen] = useState(false);
	const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
	const { getIsAdminOrOwner } = useUserPermissions();

	function handleDeletePaymentMethod() {
		if (subscriptionInfo.isActive && !subscriptionInfo.willCancel) {
			setAlertDeletePaymentOpen(true);
		} else {
			setDeleteConfirmationOpen(true);
		}
	}

	const showPaymentMethodActions = getIsAdminOrOwner();

	return (
		<>
			<AlertDeletePaymentMethodModal
				open={alertDeletePaymentOpen}
				onClose={() => setAlertDeletePaymentOpen(false)}
			/>
			<DeletePaymentMethodConfirmation
				open={deleteConfirmationOpen}
				onClose={() => setDeleteConfirmationOpen(false)}
			/>
			<Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
				<CardHeader
					title={t('common.paymentMethod')}
					subheader={getPaymentMethodLabel(paymentInfo)}
					sx={{
						[`.${cardHeaderClasses.subheader}`]: {
							mt: '12px'
						}
					}}
				/>
				{showPaymentMethodActions && (
					<CardContent sx={{ mt: 'auto' }}>
						<Stack
							direction="row"
							justifyContent="end"
							spacing={1}
							useFlexGap
						>
							{paymentInfo.stripePaymentMethodType && (
								<IconButton
									variant="outlined"
									onClick={handleDeletePaymentMethod}
								>
									<DeleteIcon />
								</IconButton>
							)}
							<Button
								variant="outlined"
								onClick={() => {
									const qs = new URLSearchParams();
									if (paymentInfo.stripePaymentMethodType) {
										qs.set('update', 'true');
									}
									window.location.href = `${routes.paymentMethod}?${qs}`;
								}}
							>
								{paymentInfo.stripePaymentMethodType
									? t('common.update')
									: t('common.add')}
							</Button>
						</Stack>
					</CardContent>
				)}
			</Card>
		</>
	);
}
