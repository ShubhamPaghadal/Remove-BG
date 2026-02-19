import { SvgIcon } from '@mui/material';

export function CloseIcon(props) {
	return (
		<SvgIcon
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6.06055 5.00012L18.7885 17.728L17.7278 18.7887L4.99989 6.06078L6.06055 5.00012Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.06055 18.0001L17.7885 5.2722L18.8491 6.33286L6.12121 19.0608L5.06055 18.0001Z"
				fill="currentColor"
			/>
		</SvgIcon>
	);
}
