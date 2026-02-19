import { CircleCheck } from '@/components/Icons';
import { Box, Typography } from '@mui/material';

function Chip({ className, text, ...props }) {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 1
			}}
			{...props}
		>
			<Box
				sx={theme => ({
					width: 28,
					height: 28,
					borderRadius: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: theme.palette.lime
				})}
			>
				<CircleCheck size={16} />
			</Box>
			<Typography variant="body1" component="span" fontWeight={700}>
				{text}
			</Typography>
		</Box>
	);
}

export default Chip;
