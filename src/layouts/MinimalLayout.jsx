import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import { useDialog, usePageTitle, useSaveGclid, useScrollToTop } from '@/hooks';

import bgColorsImage from '@/images/bg_colors.webp';

import { TopNavbar } from '@/components/TopNavbar';
import { Scroller } from '@/components/Scroller';
import { fetchMe } from '@/store/auth/thunks';
import { AppDrawer } from '@/components/AppDrawer';
import { TopNavbarMenu } from '@/components/TopNavbar/TopNavbarMenu';
import { AuthModal } from '@/components/AuthModal';
import { SEOSchema } from '@/components/SeoSchema';
import { websiteSchema } from '@/components/SeoSchema/schemas/website';
import routes from '@/routes';
import { Box, Container, useMediaQuery } from '@mui/material';
import { supportedLanguages } from '@/i18next';
import { PublicLayout } from './PublicLayout';
import { SeoTags } from './SeoTags';

export function MinimalLayout() {
	const dispatch = useDispatch();
	const location = useLocation();
	const { lang } = useParams();
	const { open, handleClose, handleOpen } = useDialog();
	const dropzone = useSelector(state => state.editor.dropzoneProps);

	const mdUp = useMediaQuery(theme => theme.breakpoints.up('md'), {
		noSsr: true
	});

	const isUpload = location.pathname === routes.upload;

	useScrollToTop();
	usePageTitle();
	useSaveGclid();

	useEffect(() => {
		dispatch(fetchMe());
	}, []);

	if (lang && !supportedLanguages.includes(lang)) {
		return <PublicLayout />;
	}

	return (
		<>
			<SeoTags />
			<Scroller />
			<AuthModal />
			<SEOSchema data={websiteSchema} />
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

			<Box
				sx={{
					display: 'flex',
					flex: '1 1 auto',
					maxWidth: '100%',
					pl: 0
				}}
			>
				<Box
					py={{
						xs: 3,
						md: 10
					}}
					width="100%"
					sx={{
						position: 'relative',
						...(isUpload && {
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
							...(isUpload && {
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
		</>
	);
}
