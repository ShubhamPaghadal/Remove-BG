import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { Typography } from '@mui/material';
import { IMAGE_TTL_HOURS, STORAGE_DAYS } from '@/config';
import { useSelector } from 'react-redux';
import { useHasStorageCharge } from '@/hooks/user';

import { TimerTooltip } from './TimerTooltip';

dayjs.extend(durationPlugin);

export function Timer({ createdAt, tooltip, ...props }) {
	const hasStorageCharge = useHasStorageCharge();

	// get state to re-render every minute
	useSelector(state => state.myImages.minutes);

	if (!createdAt) {
		return null;
	}

	const ONE_DAY_IN_MINUTES = 24 * 60;
	const endOfLife = hasStorageCharge
		? dayjs.unix(createdAt).add(STORAGE_DAYS, 'days')
		: dayjs.unix(createdAt).add(IMAGE_TTL_HOURS, 'hours');
	const timeLeftDays = endOfLife.diff(dayjs(), 'days');
	const timeLeftMinutes = endOfLife.diff(dayjs(), 'minutes');
	const isMoreThanOneDay = timeLeftMinutes > ONE_DAY_IN_MINUTES;
	const duration = isMoreThanOneDay
		? `${timeLeftDays}d`
		: dayjs.duration(Math.max(timeLeftMinutes, 0), 'minutes').format('HH:mm');

	if (tooltip) {
		return (
			<TimerTooltip>
				<Typography {...props}>{duration}</Typography>
			</TimerTooltip>
		);
	}

	return <Typography {...props}>{duration}</Typography>;
}
