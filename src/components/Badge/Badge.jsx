import { Chip } from '@mui/material';

export function Badge({ label, sx, ...props }) {
	return (
		<Chip
			sx={{
				backgroundColor: 'text.primary',
				border: '1px solid #000',
				boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
				color: '#FFF',
				fontSize: 14,
				fontWeight: 700,
				lineHeight: '24px',
				width: 'fit-content',

				...sx
			}}
			label={label}
			{...props}
		/>
	);
}
