import { useEffect, useState } from 'react';

import {
	Box,
	Button,
	Dialog,
	dialogClasses,
	DialogContent,
	Divider
} from '@mui/material';
import { DayPicker } from 'react-day-picker';
import { alpha, styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { useMedia } from '@/hooks/responsive';

import 'react-day-picker/dist/style.css';

const ONE_YEAR = 365;

export function DatesRangePicker({
	fetchHistory,
	fetchStats,
	dates,
	setDates,
	open,
	setOpen,
	setInputValue
}) {
	const [selectedDates, setSelectedDates] = useState(undefined);
	const { t } = useTranslation();
	const mdDown = useMedia('mdDown');

	function handleCancelDateSelection() {
		if (
			dates &&
			selectedDates &&
			Object.entries(dates).toString() !==
				Object.entries(selectedDates).toString()
		) {
			setSelectedDates(dates);
		}

		setOpen(false);
	}

	function handleAcceptClick() {
		const { from, to } = selectedDates;
		const fromStartOfDay = dayjs(from).startOf('day').toDate();
		const toEndOfDay = dayjs(to).endOf('day').toDate();

		if (!selectedDates || !from || !to) {
			setInputValue('');
		} else {
			setDates({ from: fromStartOfDay, to: toEndOfDay });
			setSelectedDates({ from: fromStartOfDay, to: toEndOfDay });
			setInputValue(
				`${dayjs(from).format('DD/MM/YYYY')} - ${dayjs(to).format('DD/MM/YYYY')}`
			);
			fetchHistory({
				from: dayjs(fromStartOfDay).unix(),
				to: dayjs(toEndOfDay).unix()
			});
			fetchStats({
				from: dayjs(fromStartOfDay).unix(),
				to: dayjs(toEndOfDay).unix()
			});
		}

		setOpen(false);
	}

	useEffect(() => {
		if (dates)
			setSelectedDates({
				from: new Date(dates.from),
				to: new Date(dates.to)
			});
	}, [dates]);

	return (
		<CalendarWrapper>
			<Dialog
				open={open}
				onClose={handleCancelDateSelection}
				sx={{
					[`.${dialogClasses.paper}`]: {
						maxWidth: 'fit-content',
						overflow: 'hidden'
					},
					direction: 'ltr'
				}}
			>
				<DialogContent sx={{ padding: 3 }}>
					<CalendarWrapper>
						<DayPicker
							initialFocus
							mode="range"
							numberOfMonths={mdDown ? 1 : 2}
							onSelect={setSelectedDates}
							selected={selectedDates}
							max={ONE_YEAR}
						/>
					</CalendarWrapper>
					<Divider style={{ marginTop: '20px' }} />
					<Box display="flex" justifyContent="space-between" mt={2}>
						<Button
							onClick={handleCancelDateSelection}
							variant="outlined"
						>
							{t('common.cancel')}
						</Button>
						<Button
							disabled={!selectedDates?.from || !selectedDates?.to}
							onClick={handleAcceptClick}
							variant="contained"
						>
							{t('common.accept')}
						</Button>
					</Box>
				</DialogContent>
			</Dialog>
		</CalendarWrapper>
	);
}

const CalendarWrapper = styled('div')(({ theme }) => {
	const rangeBgColor = alpha(theme.palette.primary.main, 0.15);

	return {
		'& .rdp-row:not(:first-of-type):not(:last-child)': {
			border: '2px solid white',
			borderRight: 0,
			borderLeft: 0
		},
		'& .rdp-cell:has(.rdp-day_selected.rdp-day_today)': {
			backgroundColor: rangeBgColor
		},
		'& .rdp-cell:has(.rdp-day_range_start)': {
			background: `linear-gradient(to right, white 50%, ${rangeBgColor} 50%) !important`
		},
		'& .rdp-cell:has(.rdp-day_range_end)': {
			background: `linear-gradient(to left, white 50%, ${rangeBgColor} 50%) !important`
		},
		'& .rdp-cell:has(.rdp-day_range_end.rdp-day_range_start)': {
			background: 'none'
		},
		'& .rdp-day_today': {
			border: '1px solid black !important',
			borderRadius: '50% !important'
		},
		'& .rdp-day_selected': {
			'&.rdp-day_range_start, &.rdp-day_range_end': {
				backgroundColor: `${theme.palette.primary.main} !important`,
				borderRadius: '50% !important'
			},
			'&.rdp-day_range_middle': {
				backgroundColor: rangeBgColor,
				color: theme.palette.text.primary
			}
		},
		'& .rdp-cell:first-of-type .rdp-day_selected.rdp-day_range_middle': {
			borderTopLeftRadius: '50%',
			borderBottomLeftRadius: '50%'
		},
		'& .rdp-cell:last-child .rdp-day_selected.rdp-day_range_middle': {
			borderTopRightRadius: '50%',
			borderBottomRightRadius: '50%'
		}
	};
});
