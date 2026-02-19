import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useLanguage } from '@/hooks';
import { SENTRY_ENABLED } from '@/config';
import { logout } from '@/store/auth/thunks';
import { showError } from '@/utils';

let sentryLoader = null;

export function useLanguageConfig() {
	const language = useLanguage();
	const { i18n } = useTranslation();

	useEffect(() => {
		i18n.changeLanguage(language);
	}, [language]);

	useEffect(() => {
		if (i18n.isInitialized) {
			// data-site-ready for crawler and showing the page after i18n is initialized
			document.body.dataset.siteReady = '';
		}
	}, [i18n.isInitialized]);

	return null;
}

async function loadSentry() {
	try {
		const { initSentry } = await import('@/utils/sentry');
		return initSentry();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('Failed to load sentry', err);
	}
}

if (SENTRY_ENABLED) {
	sentryLoader = loadSentry();
}

export function useSentryConfig() {
	const user = useSelector(state => state.auth.user);

	useEffect(() => {
		if (!SENTRY_ENABLED) {
			return;
		}

		(async () => {
			const Sentry = await sentryLoader;
			Sentry?.setUser(user ? { email: user.email } : null);
		})();
	}, [user]);
}

export function useYupConfig() {
	const { t, i18n } = useTranslation();
	const firstRender = useRef(true);

	function loadLocale() {
		Yup.setLocale({
			mixed: {
				required: t('validations.mixed.required')
			},
			string: {
				min: t('validations.string.min'),
				max: t('validations.string.max'),
				email: t('validations.string.email')
			}
		});
	}

	if (firstRender.current) {
		firstRender.current = false;

		loadLocale();
	}

	useEffect(() => {
		// ignore first render
		if (firstRender.current) {
			return;
		}

		loadLocale();
	}, [i18n.language]);
}

export function useLogoutControl() {
	const dispatch = useDispatch();

	useEffect(() => {
		async function handleLogout() {
			try {
				await dispatch(logout()).unwrap();
			} catch (error) {
				showError(error);
			}
		}

		window.addEventListener('logout', handleLogout);

		return () => {
			window.removeEventListener('logout', handleLogout);
		};
	}, []);
}
