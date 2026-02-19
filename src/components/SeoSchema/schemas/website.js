import { DOMAIN, SITE_NAME } from '@/config';

export const websiteSchema = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: SITE_NAME,
	url: `https://${DOMAIN}/`
};
