import { supportedLanguages } from '@/i18next';

function stripTrailingSlash(str) {
	if (str.substr(-1) === '/') {
		return str.substr(0, str.length - 1);
	}
	return str;
}

export function getPathLanguage() {
	const [, firstPart] = window.location.pathname.split('/');
	return supportedLanguages.includes(firstPart) ? firstPart : null;
}

export function localizedRoute(route) {
	const urlLang = getPathLanguage();

	if (urlLang) {
		return stripTrailingSlash(`/${urlLang}${route}`);
	}

	return route;
}
