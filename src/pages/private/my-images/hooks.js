import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import userModel from '@/models/user';
import { storage } from '@/utils/browser';
import { REDIRECT_SCOPES, clearShowCreditsAnimation } from '@/store/auth';
import { showError } from '@/utils';
import { fetchMe } from '@/store/auth/thunks';
import { fetchCredits } from '@/store/editor/thunks';

import { VIEWS } from './constants';

const REFETCH_ME_DELAY = 2000;

const CONFIG_KEY = 'my-images-config';

const DEFAULT_CONFIG = {
	view: VIEWS.GRID
};

export function useConfig() {
	const [config, setConfig] = useState(() => {
		const saved = storage.get(CONFIG_KEY);
		return { ...DEFAULT_CONFIG, ...saved };
	});

	return {
		config,
		setConfig(name, value) {
			const newConfig = { ...config, [name]: value };
			setConfig(newConfig);
			storage.save(CONFIG_KEY, newConfig);
		}
	};
}

export const AUTH_TRIGGER_QUERY = 'authTrigger';

export function useOauthRedirect() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const authTrigger = searchParams.get(AUTH_TRIGGER_QUERY);

		if (authTrigger) {
			const [scope, type] = authTrigger.split('-');

			const redirectUrl = REDIRECT_SCOPES?.[scope]?.[type];

			setSearchParams({});

			if (redirectUrl?.startsWith('http')) {
				window.location.href = redirectUrl;

				return;
			}

			if (redirectUrl) {
				navigate(redirectUrl);
			}
		}
	}, []);
}

export function useAnimation() {
	const user = useSelector(state => state.auth.user);
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const [animation, setAnimation] = useState(() => user.showCreditsAnimation);
	// state for resetting the render for the animation
	const [animationKey, setAnimationKey] = useState(
		animation ? 'animated' : 'not-animated'
	);

	useEffect(() => {
		if (!user.showCreditsAnimation) {
			return;
		}
		setAnimation(true);
		setAnimationKey('animated');

		(async () => {
			try {
				await userModel.update({ showCreditsAnimation: false });
				dispatch(clearShowCreditsAnimation());
			} catch (error) {
				showError(error);
			}
		})();
	}, [user.showCreditsAnimation]);

	useEffect(() => {
		if (!animation) {
			return;
		}

		const timeout = setTimeout(() => {
			setAnimation(false);
		}, 3000);

		return () => {
			clearTimeout(timeout);
		};
	}, [animation]);

	useEffect(() => {
		if (!user.showCreditsAnimation && searchParams.get('success')) {
			setTimeout(async () => {
				try {
					await Promise.all([
						dispatch(fetchCredits()).unwrap(),
						dispatch(fetchMe()).unwrap()
					]);
				} catch (error) {
					showError(error);
				}
			}, REFETCH_ME_DELAY);
		}

		setSearchParams({});
	}, []);

	return {
		animation,
		animationKey
	};
}
