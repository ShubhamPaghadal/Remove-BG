import { SvgIcon } from '@mui/material';

export function MenuIcon(props) {
	return (
		<SvgIcon
			width="25"
			height="24"
			viewBox="0 0 25 24"
			fill="none"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.2262 11H21.2262V13H3.2262V11Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.2262 5H21.2262V7H3.2262V5Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.2262 17H21.2262V19H3.2262V17Z"
				fill="currentColor"
			/>
		</SvgIcon>
	);
}
