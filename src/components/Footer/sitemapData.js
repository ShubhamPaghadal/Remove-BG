import { SITE_NAME } from '@/config';
import routes from '@/routes';

export default [
	{
		title: SITE_NAME,
		links: [
			{ labelKey: 'pageTitles.pricing', to: routes.pricing },
			{ labelKey: 'footer.contact', to: routes.contact },
			{ labelKey: 'pageTitles.unsubscribe', to: routes.unsubscribe }
		]
	},
	{
		titleKey: 'footer.company',
		links: [
			{
				labelKey: 'footer.termsAndConditions',
				to: routes.termsAndConditions
			},
			{
				labelKey: 'pageTitles.privacyPolicy',
				to: routes.privacyPolicy
			},
			{
				labelKey: 'pageTitles.cookiesPolicy',
				to: routes.cookiesPolicy
			},
			{
				labelKey: 'footer.faq',
				to: routes.faq
			},
			{
				labelKey: 'footer.gdpr',
				to: routes.gdpr
			}
		]
	}
];
