import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { usePlans } from '@/hooks/price';
import routes from '@/routes';
import { setIsPaymentBreakdownModalOpen } from '@/store/checkout';
import { formatPrice } from '@/utils/money';
import stripeModel from '@/models/stripe';

import {
	Box,
	CircularProgress,
	dialogClasses,
	Drawer,
	Stack,
	Typography
} from '@mui/material';
import { useMedia } from '@/hooks/responsive';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { STORAGE_DAYS } from '@/config';
import { PLAN_TYPE } from '@/const/plans';
import { getCookie, invalidateCookie, showError } from '@/utils';
import { Switch } from '@/components/Switch';
import { useSubscribed } from '@/hooks';
import { useTrialDiscount } from '@/hooks/user';

import DetailCard from './DetailCard';
import { PAYMENT_BREAKDOWN_KEY } from './constants';
import Chip from './Chip';

function PaymentBreakdownModal() {
	const open = useSelector(
		state => state.checkout.isPaymentBreakdownModalOpen
	);

	const [addService, setAddService] = useState(true);
	const [addStorage, setAddStorage] = useState(true);
	const [serviceLoading, setServiceLoading] = useState(false);

	const isSubscribed = useSubscribed();

	const loggedIn = useSelector(state => state.auth.loggedIn);
	const trialDiscount = useTrialDiscount();
	const { trialPlan, servicePlan, storagePlan } = usePlans();

	const smDown = useMedia('smDown');

	const dispatch = useDispatch();
	const { t } = useTranslation();

	const isFastCheckout = !!useMatch(routes.fastCheckout);

	function handleClose(_, reason) {
		if (reason === 'backdropClick') {
			return;
		}

		dispatch(setIsPaymentBreakdownModalOpen(false));
	}

	async function handleContinue() {
		try {
			if (addService || addStorage) {
				setServiceLoading(true);

				const types = [
					addService && PLAN_TYPE.SERVICE,
					addStorage && PLAN_TYPE.STORAGE
				].filter(Boolean);
				await stripeModel.addServiceSubscription(types);
			}

			handleClose();
		} catch (error) {
			showError(error);
		} finally {
			setServiceLoading(false);
		}
	}

	const textHeader = t('paymentBreakdown.header');

	const planModules = t('paymentBreakdown.planModules', {
		returnObjects: true,
		storageDays: STORAGE_DAYS
	});

	useEffect(() => {
		const modalOpen = getCookie(PAYMENT_BREAKDOWN_KEY);

		if (modalOpen && loggedIn && isSubscribed) {
			dispatch(setIsPaymentBreakdownModalOpen(true));
		}

		invalidateCookie(PAYMENT_BREAKDOWN_KEY);
	}, [isSubscribed]);

	const loadingRender = (
		<Box
			sx={{
				minHeight: 250,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<CircularProgress />
		</Box>
	);

	const content = (
		<>
			<Box
				sx={{
					width: '100%',
					height: '48px',
					borderBottom: '1px solid #E8E8E8',
					display: 'flex',
					alignItems: 'center',
					px: 2
				}}
			>
				<Typography variant="body1" fontWeight={500}>
					{textHeader}
				</Typography>
			</Box>

			{trialPlan ? (
				<>
					<Stack
						sx={{
							width: '100%',
							pl: 2,
							pr: 0.5,
							flexDirection: { sm: 'row' }
						}}
					>
						<Scrollbars
							className="dialog-scrollbars"
							hideTracksWhenNotNeeded
							style={{
								height: 'calc(85svh - 130px)',
								maxHeight: smDown ? '355px' : '310px'
							}}
							renderTrackHorizontal={props => (
								<div
									{...props}
									style={{ display: 'none' }}
									className="track-horizontal"
								/>
							)}
						>
							<Stack
								sx={{
									width: '100%',
									gap: 2.5,
									py: 2.5,
									pr: 2
								}}
							>
								<Stack
									sx={{
										gap: '25px'
									}}
								>
									<Typography
										variant="body2"
										fontWeight={500}
										maxWidth={{ xs: '360px', sm: 'initial' }}
									>
										{t('paymentBreakdown.title')}
									</Typography>

									<DetailCard
										{...planModules.trial}
										priceText={formatPrice({
											amount: trialDiscount
												? 0
												: trialPlan?.baseAmount,
											currency: trialPlan.currency
										})}
										planKey="trial"
										footerComponent={
											isSubscribed ? (
												<Chip text={t('paymentBreakdown.paid')} />
											) : null
										}
									/>

									<DetailCard
										{...planModules.service}
										priceText={formatPrice({
											amount: servicePlan?.baseAmount,
											currency: servicePlan?.currency
										})}
										planKey="service"
										footerComponent={
											<Box sx={{ ml: -1 }}>
												<Switch
													id="add-service-switch"
													checked={addService}
													onChange={(_, checked) =>
														setAddService(checked)
													}
												/>
												<Typography
													variant="body1"
													component="label"
													fontWeight={700}
													htmlFor="add-service-switch"
												>
													{t('paymentBreakdown.added')}
												</Typography>
											</Box>
										}
									/>

									<DetailCard
										{...planModules.storage}
										priceText={formatPrice({
											amount: storagePlan?.baseAmount,
											currency: storagePlan?.currency
										})}
										planKey="storage"
										footerComponent={
											<Box sx={{ ml: -1 }}>
												<Switch
													id="add-storage-switch"
													checked={addStorage}
													onChange={(_, checked) =>
														setAddStorage(checked)
													}
												/>
												<Typography
													variant="body1"
													component="label"
													fontWeight={700}
													htmlFor="add-storage-switch"
												>
													{t('paymentBreakdown.added')}
												</Typography>
											</Box>
										}
									/>
								</Stack>
							</Stack>
						</Scrollbars>
					</Stack>
					<Box
						sx={{
							width: '100%',
							p: 2,
							pb: 3,
							borderTop: '1px solid #E8E8E8'
						}}
					>
						<Button
							variant="contained"
							fullWidth
							onClick={handleContinue}
							loading={serviceLoading}
						>
							{t('common.continue')}
						</Button>
					</Box>
				</>
			) : (
				loadingRender
			)}
		</>
	);

	const isOpen = open && loggedIn && !isFastCheckout;

	if (smDown) {
		return (
			<Drawer
				open={isOpen}
				onClose={handleClose}
				anchor="bottom"
				sx={{
					'.MuiPaper-root': {
						borderRadius: '12px 12px 0px 0px'
					}
				}}
			>
				{content}
			</Drawer>
		);
	}

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			sx={{
				[`.${dialogClasses.paper}`]: {
					width: '100%',
					maxWidth: 640,
					overflow: 'hidden'
				}
			}}
			hasCross={false}
			maxWidth="xl"
			width="100%"
		>
			{content}
		</Dialog>
	);
}

export default PaymentBreakdownModal;
