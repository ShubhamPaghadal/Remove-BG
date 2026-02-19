import { reloadMinutes } from '@/store/myImages';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export function MinutesHelper() {
	const dispatch = useDispatch();

	useEffect(() => {
		const interval = setInterval(() => {
			dispatch(reloadMinutes());
		}, 1000 * 60);

		return () => clearInterval(interval);
	}, []);
}
