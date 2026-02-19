import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Box, CardContent, CardHeader, cardHeaderClasses } from '@mui/material';
import routes from '@/routes';

import { useShallowSelector } from '@/hooks';
import { TooltipMobileFriendly } from '@/components/Tooltip';
import { INVOICE_STATUS } from '@/models/stripe';
import { StatusChip } from './StatusChip';
import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import { ReactivateSubscriptionModal } from './ReactivateSubscriptionModal';
import Description from './Description';
import { ManageSubscriptionModal } from './ManageSubscriptionModal';

import { useUserPermissions } from '../../hooks/hooks';

const tooltipi18nPath = 'billing.activePlan.tooltip';

export function ActivePlan({ subscriptionInfo, paymentInfo }) {
	const location = useLocation();
	const { t } = useTranslation();
	const { getIsAdminOrOwner } = useUserPermissions();

	const [cancelSubscriptionModalOpen, setCancelSubscriptionModalOpen] =
		useState(false);
	const [reactivateSubscriptionModalOpen, setReactivateSubscriptionModalOpen] =
		useState(false);
	const [manageSubscriptionOpen, setManageSubscriptionOpen] = useState(
		() => location.state?.subscriptionModal || false
	);

	const {
		fetchPayments: { data: paymentsData }
	} = useShallowSelector(state => ({
		fetchPayments: state.billing.fetchPayments,
		page: state.billing.page
	}));

	const { payments = [] } = paymentsData || {};
	const isLastPaymentDraft =
		payments[0]?.stripeInvoiceStatus === INVOICE_STATUS.DRAFT;

	const isAdminOrOwner = getIsAdminOrOwner();

	return (
		<>
			<ManageSubscriptionModal
				subscriptionInfo={subscriptionInfo}
				open={manageSubscriptionOpen}
				onClose={() => setManageSubscriptionOpen(false)}
			/>
			<CancelSubscriptionModal
				open={cancelSubscriptionModalOpen}
				onClose={() => setCancelSubscriptionModalOpen(false)}
			/>
			<ReactivateSubscriptionModal
				open={reactivateSubscriptionModalOpen}
				onClose={() => setReactivateSubscriptionModalOpen(false)}
			/>
			<Card sx={{ flex: 1 }}>
				<CardHeader
					title={t('common.subscription')}
					action={<StatusChip {...subscriptionInfo} />}
					subheader={<Description subscriptionInfo={subscriptionInfo} />}
					sx={{
						[`.${cardHeaderClasses.subheader}`]: {
							mt: '12px'
						},
						[`.${cardHeaderClasses.action}`]: {
							m: 0,
							mr: { sm: 0.5 }
						}
					}}
				/>
				<CardContent sx={{ pt: 1 }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', sm: 'row' },
							justifyContent: 'space-between',
							gap: 1.5
						}}
					>
						{isAdminOrOwner &&
							subscriptionInfo.subscribed &&
							(subscriptionInfo.willCancel ? (
								<Button
									variant="outlined"
									onClick={() => {
										if (paymentInfo.stripePaymentMethodType) {
											setReactivateSubscriptionModalOpen(true);
										} else {
											window.location.href = `${routes.paymentMethod}?reactivate=true`;
										}
									}}
									sx={{ width: ['fit-content'] }}
								>
									{t('billing.subscription.reactivate')}
								</Button>
							) : (
								<>
									<Button
										variant="outlined"
										onClick={() =>
											setCancelSubscriptionModalOpen(true)
										}
										sx={{ width: ['fit-content'] }}
									>
										{t('billing.subscription.cancel')}
									</Button>
									<TooltipMobileFriendly
										disableTooltip={!isLastPaymentDraft}
										tooltipi18nPath={tooltipi18nPath}
									>
										<Button
											disabled={isLastPaymentDraft}
											variant="outlined"
											onClick={() => setManageSubscriptionOpen(true)}
											sx={{ width: ['fit-content'] }}
										>
											{t('billing.changePlan')}
										</Button>
									</TooltipMobileFriendly>
								</>
							))}
						{isAdminOrOwner && !subscriptionInfo.subscribed && (
							<Button
								variant="outlined"
								onClick={() => setManageSubscriptionOpen(true)}
							>
								{t('billing.manageSubscription')}
							</Button>
						)}
					</Box>
				</CardContent>
			</Card>
		</>
	);
}
