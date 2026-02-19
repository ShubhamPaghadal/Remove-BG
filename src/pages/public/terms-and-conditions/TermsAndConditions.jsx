import { StaticPage } from '@/components/StaticPage';
import { useStaticTexts } from '@/components/StaticPage/hooks';
import { useTranslation } from 'react-i18next';

export function TermsAndConditions() {
	const { t } = useTranslation();
	const { content, lastUpdate } = useStaticTexts('termsAndConditions');

	const title = t('pageTitles.termsAndConditions');

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
