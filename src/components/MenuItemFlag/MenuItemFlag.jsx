import { Box, Typography } from '@mui/material';

export function MenuItemFlag({ text, bgColor = '#DFF265' }) {
	return (
		<Box
			sx={{
				lineHeight: '16px',
				padding: '0px 2.5px',
				textAlign: 'center',
				borderRadius: 1,
				background: bgColor
			}}
		>
			<Typography variant="body0" color="text.primary" fontWeight={700}>
				{text}
			</Typography>
		</Box>
	);
}
