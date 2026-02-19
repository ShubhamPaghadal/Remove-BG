import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import en from '@/legal-locales/en';
import { setLegalsReady } from '@/store/auth';
import { useLanguage } from '@/hooks';
import { DEFAULT_LANGUAGE } from '@/i18next';

const messagesCache = {
	en
};

const messagesLoader = {
	ar: () => import('@/legal-locales/ar'),
	es: () => import('@/legal-locales/es'),
	bg: () => import('@/legal-locales/bg'),
	cs: () => import('@/legal-locales/cs'),
	da: () => import('@/legal-locales/da'),
	de: () => import('@/legal-locales/de'),
	el: () => import('@/legal-locales/el'),
	fi: () => import('@/legal-locales/fi'),
	fr: () => import('@/legal-locales/fr'),
	he: () => import('@/legal-locales/he'),
	hr: () => import('@/legal-locales/hr'),
	hu: () => import('@/legal-locales/hu'),
	id: () => import('@/legal-locales/id'),
	it: () => import('@/legal-locales/it'),
	ja: () => import('@/legal-locales/ja'),
	ko: () => import('@/legal-locales/ko'),
	lv: () => import('@/legal-locales/lv'),
	ms: () => import('@/legal-locales/ms'),
	nb: () => import('@/legal-locales/nb'),
	nl: () => import('@/legal-locales/nl'),
	pl: () => import('@/legal-locales/pl'),
	pt: () => import('@/legal-locales/pt'),
	ro: () => import('@/legal-locales/ro'),
	sk: () => import('@/legal-locales/sk'),
	sl: () => import('@/legal-locales/sl'),
	sr: () => import('@/legal-locales/sr'),
	sv: () => import('@/legal-locales/sv'),
	th: () => import('@/legal-locales/th'),
	tr: () => import('@/legal-locales/tr'),
	uk: () => import('@/legal-locales/uk'),
	zh: () => import('@/legal-locales/zh')
};

export function useStaticTexts(key) {
	const locale = useLanguage();
	const dispatch = useDispatch();
	const [messages, setMessages] = useState(
		messagesCache[locale] || messagesCache[DEFAULT_LANGUAGE]
	);

	useEffect(() => {
		dispatch(setLegalsReady(false));

		if (messagesCache[locale]) {
			dispatch(setLegalsReady());
			return setMessages(messagesCache[locale]);
		}

		messagesLoader[locale]()
			.then(({ default: newMessages }) => {
				setMessages(newMessages);
				dispatch(setLegalsReady());
			})
			.catch(error => {
				// eslint-disable-next-line no-console
				console.error(error);
				dispatch(setLegalsReady());
			});
	}, [locale]);

	return messages[key] || {};
}
