import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stack, Box, Typography } from '@mui/material';
import { WarningIcon } from '@/components/Icons/WarningIcon';
import routes from '@/routes';
import { useAvailableCredits } from './hooks';

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

	return (
		<Stack
			direction="row"
			sx={{
				position: 'absolute',
				alignItems: 'center',
				top: '-68px',
				right: 0,
				borderRadius: 2,
				bgcolor: availableCredits === 0 ? '#FFC107' : '#F7F7F7',
				p: 0.5
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
			{availableCredits === 0 && (
				<Box sx={{ lineHeight: 0, mr: 1, ml: 0.5 }}>
					<WarningIcon />
				</Box>
			)}
			<Box
				sx={{
					bgcolor: '#fff',
					borderRadius: 2,
					height: '44px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 1,
					px: 2,
					minWidth: '277px',
					whiteSpace: 'nowrap'
				}}
			>
				<Text sx={{ minWidth: '4px' }}>{value}</Text>
				<Text color="text.secondary">{t('common.availableCredits')}</Text>
				<Text component={Link} color="primary.main" to={routes.billing}>
					{t('common.buyCredits')}
				</Text>
			</Box>
		</Stack>
	);
}
