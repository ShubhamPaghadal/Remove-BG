import { lazy, useEffect, Suspense, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Dialog, DialogContent, dialogClasses } from '@/components/Dialog';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { formatPrice, hasPassedDays, setCookie, showError } from '@/utils';
import {
	Box,
	CircularProgress,
	Divider,
	Drawer,
	Stack,
	Typography
} from '@mui/material';
import { useMatch } from 'react-router-dom';
import routes from '@/routes';
import { fetchPrices } from '@/store/billing/thunks';
import stripeModel from '@/models/stripe';
import {
	usePaymentMethod,
	useShallowSelector,
	useSubscribed,
	useTrialDiscount
} from '@/hooks';
import { usePaymentUtils } from '@/components/PaymentElement/hooks';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { StampCheckmarkIcon } from '@/components/Icons/StampCheckmarkIcon';
import { useMedia } from '@/hooks/responsive';
import { CloseIcon } from '@/components/Icons';
import { fetchMe } from '@/store/auth/thunks';
import { setIsModalFullDiscountOpen, TRIGGER_ACTIONS } from '@/store/editor';
import { TrialPlan } from './TrialPlan';
import { useStickyTop } from './hooks';
import { BUTTON_CONTAINER_HEIGHT } from './constants';
import { PAYMENT_BREAKDOWN_KEY } from '../PaymentBreakdownModal/constants';

const PaymentElement = lazy(() => import('@/components/PaymentElement'));

const DISCOUNT_TIMER_MINUTES = 11;
const MINUTE_IN_MS = 60 * 1000;

