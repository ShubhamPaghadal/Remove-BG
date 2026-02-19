import { Box } from '@mui/material';

export function RadioIcon({ color, ...rest }) {
	return (
		<Box
			component="span"
			sx={{
				borderRadius: '50%',
				width: 14,
				height: 14,
				border: '1px solid',
				borderColor: '#B8B8B8',
				backgroundColor: 'transparent',

				'input:hover ~ &': {
					backgroundColor: 'neutral.100'
				},
				'input:disabled ~ &': {
					boxShadow: 'none',
					backgroundColor: 'neutral.200'
				}
			}}
			{...rest}
		/>
	);
}
