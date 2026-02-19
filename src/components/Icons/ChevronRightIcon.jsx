import { SvgIcon } from '@mui/material';

export function ChevronRightIcon(props) {
	return (
		<SvgIcon
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			{...props}
		>
			<path
				d="M9.5 7L14.5 11.9683L9.5 17"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			/>
		</SvgIcon>
	);
}
