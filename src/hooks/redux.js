import { shallowEqual, useSelector } from 'react-redux';

export function useShallowSelector(selector) {
	return useSelector(selector, shallowEqual);
}
