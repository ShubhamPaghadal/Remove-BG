import { Pagination as MuiPagination, PaginationItem } from '@mui/material';
import { isRtl } from '@/utils/rtlStyle';
import { ChevronLeftSmallIcon, ChevronRightSmallIcon } from '../Icons';

function PreviousIcon({ sx, props }) {
	return (
		<ChevronLeftSmallIcon
			sx={{ ...sx, '&.MuiSvgIcon-root': { fontSize: 8 } }}
			{...props}
		/>
	);
}

function NextIcon({ sx, ...props }) {
	return (
		<ChevronRightSmallIcon
			sx={{ ...sx, '&.MuiSvgIcon-root': { fontSize: 8 } }}
			{...props}
		/>
	);
}

export function Pagination(props) {
	const { changeInRtl = true } = props;
	const isRtlValue = isRtl();
	const previous = changeInRtl && isRtlValue ? NextIcon : PreviousIcon;
	const next = changeInRtl && isRtlValue ? PreviousIcon : NextIcon;

	return (
		<MuiPagination
			renderItem={item => (
				<PaginationItem slots={{ previous, next }} {...item} />
			)}
			{...props}
		/>
	);
}
