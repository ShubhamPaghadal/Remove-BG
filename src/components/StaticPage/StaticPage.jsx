import { useSelector } from 'react-redux';
import { useLanguage } from '@/hooks';
import { Page } from '@/components/Page';
import { Box, CircularProgress } from '@mui/material';
import { DOMAIN, PHONE, SITE_NAME, SUPPORT_EMAIL } from '@/config';
import routes from '@/routes';
import { useTranslation } from 'react-i18next';

import { Hero } from './Hero';
import { Container } from './styles';
import { getLink, mailTo } from './utils';
import {
	AEPD_URL,
	KNOW_YOUR_RIGHTS_URL,
	EXTERNAL_LINKS
} from './external-links';

export function StaticPage({
	metaTitle,
	title,
	description,
	children,
	content,
	legal,
	...rest
}) {
	const legalsReady = useSelector(state => state.auth.legalsReady);
	const locale = useLanguage();
	const { t } = useTranslation();

	const websiteLink = getLink(`https://${DOMAIN}`);
	const privacyPolicyLink = getLink(
		routes.privacyPolicy,
		t('pageTitles.privacyPolicy')
	);
	const cookiesPolicyLink = getLink(
		routes.cookiesPolicy,
		t('pageTitles.cookiesPolicy')
	);
	const supportLink = mailTo(SUPPORT_EMAIL);

	const aepdLink = AEPD_URL[locale] || AEPD_URL.en;
	const knowYourRightsLink =
		KNOW_YOUR_RIGHTS_URL[locale] || KNOW_YOUR_RIGHTS_URL.en;

	const replacements = {
		websiteLink,
		supportLink,
		privacyPolicyLink,
		cookiesPolicyLink,
		phone: PHONE,
		siteName: SITE_NAME,
		siteNameUpper: SITE_NAME.toUpperCase(),
		domain: DOMAIN,
		fullSite: window.location.origin,
		aepdLink,
		knowYourRightsLink,
		externalLinks: EXTERNAL_LINKS
	};

	const formattedContent = content.replace(
		/{([^{}:]+)(?::\s*([^{}:]+))?}/g,
		(match, p1, p2) => {
			if (p2) {
				return replacements.externalLinks[p2] || match;
			}
			return replacements[p1] || match;
		}
	);

	if (legal && !legalsReady) {
		return (
			<Page title={title} {...rest}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						height: '100%',
						minHeight: '50vh'
					}}
				>
					<CircularProgress size={30} />
				</Box>
			</Page>
		);
	}

	return (
		<Page title={metaTitle} {...rest}>
			<Hero title={title} description={description} />
			{content ? (
				<Container
					maxWidth="lg"
					sx={{
						pt: { xs: 3, sm: 7 },
						pb: { xs: 7.5, sm: 13 }
					}}
				>
					{/* eslint-disable-next-line */}
					<div dangerouslySetInnerHTML={{ __html: formattedContent }} />
				</Container>
			) : (
				children
			)}
		</Page>
	);
}
