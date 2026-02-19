import { Box } from '@mui/material';
import { RadioIcon } from './RadioIcon';

export function RadioIconChecked({ color, ...rest }) {
	return (
		<Box
			component={RadioIcon}
			sx={{
				backgroundColor: `${color}.main`,
				border: '1px solid',
				borderColor: `${color}.main`,

				'&::before': {
					display: 'block',
					width: 12,
					height: 12,
					backgroundImage:
						'radial-gradient(#fff,#fff 30%,transparent 40%)',
					content: '""'
				},

				'input:hover ~ &': {
					backgroundColor: `${color}.dark`,
					borderColor: `${color}.dark`
				}
			}}
			{...rest}
		/>
	);
}
