import { usePageTitle, useScrollToTop } from '@/hooks';

import { fetchMe } from '@/store/auth/thunks';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthMe } from '@/store/auth/selectors';
import { SimpleHeader } from '@/components/SimpleHeader';

export function CheckoutLayout() {
	const dispatch = useDispatch();

	const authMe = useSelector(useAuthMe);

	useEffect(() => {
		if (!authMe.data && !authMe.loading) {
			dispatch(fetchMe());
		}
	}, []);

	useScrollToTop();
	usePageTitle();

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
			<Box>
				<SimpleHeader />

				<Box width="100%">
					<Outlet />
				</Box>
			</Box>
		);
	}

	return null;
}
