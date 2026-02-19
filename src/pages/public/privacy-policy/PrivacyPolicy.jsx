import { StaticPage } from '@/components/StaticPage';
import { useStaticTexts } from '@/components/StaticPage/hooks';
import { useTranslation } from 'react-i18next';

export function PrivacyPolicy() {
	const { t } = useTranslation();
	const { content, lastUpdate } = useStaticTexts('privacyPolicy');

	const title = t('pageTitles.privacyPolicy');

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
