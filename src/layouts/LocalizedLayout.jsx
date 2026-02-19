import { Outlet, useParams } from 'react-router-dom';
import { supportedLanguages } from '@/i18next';
import NotFound from '@/pages/NotFound';

export function LocalizedLayout() {
	const { lang } = useParams();

	if (lang && !supportedLanguages.includes(lang)) {
		return <NotFound />;
	}

	return <Outlet />;
}
