import billingModel from '@/models/billing';
import { TAX_PAYER_TYPE } from '@/config';

const vatValidationCache = {};

const euCountries = [
	'at',
	'be',
	'bg',
	'cy',
	'cz',
	'de',
	'dk',
	'ee',
	'el',
	'gr',
	'fi',
	'fr',
	'hr',
	'hu',
	'ie',
	'it',
	'lt',
	'lu',
	'lv',
	'mt',
	'nl',
	'pl',
	'pt',
	'ro',
	'se',
	'si',
	'sk'
];

export const vatMapping = {
	gr: 'EL'
};

export function requiresVat({ country, type }) {
	const isSpain = country === 'es';
	const isFromEU = euCountries.includes(country);

	return !isSpain && isFromEU && type === TAX_PAYER_TYPE.COMPANY;
}

export function requiresTaxId(country) {
	return country === 'es';
}

function asyncDebounce(fn, wait) {
	let timerID;
	function debounced(...params) {
		clearTimeout(timerID);
		return new Promise((resolve, reject) => {
			timerID = setTimeout(() => fn(...params).then(resolve, reject), wait);
		});
	}

	return debounced;
}

export const fetchValidateVat = asyncDebounce(async value => {
	if (Object.hasOwn(vatValidationCache, value)) {
		return vatValidationCache[value];
	}

	try {
		await billingModel.validateVat(value);
		vatValidationCache[value] = true;
		return true;
	} catch (error) {
		if (error.data?.errorCode === 'invalid_vat') {
			vatValidationCache[value] = false;
			return false;
		}

		throw error;
	}
}, 300);

export function validateVatPrefix(t) {
	return (value, { parent, createError }) => {
		if (!value) {
			return true;
		}
		const { country } = parent;
		const vatPrefix = vatMapping[country] || country.toUpperCase();

		if (value.toUpperCase().startsWith(vatPrefix)) {
			return true;
		}

		return createError({
			path: 'vatNumber',
			message: t('myAccount.taxInformation.invalidVATPrefix', {
				prefix: vatPrefix
			})
		});
	};
}

export function validateVat(t) {
	return async (value, { createError }) => {
		if (!value) {
			return true;
		}

		try {
			const result = await fetchValidateVat(value);

			if (result) {
				return true;
			}

			return createError({
				path: 'vatNumber',
				message: 'invalid_vat_number'
			});
		} catch (error) {
			return createError({
				path: 'vatNumber',
				message: t('errors.generic')
			});
		}
	};
}
