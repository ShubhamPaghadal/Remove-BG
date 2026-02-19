import { useOauthErrors } from '@/hooks/oauth';
import { setAuthModalType } from '@/store/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import routes from '@/routes';
import { NoCreditsErrorListener } from '@/components/NoCreditsModal';

import { Faq } from './Faq';
import { Features } from './Features';
import { Hero } from './Hero';
import { HowToUse } from './HowToUse';
import { Showcase } from './Showcase';

export function Home() {
	const user = useSelector(state => state.auth.user);
	const dispatch = useDispatch();
	const { hasError, modalType } = useOauthErrors();

	useEffect(() => {
		if (hasError) {
			dispatch(setAuthModalType(modalType));
		}
	}, []);

	if (user) {
		return <Navigate to={routes.myImages} />;
	}

	return (
		<>
			<NoCreditsErrorListener />
			<Hero />
			<Showcase />
			<HowToUse />
			<Features />
			<Faq />
		</>
	);
}
