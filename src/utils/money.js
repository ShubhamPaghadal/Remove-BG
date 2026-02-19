const currencyLocale = {
	EUR: 'es',
	USD: 'en'
};

const defaultCurrency = 'usd';

export const zeroDecimalCurrencies = [
	'bif',
	'clp',
	'djf',
	'gnf',
	'jpy',
	'kmf',
	'krw',
	'mga',
	'pyg',
	'rwf',
	'ugx',
	'vnd',
	'vuv',
	'xaf',
	'xof',
	'xpf'
];

export function formatPrice({
	amount,
	currency,
	fraction: customFraction = 2
}) {
	const fraction = customFraction;
	const isZDCurrency = zeroDecimalCurrencies.includes(currency);
	const price = isZDCurrency ? amount : parseInt(amount, 10) / 100;
	currency = currency || defaultCurrency;

	const isoCurrency = currency?.toUpperCase();

	if (Number.isNaN(price)) {
		return '';
	}

	const locale = navigator.language || currencyLocale[isoCurrency] || 'en';

	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: isoCurrency,
		minimumFractionDigits: isZDCurrency ? 0 : fraction
	}).format(price);
}

export function formatPriceWithCurrency({
	amount,
	currency,
	fraction: customFraction = 2
}) {
	const fraction = customFraction;
	const isZDCurrency = zeroDecimalCurrencies.includes(currency);
	const price = isZDCurrency ? amount : parseInt(amount, 10) / 100;
	currency = currency || defaultCurrency;

	const isoCurrency = currency?.toUpperCase();

	if (Number.isNaN(price)) {
		return { price: '', currency: '' };
	}

	const locale = navigator.language || currencyLocale[isoCurrency] || 'en';

	const formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: isoCurrency,
		minimumFractionDigits: isZDCurrency ? 0 : fraction
	});

	const parts = formatter.formatToParts(price);
	const pricePart = parts
		.filter(
			part =>
				part.type === 'integer' ||
				part.type === 'decimal' ||
				part.type === 'fraction' ||
				part.type === 'group'
		)
		.map(part => part.value)
		.join('');
	const currencyPart = parts.find(part => part.type === 'currency').value;

	return {
		price: pricePart,
		currency: currencyPart
	};
}
