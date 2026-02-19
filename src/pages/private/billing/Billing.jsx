import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	Stack,
	Typography,
	cardHeaderClasses
} from '@mui/material';
import { Faq } from '@/pages/public/pricing/Faq';
import { useShallowSelector, useSubscribed } from '@/hooks';
import { Button } from '@/components/Button';
import stripeModel from '@/models/stripe';
import { showError } from '@/utils';
import routes from '@/routes';
import { fetchBillingInfo } from '@/store/auth/thunks';
import { clearData } from '@/store/billing';
import { TABS } from '../my-account/constants';
import { BillingHistory } from './BillingHistory';
import { ActivePlan } from './ActivePlan';
import { PaymentMethod } from './paymentMethod';
import { Plans } from './plan';
import { useUserPermissions } from '../hooks/hooks';
import { UpdatePaymentMethod } from './UpdatePaymentMethod';
import { VIEWS_PERMISSIONS } from '../users/constants';

export function Billing() {
	const { t } = useTranslation();
	const [prices, setPrices] = useState([]);
	const dispatch = useDispatch();
	const [fetching, setFetching] = useState(true);
	const isSubscribed = useSubscribed();
	const { redirectIfNoPermissions } = useUserPermissions();
	const { subscriptionInfo, paymentInfo, country } = useShallowSelector(
		state => ({
			subscriptionInfo: state.auth.subscriptionInfo,
			paymentInfo: state.auth.paymentInfo,
			country: state.auth.user.taxInformation?.country
		})
	);

	const updatePaymentMethodRender = (
		<UpdatePaymentMethod
			prices={prices}
			paymentInfo={paymentInfo}
			subscriptionInfo={subscriptionInfo}
		/>
	);

	const top = (
		<Stack direction="row" alignItems="center" justifyContent="space-between">
			<Typography variant="h1" sx={{ fontSize: { xs: 28, sm: 48 } }}>
				{t('pageTitles.billing')}
			</Typography>

			<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
				{subscriptionInfo.hasPayment && (
					<Button
						variant="outlined"
						component={Link}
						to={routes.myAccount}
						state={{ tab: TABS.TAX_INFORMATION }}
					>
						{t('myAccount.taxInformation.title')}
					</Button>
				)}
			</Box>
		</Stack>
	);

	useEffect(() => {
		(async () => {
			try {
				setFetching(true);
				await dispatch(fetchBillingInfo()).unwrap();
			} catch (error) {
				showError(error);
			}
			setFetching(false);
		})();

		return () => {
			dispatch(clearData());
		};
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const { prices: response } = await stripeModel.getPrices({
					country
				});

				const parsedPrices = response.filter(
					item => item.name !== 'service'
				);

				setPrices(parsedPrices);
			} catch (error) {
				showError(error);
			}
		})();
	}, []);

	useEffect(() => {
		redirectIfNoPermissions(VIEWS_PERMISSIONS[1]);
	}, []);

	if (fetching || !subscriptionInfo.hasPayment) {
		return (
			<Box>
				{top}
				{updatePaymentMethodRender}
				{fetching && (
					<Box textAlign="center">
						<CircularProgress size={50} sx={{ mt: 4 }} />
					</Box>
				)}
				{!fetching && <Plans />}
			</Box>
		);
	}

	return (
		<Box>
			{top}

			{updatePaymentMethodRender}

			<Stack
				spacing={{ xs: 1, sm: 4 }}
				direction={{ xs: 'column', sm: 'row' }}
				mt={3}
				sx={{
					[`.${cardHeaderClasses.title}`]: {
						fontSize: {
							xs: 14,
							sm: 16
						}
					}
				}}
				useFlexGap
			>
				<Box sx={{ display: { xs: 'block', sm: 'none' } }}>
					<Card sx={{ flex: 1 }}>
						<CardHeader title={t('myAccount.taxInformation.title')} />
						<CardContent
							sx={{
								pt: 0
							}}
						>
							<Button
								variant="outlined"
								component={Link}
								to={routes.myAccount}
								state={{ tab: TABS.TAX_INFORMATION }}
							>
								{t('common.edit')}
							</Button>
						</CardContent>
					</Card>
				</Box>
				<ActivePlan
					subscriptionInfo={subscriptionInfo}
					paymentInfo={paymentInfo}
				/>

				<PaymentMethod
					subscriptionInfo={subscriptionInfo}
					paymentInfo={paymentInfo}
				/>
			</Stack>

			<BillingHistory mt={{ xs: 4, sm: 5 }} mb={{ xs: 6, sm: 8 }} />
			{!isSubscribed && <Faq />}
		</Box>
	);
}
