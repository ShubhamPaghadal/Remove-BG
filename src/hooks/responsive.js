import { useMediaQuery, useTheme } from '@mui/material';

/**
 *
 * @param {String} breakpoint - key and condition
 * @returns {Bool}
 * @example
 * const mdUp = useMedia('mdUp');
 * <Button width={mdUp ? 500 : 400} />
 */
export function useMedia(breakpoint) {
	const currentTheme = useTheme();
	const breakPointRegex = /^(xs|sm|md|lg|xl)(Up|Down)?$/;

	if (!breakPointRegex.test(breakpoint)) throw new Error('Invalid breakpoint');

	const [, key, method] = breakpoint.match(breakPointRegex);
	const parsedMethod = method ? method.toLowerCase() : 'only';

	return useMediaQuery(currentTheme.breakpoints[parsedMethod](key), {
		noSsr: true
	});
}
