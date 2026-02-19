import { formatPrice } from '@/utils';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function CurrentPlan({ currentPlan }) {
	const { t } = useTranslation();

	return (
		<Box
			sx={theme => ({
				borderRadius: 2,
				border: 1,
				borderColor: 'primary.main',
				display: 'flex',
				justifyContent: 'space-between',
				px: 3,
				py: 2.5,
				mt: 3,
				alignItems: 'center',
				boxShadow: '0px 2px 4px 0px rgba(161, 130, 243, 0.50)',
				[theme.breakpoints.down('sm')]: {
					px: 2,
					py: 2,
					mt: 2,
					flexDirection: 'column',
					alignItems: 'flex-start',
					gap: '2px'
				}
			})}
		>
			<Typography fontWeight="bold">
				{t('billing.yourCurrentPlan')}
			</Typography>
			{currentPlan && (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: { xs: 1.5, sm: 4 },
						justifyContent: {
							xs: 'space-between',
							sm: 'flex-start'
						}
					}}
				>
					<Box sx={{ display: 'flex', gap: 1 }}>
						{currentPlan.name === 'trial' && (
							<Typography fontWeight="bold" color="text.secondary">
								{t('plans.trial.name')}
							</Typography>
						)}
						<Typography color="text.secondary">
							{t('plans.creditsPlan', {
								quantity: currentPlan.credits
							})}
						</Typography>
					</Box>
					<Typography fontSize={16} fontWeight="semi">
						{formatPrice({
							amount: currentPlan.baseAmount,
							currency: currentPlan.currency
						})}
					</Typography>
				</Box>
			)}
		</Box>
	);
}
