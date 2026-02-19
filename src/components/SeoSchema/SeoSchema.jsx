import { Helmet } from 'react-helmet';

const getSafeString = data => {
	try {
		return JSON.stringify(data);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn('SEOSchema error:', error);
		return '{}';
	}
};

export function SEOSchema({ data }) {
	if (!data) return null;

	return (
		<Helmet defer={false}>
			<script type="application/ld+json">{getSafeString(data)}</script>
		</Helmet>
	);
}
