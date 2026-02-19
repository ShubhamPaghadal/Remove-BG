import { SvgIcon } from '@mui/material';

export function CheckboxIcon(props) {
	return (
		<SvgIcon
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			{...props}
		>
			<rect
				x=".5"
				y=".5"
				width="15"
				height="15"
				rx="3.5"
				fill="#fff"
				stroke="#B8B8B8"
			/>
		</SvgIcon>
	);
}
