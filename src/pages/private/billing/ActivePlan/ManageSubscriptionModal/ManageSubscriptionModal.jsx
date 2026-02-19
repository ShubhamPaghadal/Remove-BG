import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';

import { Dialog, dialogClasses } from '@/components/Dialog';
import { RadioGroupList } from '@/components/RadioGroupList';
import { CurrencySelector } from '@/components/CurrencySelector';
import { CurrencyIcon } from '@/components/Icons/CurrencyIcon';
import { PLAN_TYPE } from '@/const/plans';
import { fetchPayments, fetchPrices } from '@/store/billing/thunks';
import { fetchBillingInfo } from '@/store/auth/thunks';
import { Button } from '@/components/Button';
import { useShowCurrencySelector } from '@/hooks';
import { usePlanOptions } from '@/hooks/price';
import { redirectToCheckout, showError, showSuccess } from '@/utils';
import stripeModel, {
	PAYMENT_INTENT_STATUS,
	SUBSCRIPTION_STATUS
} from '@/models/stripe';
import { CurrentPlan } from './CurrentPlan';

export function ManageSubscriptionModal({ subscriptionInfo, open, onClose }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [saveLoading, setSaveLoading] = useState(false);
	const { loading, data: prices } = useSelector(
		state => state.billing.fetchPrices
	);
	const currency = useSelector(state => state.auth.currency);
	const showCurrencySelector = useShowCurrencySelector();
	const [selected, setSelected] = useState(null);

	const isTrial = subscriptionInfo?.status === SUBSCRIPTION_STATUS.TRIALLING;

	const plans = useMemo(() => {
		if (!prices?.length) {
			return [];
		}
		return prices.filter(
			price =>
				price.active &&
				(price.name !== PLAN_TYPE.TRIAL ||
					(!subscriptionInfo.hasBeenSubscribedBefore && !isTrial)) &&
				(price.id !== subscriptionInfo.stripePriceId ||
					!subscriptionInfo.subscribed ||
					isTrial) &&
				![PLAN_TYPE.SERVICE, PLAN_TYPE.STORAGE].includes(price.name)
		);
	}, [prices]);
	const planOptions = usePlanOptions(plans, { withPeriod: true });
	const currentPlan = useMemo(() => {
		if (!prices?.length) {
			return null;
		}

		return prices.find(price => {
			if (isTrial) {
				return price.name === 'trial' && price.active;
			}

			return price.id === subscriptionInfo.stripePriceId;
		});
	}, [prices]);

	useEffect(() => {
		if (!open) {
			return;
		}
		(async () => {
			try {
				await dispatch(fetchPrices({ currency })).unwrap();
			} catch (err) {
				showError(err);
			}
		})();
	}, [open, prices?.length, currency]);

	async function handleChangePlan() {
		try {
			setSaveLoading(true);
			const nextAction = await stripeModel.getNextAction(selected);
			if (nextAction === 'subscribe') {
				return redirectToCheckout({ priceId: selected });
			}
			const { paymentIntentStatus, paymentIntentClientSecret } =
				await stripeModel.switchSubscription(selected);

			if (
				[
					PAYMENT_INTENT_STATUS.REQUIRES_ACTION,
					PAYMENT_INTENT_STATUS.REQUIRES_CONFIRMATION,
					PAYMENT_INTENT_STATUS.REQUIRES_PAYMENT_METHOD
				].includes(paymentIntentStatus)
			) {
				return redirectToCheckout({
					priceId: selected,
					clientSecret: paymentIntentClientSecret
				});
			}

			const [billingInfo] = await Promise.all([
				dispatch(fetchBillingInfo()).unwrap(),
				dispatch(fetchPayments()).unwrap()
			]);
			const { status } = billingInfo.subscriptionInfo;

			if (status === SUBSCRIPTION_STATUS.ACTIVE) {
				showSuccess(t('billing.switchSubscriptionSuccess'));
			}
			onClose();
		} catch (error) {
			showError(error);
		} finally {
			setSaveLoading(false);
		}
	}

	return (
		<Dialog
			open={open}
			sx={{
				[`.${dialogClasses.paper}`]: {
					width: '100%',
					py: { xs: 2.5, sm: 3.5 },
					px: { xs: 2, sm: 3.5 }
				}
			}}
			maxWidth="sm"
			onClose={onClose}
		>
			<Box
				sx={theme => ({
					display: 'flex',
					alignItems: 'center',
					gap: 3,
					[theme.breakpoints.down('sm')]: {
						gap: 1.5,
						flexDirection: 'column',
						alignItems: 'flex-start'
					}
				})}
			>
				<Typography
					fontWeight="bold"
					sx={{
						fontSize: { xs: 16, sm: 20 }
					}}
				>
					{subscriptionInfo.subscribed
						? t('billing.changePlan')
						: t('billing.manageSubscription')}
				</Typography>

				<CurrencySelector
					disabled={!showCurrencySelector}
					sx={{
						'.MuiSelect-select.MuiSelect-select': {
							py: 1
						}
					}}
					renderValue={value => (
						<Box display="flex" alignItems="center" gap="4px">
							<CurrencyIcon />
							{!value && t('common.currency')}
							{value && value.toUpperCase()}
						</Box>
					)}
				/>
			</Box>
			<Box>
				{loading && !prices?.length ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							pt: 5,
							minHeight: 140
						}}
					>
						<CircularProgress size={50} />
					</Box>
				) : (
					<Box>
						{subscriptionInfo.subscribed && currentPlan && (
							<CurrentPlan currentPlan={currentPlan} />
						)}
						<Box sx={{ px: { sm: 3 }, mt: 3 }}>
							<RadioGroupList
								size="small"
								name="plan"
								value={selected}
								onChange={event => setSelected(event.target.value)}
								showSeeMore={false}
								options={planOptions}
							/>
						</Box>
					</Box>
				)}
				<Box
					sx={{
						display: 'flex',
						gap: 2,
						justifyContent: 'space-between',
						pt: 2,
						mt: 3,
						borderTop: 1,
						borderColor: 'divider',
						'.MuiButton-root': {
							minWidth: { xs: 92, sm: 147 }
						}
					}}
				>
					<Button variant="outlined" onClick={onClose}>
						{t('common.cancel')}
					</Button>
					<Button
						loading={saveLoading}
						variant="contained"
						disabled={!selected}
						onClick={handleChangePlan}
					>
						{subscriptionInfo.subscribed
							? t('common.save')
							: t('common.subscribe')}
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
}
