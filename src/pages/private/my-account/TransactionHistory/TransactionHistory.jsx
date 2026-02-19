import { useEffect, useState } from 'react';

import { Box, CircularProgress, OutlinedInput } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { CalendarIcon } from '@/components/Icons';
import { showError } from '@/utils';
import { useFetch } from '@/hooks/fetch';
import { useMedia } from '@/hooks/responsive';
import transactionModel from '@/models/transaction';

import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import { Section } from '../Section';
import { DatesRangePicker } from './DatesRangePicker';
import { EmptyState } from './EmptyState';
import { HistoryTable } from './HistoryTable';
import { StatsChart } from './StatsChart';

export function TransactionHistory() {
	const [confirmedDates, setConfirmedDates] = useState(undefined);
	const [inputValue, setInputValue] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [page, setPage] = useState(1);
	const { t } = useTranslation();
	const mdDown = useMedia('mdDown');

	const {
		fetch: fetchHistory,
		data: { data: history, pageSize, totalPages = 1 } = {},
		isLoading: isHistoryLoading
	} = useFetch(transactionModel.getHistory.bind(transactionModel), {
		onError: showError
	});

	const {
		fetch: fetchStats,
		data: stats,
		isStatsLoading
	} = useFetch(transactionModel.getHistoryStats.bind(transactionModel), {
		onError: showError
	});

	useEffect(() => {
		const dateFrom = dayjs().subtract(30, 'day').startOf('day').toDate();
		const dateTo = dayjs().endOf('day').toDate();

		if (!confirmedDates) {
			setConfirmedDates({
				from: dateFrom,
				to: dateTo
			});
			setInputValue(
				`${dayjs(dateFrom).format('DD/MM/YYYY')} - ${dayjs(dateTo).format('DD/MM/YYYY')}`
			);
		}
	}, []);

	function handleInputClick() {
		setIsDialogOpen(true);
	}

	const hasTxData = Boolean(history?.length && stats?.length);

	if (isHistoryLoading || isStatsLoading)
		return (
			<Box textAlign="center">
				<CircularProgress />
			</Box>
		);

	return (
		<Section
			title={t('myAccount.txHistory.sectionTitle')}
			titleAction={
				<OutlinedInput
					endAdornment={<CalendarIcon />}
					onClick={handleInputClick}
					readOnly
					value={inputValue}
					sx={theme => ({
						cursor: 'pointer',
						height: '40px',
						input: { cursor: 'pointer' },
						marginBottom: mdDown ? 3 : 0,
						width: mdDown ? '100%' : '240px',
						'&& .MuiSvgIcon-root': {
							right: removeValueIfRtl({
								theme,
								value: '7px'
							}),
							left: getValueIfRtl({ theme, value: '7px' }),
							position: 'absolute'
						}
					})}
				/>
			}
		>
			{!hasTxData && <EmptyState onClick={handleInputClick} />}
			{hasTxData && (
				<>
					<StatsChart stats={stats} />
					<HistoryTable
						dates={confirmedDates}
						fetchHistory={fetchHistory}
						page={page}
						pageSize={pageSize}
						pagesTotal={totalPages}
						rows={history}
						setPage={setPage}
					/>
				</>
			)}
			<DatesRangePicker
				dates={confirmedDates}
				fetchHistory={fetchHistory}
				fetchStats={fetchStats}
				open={isDialogOpen}
				setDates={setConfirmedDates}
				setInputValue={setInputValue}
				setOpen={setIsDialogOpen}
			/>
		</Section>
	);
}
