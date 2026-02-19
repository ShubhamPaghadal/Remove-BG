import { useMemo } from 'react';
import {
	needDisplayNamesPolyfill,
	useLanguage,
	useLoadPolyfill
} from '@/hooks';
import { DEFAULT_LANGUAGE, supportedLanguages } from '@/i18next';
import { capitalize } from '@/utils';

const labelsMapping = {
	nb: 'no'
};

function parseLangForLabel(lng) {
	return labelsMapping?.[lng] || lng;
}

export function useLanguageOptions() {
	const language = useLanguage();
	const polyfillLocaleLoaded = useLoadPolyfill(language);

	return useMemo(() => {
		const safeLanguage = language || DEFAULT_LANGUAGE;
		if (needDisplayNamesPolyfill(safeLanguage)) {
			return [];
		}

		const displayName = new Intl.DisplayNames([safeLanguage], {
			type: 'language'
		});

		return supportedLanguages.map(lng => ({
			value: lng,
			label: capitalize(displayName.of(parseLangForLabel(lng)) || '')
		}));
	}, [language, polyfillLocaleLoaded]);
}

export function useDisplayLanguage() {
	const language = useLanguage();
	const polyfillLocaleLoaded = useLoadPolyfill(language);

	const displayName = useMemo(() => {
		const safeLanguage = language || DEFAULT_LANGUAGE;
		if (needDisplayNamesPolyfill(safeLanguage)) {
			return {
				of: () => ''
			};
		}
		return new Intl.DisplayNames([safeLanguage], {
			type: 'language'
		});
	}, [language, polyfillLocaleLoaded]);

	return value => {
		if (!value) return '';
		const parsed = parseLangForLabel(value) || DEFAULT_LANGUAGE;
		return capitalize(displayName.of(parsed) || '');
	};
}
