import { SvgIcon } from '@mui/material';

export function ChevronUpIcon({ size = 24, sx = {}, ...props }) {
	return (
		<SvgIcon
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			sx={{ ...sx, fontSize: size }}
			{...props}
		>
			<path
				d="M7 14.4999L11.9683 9.49988L17 14.4999"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			/>
		</SvgIcon>
	);
}
