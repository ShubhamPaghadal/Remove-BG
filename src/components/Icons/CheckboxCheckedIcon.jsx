import { SvgIcon } from '@mui/material';

export function CheckboxCheckedIcon(props) {
	return (
		<SvgIcon
			width="16"
			height="16"
			fill="none"
			viewBox="0 0 16 16"
			{...props}
		>
			<rect
				x=".5"
				y=".5"
				width="15"
				height="15"
				rx="3.5"
				fill="#A182F3"
				stroke="#A182F3"
			/>
			<g clipPath="url(#a)">
				<path d="m4 7.5 3 3 5-5" stroke="#fff" strokeWidth="2" />
			</g>
			<defs>
				<clipPath id="a">
					<path fill="#fff" d="M0 0h16v16H0z" />
				</clipPath>
			</defs>
		</SvgIcon>
	);
}
