import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { shouldPolyfill } from '@formatjs/intl-displaynames/should-polyfill.js';
import { DEFAULT_LANGUAGE } from '@/i18next';
import { showError } from '@/utils';

const localeDataLoader = {
	ar: () => import('@formatjs/intl-displaynames/locale-data/ar'),
	bg: () => import('@formatjs/intl-displaynames/locale-data/bg'),
	ca: () => import('@formatjs/intl-displaynames/locale-data/ca'),
	cs: () => import('@formatjs/intl-displaynames/locale-data/cs'),
	da: () => import('@formatjs/intl-displaynames/locale-data/da'),
	de: () => import('@formatjs/intl-displaynames/locale-data/de'),
	el: () => import('@formatjs/intl-displaynames/locale-data/el'),
	en: () => import('@formatjs/intl-displaynames/locale-data/en'),
	es: () => import('@formatjs/intl-displaynames/locale-data/es'),
	fi: () => import('@formatjs/intl-displaynames/locale-data/fi'),
	fr: () => import('@formatjs/intl-displaynames/locale-data/fr'),
	he: () => import('@formatjs/intl-displaynames/locale-data/he'),
	hr: () => import('@formatjs/intl-displaynames/locale-data/hr'),
	hu: () => import('@formatjs/intl-displaynames/locale-data/hu'),
	id: () => import('@formatjs/intl-displaynames/locale-data/id'),
	it: () => import('@formatjs/intl-displaynames/locale-data/it'),
	ja: () => import('@formatjs/intl-displaynames/locale-data/ja'),
	ko: () => import('@formatjs/intl-displaynames/locale-data/ko'),
	lv: () => import('@formatjs/intl-displaynames/locale-data/lv'),
	ms: () => import('@formatjs/intl-displaynames/locale-data/ms'),
	nb: () => import('@formatjs/intl-displaynames/locale-data/nb'),
	nl: () => import('@formatjs/intl-displaynames/locale-data/nl'),
	pl: () => import('@formatjs/intl-displaynames/locale-data/pl'),
	pt: () => import('@formatjs/intl-displaynames/locale-data/pt'),
	ro: () => import('@formatjs/intl-displaynames/locale-data/ro'),
	ru: () => import('@formatjs/intl-displaynames/locale-data/ru'),
	sk: () => import('@formatjs/intl-displaynames/locale-data/sk'),
	sl: () => import('@formatjs/intl-displaynames/locale-data/sl'),
	sr: () => import('@formatjs/intl-displaynames/locale-data/sr'),
	sv: () => import('@formatjs/intl-displaynames/locale-data/sv'),
	th: () => import('@formatjs/intl-displaynames/locale-data/th'),
	tr: () => import('@formatjs/intl-displaynames/locale-data/tr'),
	uk: () => import('@formatjs/intl-displaynames/locale-data/uk')
};

export function useLanguage() {
	return useSelector(state => state.auth.language);
}

// replace with shouldPolyfill when https://bugs.chromium.org/p/chromium/issues/detail?id=1176979 is resolved
// currently shouldPolyfill checks for this bug that only happens when "type" prop is 'script'
// and forces to download the polyfill
export function needDisplayNamesPolyfill(locale) {
	// Intl.DisplayNames.supportedLocalesOf throws TypeError if locale is null/undefined
	const safeLocale = locale || DEFAULT_LANGUAGE;
	return (
		!window.Intl?.DisplayNames ||
		Intl.DisplayNames.supportedLocalesOf([safeLocale]).length === 0
	);
}

export function useLoadPolyfill(language) {
	const [polyfillLocaleLoaded, setPolyfillLocaleLoaded] = useState(null);

	useEffect(() => {
		(async () => {
			if (!needDisplayNamesPolyfill(language)) {
				return;
			}
			try {
				const parsedLocale = shouldPolyfill(language) || DEFAULT_LANGUAGE;
				await import('@formatjs/intl-displaynames/polyfill-force.js');
				await localeDataLoader[parsedLocale]();

				setPolyfillLocaleLoaded(parsedLocale);
			} catch (error) {
				showError(error);
			}
		})();
	}, [language]);

	return polyfillLocaleLoaded;
}
