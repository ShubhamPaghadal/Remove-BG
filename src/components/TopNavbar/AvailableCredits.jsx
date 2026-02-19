import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { useMedia } from '@/hooks/responsive';
import { useAvailableCredits } from '@/pages/private/editor/hooks';

function Text({ children, ...props }) {
	return (
		<Typography variant="body0" fontWeight="bold" {...props}>
			{children}
		</Typography>
	);
}

export function AvailableCredits() {
	const { t } = useTranslation();
	const { availableCredits, value, loading } = useAvailableCredits();
	const smDown = useMedia('smDown');

	return (
		<Box
			sx={{
				borderRadius: 1,
				bgcolor: availableCredits === 0 ? '#FFC107' : '#F7F7F7',
				p: 0.5,
				whiteSpace: 'nowrap',
				position: 'relative',
				height: smDown ? '20px' : '32px',
				display: 'flex',
				alignItems: 'center',
				px: smDown ? 1 : 2,
				gap: 0.5
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					bgcolor: '#fff',
					opacity: loading ? 0.4 : 0,
					pointerEvents: 'none',
					transition: 'opacity 0.3s ease-in-out'
				}}
			/>
			<Text sx={{ minWidth: '4px' }}>{value}</Text>
			<Text
				color={availableCredits === 0 ? 'text.primary' : 'text.secondary'}
			>
				{t(smDown ? 'common.credits' : 'common.availableCredits')}
			</Text>
		</Box>
	);
}
