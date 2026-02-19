import { Trans } from 'react-i18next';

export function parseMessage(message) {
	if (message !== 'invalid_vat_number') {
		return message;
	}

	return (
		<Trans
			i18nKey="myAccount.taxInformation.invalidVAT"
			components={{
				anchor: (
					// eslint-disable-next-line jsx-a11y/anchor-has-content
					<a
						style={{ fontWeight: 'bold' }}
						target="_blank"
						rel="noopener noreferrer"
						href="https://ec.europa.eu/taxation_customs/vies/vatRequest.html"
					/>
				)
			}}
		/>
	);
}
