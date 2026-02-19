import { StaticPage } from '@/components/StaticPage';
import { useStaticTexts } from '@/components/StaticPage/hooks';
import { useTranslation } from 'react-i18next';

export function GDPR() {
	const { t } = useTranslation();
	const { content, lastUpdate } = useStaticTexts('gdpr');

	const title = t('pageTitles.gdpr');

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