export function FastCheckout(customProps) {
	const { t } = useTranslation();
	const fastEditor = !!useMatch(routes.fastCheckout);
	const fastDashboard = !!useMatch(routes.fastCheckoutDashboard);
	const smDown = useMedia('smDown');
	const dialogRef = useStickyTop(smDown);
	const dispatch = useDispatch();

	const { currency, isModalFullDiscountOpen, loading, prices, user } =
		useShallowSelector(state => ({
			currency: state.auth.currency,
			isModalFullDiscountOpen: state.editor.isModalFullDiscountOpen,
			loading: state.billing.fetchPrices.loading,
			prices: state.billing.fetchPrices.data,
			user: state.auth.user
		}));

	const isFastCheckoutRoute = fastEditor || fastDashboard;
	const isLessThanSevenDays = !!user && !hasPassedDays(user.createdAt, 7);
	const isOpen = !isModalFullDiscountOpen && isFastCheckoutRoute;
	const subscribed = useSubscribed();
	const trialDiscount = useTrialDiscount();

	const handlePaymentSuccess = () => {
		if (user?.hasGoogleAdId) {
			setCookie(PAYMENT_BREAKDOWN_KEY, true);
		}

		setCookie(TRIGGER_ACTIONS.RATE_US, true);
	};

	const { executePayment, paymentError, executingPayment, clearError } =
		usePaymentUtils({ onPaymentSuccess: handlePaymentSuccess });

	const paymentMethod = usePaymentMethod();

	const [initialRenderTime] = useState(dayjs());
	const [nextAction, setNextAction] = useState(null);
	const [stripeModule, setStripeModule] = useState(null);
	const [showCheckoutButton, setShowCheckoutButton] = useState(true);

	const trialPlan = prices?.find(
		price => price.name === 'trial' && !!price.active
	);

	const trialPlanPrice = formatPrice({
		amount: trialPlan?.baseAmount,
		currency: currency || trialPlan?.currency
	});

	const loadingRender = (
		<Box
			sx={{
				minHeight: 130,
				display: 'flex',
				justifyContent: 'center'
			}}
		>
			<CircularProgress />
		</Box>
	);

	function handleClose(_, reason) {
		if (reason !== 'backdropClick') {
			if (
				isFastCheckoutRoute &&
				isLessThanSevenDays &&
				user?.hasGoogleAdId &&
				!subscribed &&
				!trialDiscount
			) {
				dispatch(setIsModalFullDiscountOpen(true));
			} else {
				window.location.href = fastDashboard
					? routes.dashboard
					: routes.editor;
			}
		}
	}

	useEffect(() => {
		if (!isFastCheckoutRoute) {
			return;
		}

		(async () => {
			try {
				await dispatch(fetchPrices({ currency })).unwrap();
			} catch (err) {
				showError(err);
			}
		})();
	}, [isFastCheckoutRoute, currency]);

	useEffect(() => {
		if (!trialPlan || nextAction) {
			return;
		}

		(async () => {
			try {
				const response = await stripeModel.getNextAction(trialPlan?.id);

				setNextAction(response);
			} catch (error) {
				showError(error);
			}
		})();
	}, [trialPlan]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const currentTime = dayjs();
			const startTime = dayjs(initialRenderTime);

			if (currentTime.diff(startTime, 'minutes') >= DISCOUNT_TIMER_MINUTES) {
				dispatch(fetchMe());
				clearInterval(intervalId);
			}
		}, MINUTE_IN_MS);

		return () => clearInterval(intervalId);
	}, [dispatch, initialRenderTime]);

	const hasTrialDiscount = !!user?.trialDiscount;

	const buttonText = t('fastCheckout.button.download');

	const content = (
		<>
			{loading && loadingRender}
			{!loading && (
				<Box sx={{ '& form': { pr: 0 } }}>
					<Box mb={3}>
						<Typography
							sx={{
								fontSize: '20px',
								fontWeight: 700,
								lineHeight: '28px',
								maxWidth: '80%'
							}}
						>
							{t('fastCheckout.title')}
						</Typography>
						<Box mt="14px" pb={1.25}>
							<Stack
								flexDirection="row"
								justifyContent="space-between"
								alignItems="center"
							>
								<Box>
									<Typography
										component="p"
										variant="body3"
										fontSize={16}
										fontWeight="semi"
										sx={{ whiteSpace: 'pre-line' }}
									>
										{t('fastCheckout.description')}
									</Typography>
								</Box>
							</Stack>
						</Box>
						<Divider orientation="horizontal" />
						{trialPlan && !hasTrialDiscount && (
							<TrialPlan
								title={t('fastCheckout.trialTitle')}
								trialPlan={trialPlan}
								trialPlanPrice={trialPlanPrice}
								currency={currency}
							/>
						)}
						{hasTrialDiscount && (
							<>
								<Stack
									alignItems="center"
									direction="row"
									justifyContent="space-between"
									my="12px"
								>
									<Box alignItems="center" display="flex" gap="8px">
										<StampCheckmarkIcon
											sx={{
												backgroundColor: 'lime',
												borderRadius: '50%',
												fontSize: '32px',
												padding: '4px'
											}}
										/>
										<Typography fontWeight={700} variant="body1">
											{t('checkout.trialDiscount')}
										</Typography>
									</Box>
									<Typography
										fontWeight={700}
										sx={{
											backgroundColor: 'lime',
											borderRadius: '4px',
											padding: '0 4px'
										}}
										variant="body2"
									>
										{formatPrice({
											amount: 0,
											currency: currency || trialPlan?.currency
										})}
									</Typography>
								</Stack>
								<Divider orientation="horizontal" />
							</>
						)}
					</Box>
					<Suspense fallback={loadingRender}>
						<PaymentElement
							onSavedPaymentMethod={stripe => {
								if (!paymentMethod.hasPaymentMethod) {
									return executePayment(stripe, {
										priceId: trialPlan.id,
										nextAction,
										hasTrialDiscount
									});
								}
								setShowCheckoutButton(true);
							}}
							onLoadStripeModule={setStripeModule}
							onCancelPaymentMethodChange={() =>
								setShowCheckoutButton(true)
							}
							onOpenSetupIntent={() => {
								clearError();
								setShowCheckoutButton(false);
							}}
							onSetupErr={showError}
							currentPlan={trialPlan}
							finishButtonProps={{
								text: buttonText,
								fullWidth: true
							}}
							fastCheckout
						/>
						{paymentError && (
							<Typography
								variant="body1"
								color="error.main"
								sx={{ mp: 0 }}
							>
								{paymentError.message || paymentError.data?.message}
							</Typography>
						)}
						{showCheckoutButton && paymentMethod.hasPaymentMethod && (
							<Stack
								direction="row"
								justifyContent="flex-end"
								sx={theme => ({
									left: 0,
									p: '12px 24px 20px',
									[theme.breakpoints.up('sm')]: {
										position: 'absolute',
										top: 'var(--sticky-top)',
										width: '100%',
										transition: 'none'
									},
									[theme.breakpoints.down('sm')]: {
										position: 'fixed',
										bottom: 0,
										width: '100%',
										borderTop: '1px solid #E8E8E8',
										boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)'
									}
								})}
							>
								<Button
									variant="contained"
									fullWidth
									onClick={() =>
										executePayment(stripeModule, {
											priceId: trialPlan.id,
											nextAction,
											hasTrialDiscount
										})
									}
									loading={executingPayment}
								>
									{t('common.payNow')}
								</Button>
							</Stack>
						)}
					</Suspense>
				</Box>
			)}
		</>
	);

	if (smDown) {
		return (
			<Drawer
				open={isOpen}
				onClose={handleClose}
				anchor="bottom"
				sx={{
					'.MuiPaper-root': {
						borderRadius: '12px 12px 0px 0px',
						px: 3,
						pt: 5,
						pb: 3.5,
						height: { xs: 'calc(100svh - 24px)', sm: 'auto' },
						maxHeight: 656
					}
				}}
			>
				<IconButton
					onClick={handleClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						zIndex: 1
					}}
				>
					<CloseIcon sx={{ color: 'secondary.main' }} />
				</IconButton>
				{content}
			</Drawer>
		);
	}

	return (
		<Dialog
			ref={dialogRef}
			open={isOpen}
			onClose={handleClose}
			sx={{
				[`.${dialogClasses.paper}`]: {
					width: '100%',
					pt: 3,
					pb: { xs: 2, sm: 1 },
					px: 1,
					maxWidth: 520,
					overflow: 'hidden'
				}
			}}
			maxWidth="xl"
			width="100%"
			{...customProps}
		>
			<Scrollbars
				className="dialog-scrollbars"
				hideTracksWhenNotNeeded
				autoHeight
				autoHeightMax={`calc(100vh - ${20 + BUTTON_CONTAINER_HEIGHT}px)`}
				renderTrackHorizontal={props => (
					<div
						{...props}
						style={{ display: 'none' }}
						className="track-horizontal"
					/>
				)}
			>
				<DialogContent
					sx={{
						px: {
							xs: 1,
							sm: 3
						}
					}}
				>
					{content}
				</DialogContent>
			</Scrollbars>
		</Dialog>
	);
}
