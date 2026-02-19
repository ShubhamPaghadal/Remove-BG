import { getCookie } from '@/utils';

export function getCurrencyParam(searchParams) {
	return searchParams.get('currency')?.toLowerCase();
}

export function getInitialCurrency() {
	const searchParams = new URLSearchParams(window.location.search);
	const currencyParam = getCurrencyParam(searchParams);
	const cookieCurrency = getCookie('currency');
	// previous implementation used localStorage instead of cookie
	const localStorageCurrency = localStorage.getItem('currency');

	return currencyParam ?? cookieCurrency ?? localStorageCurrency ?? '';
}
