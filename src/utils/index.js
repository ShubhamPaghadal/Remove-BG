import dayjs from 'dayjs';

export * from './money';
export * from './snackbar';
export * from './image';
export * from './style';
export * from './locale';
export * from './vips';
export * from './url';
export * from './device';
export * from './cookie';
export * from './number';

/**
 * @param {string} string
 * @return {string}
 * @example
 * capitalize('enero 2021') // Enero 2021
 */
export function capitalize([first = '', ...rest]) {
	return `${first.toUpperCase()}${rest.join('')}`;
}

export function toCamelCase(string) {
	return string.replace(/[_-]([a-z])/g, letter => letter[1].toUpperCase());
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have
 * elapsed since the last time the debounced function was invoked.
 * @param {function} fn - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {function} The new debounced function.
 */
export function debounce(fn, wait) {
	let timerID;
	function debounced(...params) {
		const context = this;

		clearTimeout(timerID);
		timerID = setTimeout(fn.bind(context), wait, ...params);
	}

	return debounced;
}

/**
 * Creates a promise function that delays invoking func.
 * @param {function} fn - The function to debounce.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {function} The new debounced function.
 */
export function delay(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

export function throttle(fn, wait) {
	let throttleTimer;

	const throttleFn = (...params) => {
		if (throttleTimer) return;

		throttleTimer = true;
		setTimeout(
			() => {
				fn(...params);
				throttleTimer = false;
			},
			wait,
			...params
		);
	};

	return throttleFn;
}

export function hasPassedDays(from, numDays) {
	const fromDate = dayjs.unix(from);
	const daysAgo = dayjs().subtract(numDays, 'day');

	return fromDate.isBefore(daysAgo);
}
