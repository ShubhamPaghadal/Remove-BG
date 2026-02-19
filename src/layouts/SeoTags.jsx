import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useMatches } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANGUAGE, supportedLanguages } from '@/i18next';
import { stripTrailingSlash, getCanonical, getAbsolutePath } from '@/utils/url';
import { SITE_NAME } from '@/config';
import { useMatchWithIds } from '@/hooks';

export function SeoTags() {
	const { pathname } = useLocation();
	const { t, i18n } = useTranslation();
	const matches = useMatches();
	const [description, setDescription] = useState(t('seo.metaDescription'));
	const absolutePath = getAbsolutePath(pathname);
	const pageNotFound = useSelector(state => state.site.pageNotFound);

	const noIndexPage = useMatchWithIds([
		'terms-and-conditions',
		'gdpr',
		'cookies-policy',
		'privacy-policy'
	]);

	const { origin } = window.location;

	useEffect(() => {
		let newDescription = t('seo.metaDescription');

		for (const match of matches) {
			if (!match.id) {
				continue;
			}

			const seoLocaleKey = `seo.${match.id}.description`;
			if (i18n.exists(seoLocaleKey)) {
				newDescription = t(seoLocaleKey, { siteName: SITE_NAME });
				break;
			}
		}
		setDescription(newDescription);
	}, [matches, i18n.language, t]);

	return (
		<Helmet defer={false}>
			<meta name="description" content={description} />

			<link rel="canonical" href={`${origin}${getCanonical(pathname)}`} />

			{pageNotFound && <meta name="robots" content="noindex, nofollow" />}

			{noIndexPage && <meta name="robots" content="noindex" />}

			{!pageNotFound && (
				<link
					rel="alternate"
					href={stripTrailingSlash(`${origin}${absolutePath}`)}
				/>
			)}
			{!pageNotFound &&
				supportedLanguages.map(lang => {
					if (lang === DEFAULT_LANGUAGE) {
						return (
							<link
								key={`link-alternate-${lang}`}
								rel="alternate"
								href={stripTrailingSlash(`${origin}${absolutePath}`)}
								hrefLang={lang}
							/>
						);
					}
					return (
						<link
							key={`link-alternate-${lang}`}
							rel="alternate"
							href={stripTrailingSlash(
								`${origin}/${lang}${absolutePath}`
							)}
							hrefLang={lang}
						/>
					);
				})}
		</Helmet>
	);
}
