import { SvgIcon } from '@mui/material';

export function ChevronLeftIcon(props) {
	return (
		<SvgIcon
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			{...props}
		>
			<path
				d="M14.5 7L9.5 11.9683L14.5 17"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			/>
		</SvgIcon>
	);
}
