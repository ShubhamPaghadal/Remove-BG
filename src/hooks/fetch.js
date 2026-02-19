import { useEffect, useState } from 'react';

/**
 * Use this hook to fetch data from an endpoint on mount component
 * @param {Function} fetcher - Function to fetch data.
 * @param {Object} options
 * @param {boolean} options.lazy - If true, the fetch will be delayed until the first call.
 * @param {Function} options.onSuccess - Function to call when fetch is successful.
 * @param {Function} options.onError - Function to call when fetch fails.
 * @param {boolean} options.skip - If true, the fetch will be skipped.
 */
export function useFetch(
	fetcher,
	{ lazy = false, onSuccess, skip = false, onError } = {}
) {
	const [data, setData] = useState();
	const [error, setError] = useState();

	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);

	const fetch = (...args) => {
		setIsLoading(true);
		setIsSuccess(false);
		setIsError(undefined);

		fetcher(...args)
			.then(response => {
				setData(response);
				setIsSuccess(true);
			})
			.catch(e => {
				setError(e);
				setIsError(true);
			})
			.finally(() => {
				setIsLoading(false);
				setIsCompleted(true);
			});
	};

	useEffect(() => {
		if (!isCompleted && !skip && !lazy) {
			fetch();
		}
	}, [skip]);

	useEffect(() => {
		if (isSuccess) {
			onSuccess?.(data);
		}
	}, [isSuccess]);

	useEffect(() => {
		if (isError) {
			onError?.(error);
		}
	}, [isError]);

	return {
		data,
		error,
		fetch,
		isError,
		isLoading,
		isSuccess,
		isCompleted,
		setIsCompleted
	};
}

/**
 * Use this hook to fetch data from an endpoint on demand
 * @param {Object} options
 * @param {Function} options.fetcher - Function to fetch data.
 * @param {Function} options.onSuccess - Function to call when fetch is successful.
 * @param {Function} options.onError - Function to call when fetch fails.
 */
export function useLazyFetch(fetcher, { onSuccess, onError } = {}) {
	return useFetch(fetcher, {
		lazy: true,
		onSuccess,
		onError
	});
}
