import { SvgIcon } from '@mui/material';

export function AddIcon(props) {
	return (
		<SvgIcon
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			{...props}
		>
			<path
				d="M11.25 12.75H5.5V11.25H11.25V5.5H12.7499V11.25H18.5V12.75H12.7499V18.5H11.25V12.75Z"
				fill="currentColor"
			/>
		</SvgIcon>
	);
}
