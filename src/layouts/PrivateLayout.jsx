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
import { Navigate, Outlet, useMatch } from 'react-router-dom';
import { useAuthMe } from '@/store/auth/selectors';
import { TopNavbar } from '@/components/TopNavbar';
import {
	APP_DRAWER_WIDTH_MD_UP,
	AppDrawer
} from '@/components/AppDrawer/AppDrawer';
import { NavSidebarMenu } from '@/components/NavSidebarMenu';
import { useOauthRedirect } from '@/pages/private/my-images/hooks';
import { SEOSchema } from '@/components/SeoSchema';
import { websiteSchema } from '@/components/SeoSchema/schemas/website';
import { languageLoader } from '@/utils/languageLoader';
import dayjs from 'dayjs';
import PaymentBreakdownModal from '@/pages/private/editor/PaymentBreakdownModal';

export function PrivateLayout({ navbar = true }) {
	const dispatch = useDispatch();
	useCheckoutRedirect();

	const authMe = useSelector(useAuthMe);
	const dropzone = useSelector(state => state.editor.dropzoneProps);
	const { open, handleClose, handleOpen } = useDialog();
	const isMyImages = !!useMatch(routes.myImages);
	const isNormalDashboard = !!useMatch(routes.dashboard);
	const isFastDashboard = !!useMatch(routes.fastCheckoutDashboard);
	const isDashboard = isNormalDashboard || isFastDashboard;
	const locale = useSelector(state => state.auth.language);

	useEffect(() => {
		if (languageLoader[locale]) {
			languageLoader[locale]().then(() => dayjs.locale(locale));
		}
	}, [locale]);

	const mdUp = useMediaQuery(theme => theme.breakpoints.up('md'), {
		noSsr: true
	});

	useEffect(() => {
		if (
			(!authMe.data && !authMe.loading) ||
			// force fetch in myImages
			(!authMe.loading && isMyImages)
		) {
			dispatch(fetchMe());
		}
	}, [isMyImages]);

	useScrollToTop();
	usePageTitle();
	useOauthRedirect();

	if (!authMe.data && authMe.loading) {
		return (
			<Backdrop open>
				<CircularProgress />
			</Backdrop>
		);
	}

	if (authMe.rejected) {
		return <Navigate to="/" />;
	}

	if (authMe.success) {
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
						py={{
							xs: 3,
							md: 10
						}}
						width="100%"
						sx={{
							position: 'relative',
							...(isDashboard && {
								background: `url(${bgColorsImage})`,
								backgroundPosition: 'center'
							})
						}}
						{...(dropzone && dropzone.getRootProps())}
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

	return null;
}
