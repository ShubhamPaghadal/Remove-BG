import { CircleCheck } from '@/components/Icons';
import { Box, Stack, Typography } from '@mui/material';

function DetailItem({ title, description }) {
	if (!title && !description) {
		return null;
	}

	return (
		<Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
			<CircleCheck />

			<Stack>
				{title && (
					<Typography
						variant="body0"
						fontWeight={500}
						className="text-xs font-semibold"
					>
						{title}
					</Typography>
				)}

				{description && (
					<Typography variant="body0" color="text.secondary">
						{description}
					</Typography>
				)}
			</Stack>
		</Box>
	);
}

export default DetailItem;
