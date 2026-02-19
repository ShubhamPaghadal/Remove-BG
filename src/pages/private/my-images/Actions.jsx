import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/IconButton';
import {
	ChevronLeftSmallIcon,
	ChevronRightSmallIcon
} from '@/components/Icons';
import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Radio } from '@/components/Radio';
import { getValueIfRtl, isRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import { PAGE_SIZES } from './constants';

function PageButton(props) {
	return (
		<IconButton
			variant="outlined"
			sx={{
				width: 32,
				height: 32,
				borderRadius: 2,
				borderWidth: 2,
				borderColor: 'divider',
				'&:hover': {
					borderWidth: 2
				}
			}}
			{...props}
		/>
	);
}

export function Actions({
	page,
	totalPages,
	onChangePage,
	onChangePageSize,
	pageSize
}) {
	const { t } = useTranslation();
	const isRTL = isRtl();

	return (
		<Box
			sx={theme => ({
				ml: { xs: 0, sm: removeValueIfRtl({ theme, value: 'auto' }) },
				mr: { xs: 0, sm: getValueIfRtl({ theme, value: 'auto' }) },
				display: 'flex',
				alignItems: 'center',
				justifyContent: {
					xs: 'space-between',
					sm: 'flex-start'
				}
			})}
		>
			<Select
				sx={theme => ({
					mr: '36px',
					height: '32px',
					fontSize: 12,
					'.MuiSelect-select': {
						py: '6px',
						pl: getValueIfRtl({
							theme,
							value: '40px',
							defaultValue: '12px'
						}),
						pr: getValueIfRtl({
							theme,
							value: '10px !important',
							defaultValue: '32px'
						})
					},
					'.MuiSelect-icon': {
						right: removeValueIfRtl({
							theme,
							value: '7px'
						}),
						left: getValueIfRtl({ theme, value: '7px' })
					}
				})}
				onChange={event => onChangePageSize(event.target.value)}
				value={pageSize}
				renderValue={value => t('myImages.quantity', { value })}
			>
				{PAGE_SIZES.map(value => (
					<MenuItem
						key={value}
						value={value}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							pl: 1,
							pr: 0,
							height: '28px'
						}}
					>
						{value}
						<Radio checked={value === pageSize} sx={{ mr: -0.5 }} />
					</MenuItem>
				))}
			</Select>
			<Typography
				sx={theme => ({ mr: 2, ml: getValueIfRtl({ theme, value: 2 }) })}
			>
				{t('myImages.pageCount', { page, totalPages })}
			</Typography>
			<Stack direction="row" spacing={1} useFlexGap>
				<PageButton
					variant="outlined"
					disabled={page === 1}
					onClick={() => onChangePage(page - 1)}
				>
					{isRTL ? (
						<ChevronRightSmallIcon sx={{ fontSize: 8 }} />
					) : (
						<ChevronLeftSmallIcon sx={{ fontSize: 8 }} />
					)}
				</PageButton>
				<PageButton
					variant="outlined"
					disabled={page === totalPages}
					onClick={() => onChangePage(page + 1)}
				>
					{isRTL ? (
						<ChevronLeftSmallIcon sx={{ fontSize: 8 }} />
					) : (
						<ChevronRightSmallIcon sx={{ fontSize: 8 }} />
					)}
				</PageButton>
			</Stack>
		</Box>
	);
}
