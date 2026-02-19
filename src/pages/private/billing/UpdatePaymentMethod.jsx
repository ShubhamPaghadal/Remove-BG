import { lazy, useEffect, Suspense } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	dialogClasses
} from '@/components/Dialog';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showError } from '@/utils';
import { Box, CircularProgress } from '@mui/material';
import { useMatch, useSearchParams } from 'react-router-dom';
import routes from '@/routes';
import stripeModel from '@/models/stripe';

const PaymentElement = lazy(() => import('@/components/PaymentElement'));

export function UpdatePaymentMethod({
	title,
	userPlan,
	prices,
	paymentInfo,
	subscriptionInfo,
	...props
}) {
	const [searchParams] = useSearchParams();
	const update = !!searchParams.get('update');
	const reactivate = !!searchParams.get('reactivate');
	const { t } = useTranslation();
	const isPaymentMethodRoute = !!useMatch(routes.paymentMethod);
	const ready = useSelector(state => state.auth.billingInfoReady);

	const loadingRender = (
		<Box
			sx={{
				minHeight: 130,
				display: 'flex',
				justifyContent: 'center',
				pt: 3
			}}
		>
			<CircularProgress />
		</Box>
	);

	function handleClose() {
		window.location.href = routes.billing;
	}

	async function handleSavedPaymentMethod() {
		if (!reactivate || !subscriptionInfo.willCancel) {
			handleClose();
			return;
		}

		try {
			await stripeModel.cancelSubscription(false);
			handleClose();
		} catch (error) {
			showError(error);
		}
	}

	useEffect(() => {
		if (ready && isPaymentMethodRoute && !subscriptionInfo.hasPayment) {
			window.location.href = routes.billing;
		}
	}, [ready, isPaymentMethodRoute]);

	if (!isPaymentMethodRoute) {
		return null;
	}

	return (
		<Dialog
			open
			onClose={handleClose}
			sx={{
				[`.${dialogClasses.paper}`]: {
					width: '100%',
					pt: 3,
					pb: 2
				}
			}}
			maxWidth="xs"
			{...props}
		>
			<DialogTitle>
				{update
					? t('billing.updatePaymentMethod')
					: t('billing.addPaymentMethod')}
			</DialogTitle>
			<DialogContent>
				{!ready && loadingRender}
				{ready && (
					<Suspense fallback={loadingRender}>
						<PaymentElement
							onSavedPaymentMethod={handleSavedPaymentMethod}
							onSetupErr={showError}
							isUpdate
							userPlan={prices.find(
								price => price.id === paymentInfo.stripePriceId
							)}
						/>
					</Suspense>
				)}
			</DialogContent>
		</Dialog>
	);
}
