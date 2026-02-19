import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
	Box,
	CircularProgress,
	dialogClasses,
	Typography
} from '@mui/material';
import { Button } from '@/components/Button';
import { Dialog, DialogContent, DialogActions } from '@/components/Dialog';
import { useSubscribed } from '@/hooks/user';
import { getCookie, hasPassedDays, invalidateCookie, showError } from '@/utils';
import { useMedia } from '@/hooks/responsive';
import { TRIGGER_ACTIONS } from '@/store/editor';
import { setIsModalRateUsOpen } from '@/store/myImages';
import { updateUser } from '@/store/auth/thunks';
import CheckCircle from '@/images/check-circle.svg';
import Stars from '@/images/stars.svg';
import { REVIEW_PAGE } from './constants';
import { delay } from '../editor/hooks';

function RateUs({ isEmpty }) {
	const SCREENS = { START: 'start', LOADING: 'loading', END: 'end' };
	const [currentScreen, setCurrentScreen] = useState(SCREENS.START);
	const { user } = useSelector(state => state.auth);
	const isPaymentBreakdownOpen = useSelector(
		state => state.checkout.isPaymentBreakdownModalOpen
	);
	const dispatch = useDispatch();
	const smDown = useMedia('smDown');
	const { t } = useTranslation();
	const isLessThanSevenDays = !hasPassedDays(user.createdAt, 7);
	const isSubscribed = useSubscribed();
	const isVisible = !isEmpty && isSubscribed && isLessThanSevenDays;
	const open = useSelector(state => state.myImages.isModalRateUsOpen);
	const shouldTriggerRateUs = getCookie(TRIGGER_ACTIONS.RATE_US);

	const handleClick = useCallback(
		async function () {
			try {
				await dispatch(updateUser({ reviewRequested: true }));
				setCurrentScreen(SCREENS.LOADING);
				await delay(30_000);
				setCurrentScreen(SCREENS.END);
			} catch (reason) {
				showError(reason);
			}
		},
		[dispatch]
	);

	const handleClose = async () => {
		dispatch(setIsModalRateUsOpen(false));
	};

	useEffect(() => {
		if (shouldTriggerRateUs && user?.canRequestReview) {
			dispatch(setIsModalRateUsOpen(true));
			invalidateCookie(TRIGGER_ACTIONS.RATE_US);
		}
	}, [shouldTriggerRateUs, user?.canRequestReview]);

	if (!isVisible) {
		return null;
	}

	const screenStart = (
		<>
			<DialogContent sx={{ px: 0, pt: { xs: 3, sm: 6 }, pb: 3 }}>
				<Box className="flex flex-col items-start justify-between gap-4 rounded-lg bg-light-red px-4 pt-6 sm:flex-row sm:items-end sm:items-center sm:pt-0">
					<Box sx={{ mb: 2.5 }}>
						<img src={Stars} alt="" aria-hidden />
					</Box>
					<Typography
						component="p"
						fontWeight="bold"
						sx={{ color: 'black', mb: 1 }}
						variant={smDown ? 'body2' : 'body3'}
					>
						{t('myImages.rateUs.start.title')}
					</Typography>
					<Typography
						component="p"
						sx={{ color: 'black' }}
						variant={smDown ? 'body0' : 'body1'}
					>
						{t('myImages.rateUs.start.description')}
					</Typography>
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 0, py: 3, borderTop: '1px solid #E8E8E8' }}>
				<Button
					href={REVIEW_PAGE}
					onClick={handleClick}
					sx={{ width: '100%' }}
					target="_blank"
					variant="contained"
				>
					{t('myImages.rateUs.start.button')}
				</Button>
			</DialogActions>
		</>
	);

	const screenLoading = (
		<DialogContent sx={{ px: 0, py: 3 }}>
			<Typography
				component="p"
				fontWeight="bold"
				sx={{ color: 'black', mb: 1 }}
				variant={smDown ? 'body2' : 'body3'}
			>
				{t('myImages.rateUs.loading.title')}
			</Typography>
			<Typography
				component="p"
				sx={{ color: 'black', mb: 2.5 }}
				variant={smDown ? 'body0' : 'body1'}
			>
				{t('myImages.rateUs.loading.description')}
			</Typography>
			<CircularProgress size={40} />
		</DialogContent>
	);

	const screenEnd = (
		<>
			<DialogContent sx={{ px: 0, pt: { xs: 3, sm: 6 }, pb: 3 }}>
				<Box sx={{ mb: 2.5 }}>
					<img src={CheckCircle} alt="" aria-hidden />
				</Box>
				<Typography
					component="p"
					fontWeight="bold"
					sx={{ color: 'black', mb: 1 }}
					variant={smDown ? 'body2' : 'body3'}
				>
					{t('myImages.rateUs.end.title')}
				</Typography>
				<Typography
					component="p"
					sx={{ color: 'black' }}
					variant={smDown ? 'body0' : 'body1'}
				>
					{t('myImages.rateUs.end.description')}
				</Typography>
			</DialogContent>
			<DialogActions sx={{ px: 0, py: 3, borderTop: '1px solid #E8E8E8' }}>
				<Button
					onClick={handleClose}
					sx={{ width: '100%' }}
					variant="contained"
				>
					{t('common.close')}
				</Button>
			</DialogActions>
		</>
	);

	return (
		<Dialog
			open={open && !isPaymentBreakdownOpen}
			sx={{
				[`.${dialogClasses.paper}`]: {
					width: { xs: 280, sm: 388 },
					px: { xs: 2, sm: 3 },
					py: 0
				}
			}}
		>
			{currentScreen === SCREENS.START && screenStart}
			{currentScreen === SCREENS.LOADING && screenLoading}
			{currentScreen === SCREENS.END && screenEnd}
		</Dialog>
	);
}

export default RateUs;
