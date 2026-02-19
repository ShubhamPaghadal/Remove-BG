import { APP_BASE_URL } from '@/config';

export function redirectTo(route) {
	window.location.href = `${APP_BASE_URL}${route}`;
}
