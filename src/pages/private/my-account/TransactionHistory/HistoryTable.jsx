import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { Pagination } from '@/components/Pagination';
import { useMedia } from '@/hooks/responsive';
import { reverseRightLeft } from '@/utils/rtlStyle';

const columns = ['date', 'description', 'credits'];
const i18nPath = 'myAccount.txHistory.table';
const tableDateFormat = 'MMM DD, YYYY - HH:mm';

function getCreditsValue(type, credits) {
	const negativeCreditStates = ['ai-bg', 'download-high-quality', 'rollback'];

	return negativeCreditStates.some(state => state === type)
		? Math.abs(credits) * -1
		: credits;
}

export function HistoryTable({
	dates,
	fetchHistory,
	page,
	pagesTotal,
	rows,
	setPage
}) {
	const mdDown = useMedia('mdDown');

	function handlePageChange(pageNumber) {
		fetchHistory({
			from: dayjs(dates?.from).unix(),
			to: dayjs(dates?.to).unix(),
			page: pageNumber
		});
		setPage(pageNumber);
	}

	if (mdDown)
		return (
			<MobileTxsList
				page={page}
				pagesTotal={pagesTotal}
				rows={rows}
				setPage={handlePageChange}
			/>
		);

	return (
		<DesktopTxsTable
			columns={columns}
			page={page}
			pagesTotal={pagesTotal}
			rows={rows}
			setPage={handlePageChange}
		/>
	);
}

function DesktopTxsTable({ page, pagesTotal, rows, setPage }) {
	const { t } = useTranslation();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'end',
				marginTop: '48px !important'
			}}
		>
			<TableContainer>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{columns.map((columnLabel, idx) => (
								<TableCell
									key={idx}
									sx={{
										'&:last-of-type': {
											width: '30%'
										},
										padding: '0 0 8px',
										width: '35%'
									}}
									align={reverseRightLeft({ direction: 'left' })}
								>
									<Typography
										fontWeight="bold"
										variant="body0"
										sx={theme => ({
											color: theme.palette.text.secondary
										})}
									>
										{t(`${i18nPath}.headers.${columnLabel}`)}
									</Typography>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows?.map((row, idx) => (
							<TableRow key={`${idx}-${row.transactionId}`}>
								<TableCell
									component="th"
									scope="row"
									sx={theme => ({
										color: theme.palette.text.secondary,
										width: '20%'
									})}
									align={reverseRightLeft({ direction: 'left' })}
								>
									{`${dayjs.unix(row.date).format(tableDateFormat)}hs`}
								</TableCell>
								<TableCell
									sx={theme => ({
										color: theme.palette.text.secondary,
										paddingLeft: 0,
										paddingRight: 0,
										width: '35%'
									})}
									align={reverseRightLeft({ direction: 'left' })}
								>
									{t(`${i18nPath}.descriptions.${row.type}`, {
										qty: row.credits
									})}
								</TableCell>
								<TableCell
									sx={theme => ({
										color: theme.palette.text.secondary,
										paddingLeft: 0,
										paddingRight: 0,
										width: '30%'
									})}
									align={reverseRightLeft({ direction: 'left' })}
								>
									{getCreditsValue(row.type, row.credits)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{pagesTotal > 1 && (
				<Pagination
					count={pagesTotal}
					page={page}
					onChange={(_, value) => setPage(value)}
					sx={{ marginTop: '20px !important' }}
				/>
			)}
		</Box>
	);
}

function MobileTxsList({ page, pagesTotal, rows, setPage }) {
	const { t } = useTranslation();

	return (
		<Box display="flex" gap={1} flexDirection="column">
			{rows.map((row, idx) => (
				<Box
					key={`${idx}-${row.transactionId}`}
					sx={theme => ({
						borderBottom: `1px solid ${theme.palette.text.disabled}`,
						'&:first-of-type': {
							borderTop: `1px solid ${theme.palette.text.disabled}`
						},
						padding: '20px 0'
					})}
				>
					<Typography>
						{`${dayjs.unix(row.date).format(tableDateFormat)}hs`}
					</Typography>
					<Typography>
						{t(`${i18nPath}.descriptions.${row.type}`)}
					</Typography>
					<Typography>
						{t(`${i18nPath}.mobileCredits`, {
							credits: getCreditsValue(row.type, row.credits)
						})}
					</Typography>
				</Box>
			))}
			{pagesTotal > 1 && (
				<Pagination
					count={pagesTotal}
					page={page}
					onChange={(_, value) => setPage(value)}
					sx={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '20px !important'
					}}
				/>
			)}
		</Box>
	);
}
