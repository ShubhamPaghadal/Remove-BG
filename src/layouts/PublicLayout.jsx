import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';

import {
	useCheckoutRedirect,
	useDialog,
	usePageTitle,
	useSaveGclid
} from '@/hooks';
import { TopNavbar } from '@/components/TopNavbar';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { fetchMe } from '@/store/auth/thunks';
import { AppDrawer } from '@/components/AppDrawer';
import { TopNavbarMenu } from '@/components/TopNavbar/TopNavbarMenu';
import { SEOSchema } from '@/components/SeoSchema';
import { websiteSchema } from '@/components/SeoSchema/schemas/website';
import { useMedia } from '@/hooks/responsive';
import { SeoTags } from './SeoTags';

function Scroller() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo({ top: 0 });
	}, [pathname]);
}

export function PublicLayout() {
	const dispatch = useDispatch();
	useCheckoutRedirect();

	const { open, handleClose, handleOpen } = useDialog();
	const mdDown = useMedia('mdDown');
	useSaveGclid();
	usePageTitle();

	useEffect(() => {
		dispatch(fetchMe());
	}, []);

	return (
		<>
			<SeoTags />
			<SEOSchema data={websiteSchema} />
			<Scroller />
			<AuthModal />
			<TopNavbar onCloseMenu={handleClose} onOpenMenu={handleOpen} />
			{mdDown && (
				<AppDrawer open={open} onClose={handleClose} variant="temporary">
					<TopNavbarMenu
						direction="column"
						onClickItem={handleClose}
						showIcons
					/>
				</AppDrawer>
			)}

			<Outlet />

			<Footer />
		</>
	);
}
