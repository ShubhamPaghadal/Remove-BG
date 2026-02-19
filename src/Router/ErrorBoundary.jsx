import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';

function ErrorBoundary() {
	const error = useRouteError();
	const { t } = useTranslation();

	return (
		<div>
			<h2>{t('errors.generic')}</h2>
			{import.meta.env.DEV && <p>{error?.message}</p>}
			<button type="button" onClick={() => window.location.reload(true)}>
				{t('common.refresh')}
			</button>
		</div>
	);
}

export default ErrorBoundary;
