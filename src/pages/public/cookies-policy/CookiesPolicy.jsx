import { StaticPage } from '@/components/StaticPage';
import { useStaticTexts } from '@/components/StaticPage/hooks';
import { useTranslation } from 'react-i18next';

export function CookiesPolicy() {
	const { t } = useTranslation();
	const { content, lastUpdate } = useStaticTexts('cookiesPolicy');

	const title = t('pageTitles.cookiesPolicy');

	return (
		<StaticPage
			metaTitle={title}
			title={title}
			description={lastUpdate}
			content={content}
			legal
		/>
	);
}
