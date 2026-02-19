const { VITE_COOKIE_DOMAIN, VITE_BASE_URL } = import.meta.env;

const COOKIE_DOMAIN =
	VITE_COOKIE_DOMAIN ||
	new URL(VITE_BASE_URL || window.location.origin).hostname;

export function getCookie(name) {
	const cookies = document.cookie.split(';');
	const cookie = cookies.find(currentCookie =>
		currentCookie.trim().startsWith(`${name}=`)
	);
	return cookie ? cookie.split('=')[1] : null;
}

export function setCookie(
	name,
	value,
	{ expirationDays, sameSite = 'Strict' } = {}
) {
	let expires = '';
	if (expirationDays) {
		const date = new Date();
		date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
		expires = `; expires=${date.toUTCString()}`;
	}

	document.cookie = `${name}=${value}${expires}; domain=${COOKIE_DOMAIN}; path=/; SameSite=${sameSite}`;
}

export function invalidateCookie(name) {
	const pastDate = new Date(0).toUTCString();

	document.cookie = `${name}=; expires=${pastDate}; domain=${COOKIE_DOMAIN}; path=/;`;
}
