import { DEFAULT_LANGUAGE, supportedLanguages } from '@/i18next';
import routes from '@/routes';
import { getPathLanguage } from './locale';

export function getCheckoutUrl({ priceId, clientSecret, priceName } = {}) {
	const queryParams = new URLSearchParams();
	if (priceId) {
		queryParams.set('priceId', priceId);
	}
	if (clientSecret) {
		queryParams.set('clientSecret', clientSecret);
	}
	if (priceName) {
		queryParams.set('priceName', priceName);
	}

	return `${import.meta.env.VITE_CHECKOUT_BASE_URL || window.location.origin}${routes.checkout}?${queryParams.toString()}`;
}

export function redirectToCheckout({ priceId, clientSecret, ...params } = {}) {
	window.location.href = getCheckoutUrl({ priceId, clientSecret, ...params });
}

export function stripTrailingSlash(str) {
	if (str.substr(-1) === '/') {
		return str.substr(0, str.length - 1);
	}
	return str;
}

export function getAbsolutePath(pathname) {
	const parts = pathname.split('/');

	if (parts.length > 1) {
		const posibleLang = parts[1];
		if (supportedLanguages.includes(posibleLang)) {
			return parts.filter(v => v !== posibleLang).join('/');
		}
	}
	return pathname;
}

export function getCanonical(pathname) {
	const localePath = getPathLanguage();
	const absolutePath = getAbsolutePath(pathname);

	if (!localePath || localePath === DEFAULT_LANGUAGE) {
		return stripTrailingSlash(absolutePath);
	}

	if (!absolutePath) {
		// root
		return stripTrailingSlash(`/${localePath}`);
	}

	return stripTrailingSlash(`/${localePath}${absolutePath}`);
}
