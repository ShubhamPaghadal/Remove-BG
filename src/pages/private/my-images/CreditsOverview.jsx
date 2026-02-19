import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Stack, Typography, Box, keyframes } from '@mui/material';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { QuickStat } from '@/components/QuickStat';
import routes from '@/routes';
import { useMedia } from '@/hooks/responsive';
import { useAuthMe } from '@/store/auth/selectors';
import { useAnimation } from './hooks';

const growAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

export function CreditsOverview(props) {
	const { t } = useTranslation();
	const authMe = useSelector(useAuthMe);
	const smDown = useMedia('smDown');
	const { animation, animationKey } = useAnimation();

	const { data, success: isSuccess } = useSelector(
		state => state?.editor?.fetchCredits || {}
	);

	const creditLimit = data && data.existing > 0 && data.existing === data.used;

	const title = (
		<Typography variant="body2" fontWeight="bold">
			{t('common.credits')}
		</Typography>
	);

	const availableCredits = isSuccess ? data.existing - data.used : null;
	const userData = authMe?.data;

	return (
		<Stack spacing={1.5}>
			{creditLimit && (
				<Alert
					variant="filled"
					severity="error"
					color="warning"
					sx={{ bgcolor: '#FFC107' }}
				>
					{t('myImages.creditsAlert')}
				</Alert>
			)}

			<Card variant="pressed" {...props} sx={{ position: 'relative' }}>
				<Box
					key={animationKey}
					position="absolute"
					height="100%"
					top={0}
					left={0}
					sx={{
						opacity: animation ? 1 : 0,
						background:
							'linear-gradient(270deg, #9747FF 0%, #F372C2 50.5%, #DFF265 100%)',
						transition: 'opacity 0.5s ease',
						animation: `${growAnimation} 1.5s ease`,
						animationFillMode: 'forwards'
					}}
				/>

				<Stack
					p={1.5}
					px={{ xs: 1.5, md: 3 }}
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					position="relative"
				>
					{!smDown && title}

					<Stack
						spacing={{ xs: 1, md: 2 }}
						useFlexGap
						direction={{ xs: 'column', sm: 'row' }}
						alignItems="center"
						flexWrap={{ xs: 'wrap', sm: 'inherit' }}
						justifyContent="space-between"
						width={smDown ? '100%' : 'auto'}
					>
						<QuickStat
							variant="standard"
							title={t('common.availableCredits')}
							value={isSuccess ? `${availableCredits || '0'}` : ''}
							availableData={!!data}
							animation={animation}
							sx={{
								textWrap: 'nowrap',
								minWidth: { xs: 0, sm: '34px' },
								width: { xs: '100%', sm: 'inherit' }
							}}
						/>

						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								p: { xs: 0, sm: 1 },
								ml: { xs: 0, sm: 1 },
								borderRadius: '12px',
								minHeight: '62px',
								alignSelf: 'flex-end',
								pr: smDown ? 0 : 1,
								width: { xs: '100%', sm: 'inherit' }
							}}
						>
							<Button
								component={Link}
								disabled={
									userData?.parentAccount && !userData?.views?.billing
								}
								variant="outlined"
								to={routes.billing}
								state={{ subscriptionModal: true }}
								sx={{
									backgroundColor: 'white',
									textWrap: 'noWrap',
									width: { xs: '100%', sm: 'inherit' }
								}}
							>
								{t('common.buyCredits')}
							</Button>
						</Box>
					</Stack>
				</Stack>
			</Card>
		</Stack>
	);
}
