import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useMatches, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { APP_BASE_URL, SITE_NAME } from '@/config';
import { sendErrorToSentry, setCookie, toCamelCase } from '@/utils';
import routes from '@/routes';

export * from './user';
export * from './redux';
export * from './locale';

const { VITE_CHECKOUT_BASE_URL } = import.meta.env;

const GOOGLE_ADS_IDENTIFIERS = ['gclid', 'gbraid', 'wbraid'];

export function useScrollToTop(options) {
	useEffect(() => {
		window.scrollTo({ top: 0, ...options });
	}, []);
}

export function usePageTitle() {
	const { t, i18n } = useTranslation();
	const matches = useMatches();
	const pageNotFound = useSelector(state => state.site.pageNotFound);

	useEffect(() => {
		let title = '';
		for (const match of matches) {
			if (pageNotFound) {
				title = t('pageTitles.notFound');
				break;
			}
			const localeKey = `pageTitles.${match.id}`;
			const seoLocaleKey = `seo.${match.id}.title`;
			const hasTitle = i18n.exists(localeKey);
			const hasSeoTitle = i18n.exists(seoLocaleKey);

			if (match.id && (hasTitle || hasSeoTitle)) {
				title = t(hasSeoTitle ? seoLocaleKey : localeKey);
				break;
			}
		}

		document.title = title || SITE_NAME;
	}, [matches, i18n.language, pageNotFound, t]);
}

export function useAnimatedBackground(images = [], transition = 5000) {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
		}, transition);

		return () => clearInterval(interval);
	}, []);

	return images.at(currentIndex);
}

export function useGetErrorMessage(mapping) {
	const { t, i18n } = useTranslation();
	const errorReported = useRef();

	return error => {
		if (!error) {
			return '';
		}

		const errorCode = toCamelCase(error.data?.errorCode || '');

		if (mapping?.[errorCode]) {
			return mapping[errorCode];
		}

		if (errorCode && i18n.exists(`errors.${errorCode}`)) {
			return t(`errors.${errorCode}`);
		}

		// unknown error
		if (error?.status !== 401 && errorReported.current !== error) {
			errorReported.current = error;
			sendErrorToSentry(error);
		}

		return t('errors.generic');
	};
}

export function useDialog(initialState = false) {
	const [open, setOpen] = useState(initialState);

	const handleOpen = useCallback(() => {
		setOpen(true);
	}, []);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, []);

	return { handleClose, handleOpen, open };
}

export function useSaveGclid() {
	const [queryParams] = useSearchParams();

	useEffect(() => {
		let key;
		let value;
		for (const identifier of GOOGLE_ADS_IDENTIFIERS) {
			if (queryParams.has(identifier)) {
				key = identifier;
				value = queryParams.get(identifier);
				break;
			}
		}

		if (key) {
			const params = ['gclid', `${key}:${value}`];

			localStorage.setItem(...params);
			setCookie(...params);
		}
	}, []);
}

export function useCheckoutRedirect() {
	const { pathname } = useLocation();

	useEffect(() => {
		if (!VITE_CHECKOUT_BASE_URL || VITE_CHECKOUT_BASE_URL === APP_BASE_URL) {
			return;
		}

		if (
			window.location.origin === VITE_CHECKOUT_BASE_URL &&
			![
				routes.checkout,
				routes.paymentMethod,
				routes.fastCheckout,
				routes.fastCheckoutDashboard
			].includes(pathname)
		) {
			window.location.href = `${APP_BASE_URL}${pathname}`;
		}

		if (
			window.location.origin === APP_BASE_URL &&
			[
				routes.checkout,
				routes.paymentMethod,
				routes.fastCheckout,
				routes.fastCheckoutDashboard
			].includes(pathname)
		) {
			window.location.href = `${VITE_CHECKOUT_BASE_URL}${pathname}`;
		}
	}, [pathname]);
}

export function useMatchWithIds(ids = []) {
	const matches = useMatches();

	const hasMatch = useMemo(() => {
		let result = false;

		for (const match of matches) {
			if (!match.id) {
				continue;
			}

			if (ids.some(item => item === match.id)) {
				result = true;

				break;
			}
		}

		return result;
	}, [matches]);

	return hasMatch;
}

export function useIsCrawler() {
	const [searchParams] = useSearchParams();
	return searchParams.get('crawler') === 'true';
}
