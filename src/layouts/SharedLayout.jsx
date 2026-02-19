import {
	useCheckoutRedirect,
	useDialog,
	usePageTitle,
	useScrollToTop
} from '@/hooks';
import routes from '@/routes';

import bgColorsImage from '@/images/bg_colors.webp';

import { fetchMe } from '@/store/auth/thunks';
import {
	Backdrop,
	Box,
	CircularProgress,
	Container,
	useMediaQuery
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuthMe } from '@/store/auth/selectors';
import { AuthModal } from '@/components/AuthModal';
import { TopNavbar } from '@/components/TopNavbar';
import { APP_DRAWER_WIDTH_MD_UP, AppDrawer } from '@/components/AppDrawer';
import { NavSidebarMenu } from '@/components/NavSidebarMenu';
import { TopNavbarMenu } from '@/components/TopNavbar/TopNavbarMenu';
import { SEOSchema } from '@/components/SeoSchema';
import { websiteSchema } from '@/components/SeoSchema/schemas/website';
import { AUTH_MODAL_TYPES } from '@/store/auth';
import PaymentBreakdownModal from '@/pages/private/editor/PaymentBreakdownModal';

export function SharedLayout({ navbar = true }) {
	const dispatch = useDispatch();
	useCheckoutRedirect();

	const authMe = useSelector(useAuthMe);
	const loggedIn = useSelector(state => state.auth.loggedIn);
	const isFastSignUp = useSelector(
		state => state.auth.authModalType === AUTH_MODAL_TYPES.FAST_SIGN_UP
	);

	const { open, handleClose, handleOpen } = useDialog();

	const location = useLocation();
	const isDashboard = location.pathname === routes.dashboard;
	const isEditor = location.pathname === routes.editor;
	const mdUp = useMediaQuery(theme => theme.breakpoints.up('md'), {
		noSsr: true
	});
	const smallHeight = useMediaQuery('(max-height: 900px)');

	useEffect(() => {
		if (!authMe.completed && !authMe.loading) {
			dispatch(fetchMe());
		}
	}, []);

	useScrollToTop();
	usePageTitle();

	if (!authMe.completed) {
		return (
			<Backdrop open>
				<CircularProgress />
			</Backdrop>
		);
	}

	if (loggedIn && !isFastSignUp) {
		return (
			<>
				<SEOSchema data={websiteSchema} />
				{!mdUp && (
					<TopNavbar onCloseMenu={handleClose} onOpenMenu={handleOpen} />
				)}

				<Box
					sx={{
						display: 'flex',
						flex: '1 1 auto',
						maxWidth: '100%',
						pl: navbar && mdUp ? `${APP_DRAWER_WIDTH_MD_UP}px` : 0
					}}
				>
					{navbar && (
						<AppDrawer
							open={mdUp || open}
							onClose={handleClose}
							showGradient={mdUp}
							variant={mdUp ? 'permanent' : 'temporary'}
						>
							<NavSidebarMenu onClose={handleClose} />
						</AppDrawer>
					)}

					<Box
						py={{ xs: 1.5, md: 10 }}
						width="100%"
						sx={{
							...(isDashboard && {
								background: `url(${bgColorsImage})`,
								backgroundPosition: 'center'
							}),
							...(isEditor && smallHeight
								? {
										pt: { xs: 1.5, md: 5 },
										pb: { xs: 1.5, md: 2 }
									}
								: {})
						}}
					>
						<Container
							maxWidth="lg"
							className="private-layout-container"
							sx={{
								...(isDashboard && {
									height: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
								})
							}}
						>
							<Outlet />
						</Container>
					</Box>
				</Box>
				<PaymentBreakdownModal />
			</>
		);
	}

	return (
		<>
			<SEOSchema data={websiteSchema} />
			<AuthModal />
			<TopNavbar onCloseMenu={handleClose} onOpenMenu={handleOpen} />
			{!mdUp && (
				<AppDrawer open={open} onClose={handleClose} variant="temporary">
					<TopNavbarMenu
						direction="column"
						onClickItem={handleClose}
						showIcons
					/>
				</AppDrawer>
			)}

			{isEditor ? (
				<Container
					maxWidth="lg"
					className="private-layout-container"
					py={{ xs: 1.5, md: 10 }}
					sx={{
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						py: { xs: 1.5, md: 10 },

						...(smallHeight
							? {
									pt: { xs: 1.5, md: 5 },
									pb: { xs: 1.5, md: 2 }
								}
							: {})
					}}
				>
					<Outlet />
					<PaymentBreakdownModal />
				</Container>
			) : (
				<Outlet />
			)}
		</>
	);
}
