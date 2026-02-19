import { useTranslation } from 'react-i18next';
import { Box, Divider, Stack, Typography } from '@mui/material';

export function TrialPlan({ title, trialPlan, trialPlanPrice, discount }) {
	const { t } = useTranslation();

	return (
		<>
			<Box py={2}>
				<Stack flexDirection="row" justifyContent="space-between">
					<Box>
						<Typography variant="body1">
							{title ||
								t('plans.creditsPlan', {
									quantity: trialPlan.credits ?? 0
								})}
						</Typography>
						<Typography variant="body0" color="text.secondary">
							{t('billing.subscription.references.trial')}
						</Typography>
					</Box>

					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						useFlexGap
					>
						{!!discount && (
							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								sx={theme => ({
									background: theme.palette.text.primary,
									px: 0.5,
									height: 20,
									borderRadius: 1
								})}
							>
								<Typography
									variant="body0"
									fontWeight={700}
									color="background.default"
								>
									{t('common.discount', {
										discount
									})}
								</Typography>
							</Box>
						)}
						<Typography
							variant="body3"
							fontSize={{ xs: 20, sm: 24 }}
							fontWeight={700}
						>
							{trialPlanPrice}
						</Typography>
					</Stack>
				</Stack>
			</Box>
			<Divider orientation="horizontal" />
		</>
	);
}
