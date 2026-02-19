import { Box, Stack, Typography } from '@mui/material';

export function StepIndicator({ dotSx, label, sx, ...props }) {
	return (
		<Box
			{...props}
			sx={{
				...sx,
				border: '1px solid #B8B8B8',
				borderRadius: 1,
				px: 1,
				py: 0.25
			}}
		>
			<Stack
				direction="row"
				alignItems="center"
				width="100%"
				spacing={0.5}
				useFlexGap
			>
				<Box
					width={8}
					height={8}
					bgcolor="primary.main"
					borderRadius="50%"
					sx={dotSx}
				/>

				<Typography variant="body2" color="text.secondary">
					{label}
				</Typography>
			</Stack>
		</Box>
	);
}
