import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import bgColorsImage from '@/images/bg_colors.webp';
import bgPatternImage from '@/images/bg_pattern.webp';
import { RadioGroupList } from '@/components/RadioGroupList';
import { Button } from '@/components/Button';

import { useShowCurrencySelector } from '@/hooks';
import { usePlans } from '@/hooks/price';
import { useMedia } from '@/hooks/responsive';
import { formatPrice } from '@/utils';
import { getCheapestPlan, getDiscount } from '@/utils/plans';
import { SubscriptionPlanCard } from './SubscriptionPlanCard';
import { CurrencySelector } from './CurrencySelector';

export function Hero() {
	const { t } = useTranslation();
	const loggedIn = useSelector(state => state.auth.loggedIn);
	const showCurrencySelector = useShowCurrencySelector();
	const {
		prices,
		plans,
		trialPlan,
		planOptions,
		onSubscribe,
		onTrialSubscribe,
		selected,
		setSelected
	} = usePlans();

	const mdDown = useMedia('mdDown');
	const selectedPlan = plans?.find(plan => plan.id === selected);
	const cheapestPlan = getCheapestPlan(prices);
	const discount = getDiscount(trialPlan, cheapestPlan);

	return (
		<Box
			component="section"
			bgcolor="#FFF"
			position="relative"
			py={[6, 6, 12]}
			sx={{
				overflowX: 'hidden'
			}}
		>
			<Box
				height={{ xs: 300, md: 480 }}
				left={{ xs: '-35%', md: 0 }}
				position="absolute"
				right={{ xs: '-35%', md: 0 }}
				top={0}
				zIndex={0}
				sx={{
					backgroundImage: `url('${bgColorsImage}')`,
					backgroundPosition: 'center',
					backgroundSize: 'cover'
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundImage: `url('${bgPatternImage}')`,
						backgroundPosition: 'bottom',
						backgroundRepeat: 'repeat-x'
					}}
				/>
			</Box>
			<Container
				maxWidth="lg"
				sx={{
					position: 'relative'
				}}
			>
				<Box textAlign="center">
					<Typography
						variant={mdDown ? 'h2' : 'lead'}
						fontSize={{
							xs: 28,
							md: 62
						}}
						fontWeight={mdDown ? 'regular' : 'bold'}
						sx={{
							display: 'block',
							mb: 1
						}}
					>
						{t('pricing.hero.title')}
					</Typography>
					<Typography
						variant={mdDown ? 'body2' : 'body3'}
						color="text.secondary"
					>
						{t('pricing.hero.subheading')}
					</Typography>

					<Box mt={3} textAlign="center">
						<CurrencySelector
							prices={prices}
							sx={{
								width: {
									sm: '80%',
									md: '35%'
								},
								'&& .MuiSelect-select.MuiSelect-select': {
									paddingInlineEnd: 4,
									paddingInlineStart: 2
								}
							}}
						/>
					</Box>
				</Box>

				<Stack
					alignItems={{
						xs: 'center',
						md: 'flex-start'
					}}
					justifyContent="center"
					direction={{
						xs: 'column',
						md: 'row'
					}}
					mt={{
						xs: 2,
						md: showCurrencySelector ? 5 : 2
					}}
					pt={{ xs: 2, md: 4 }}
					sx={{
						'& > *': {
							flex: 1,
							width: {
								xs: '100%',
								md: 'auto'
							}
						}
					}}
					spacing={{
						xs: 0,
						md: 3
					}}
					useFlexGap
				>
					<SubscriptionPlanCard
						type="trial"
						title={t('pricing.trial.title')}
						credits={trialPlan?.credits}
						prices={prices}
						price={{
							amount: trialPlan?.baseAmount,
							currency: trialPlan?.currency
						}}
						badgeLabel={
							discount &&
							t('pricing.hero.badgeLabel', {
								discount
							})
						}
						content={
							<Typography
								variant={mdDown ? 'body2' : 'body3'}
								color="text.secondary"
							>
								{t('pricing.trial.description', {
									credits: plans?.[0]?.credits,
									amount: formatPrice({
										amount: plans?.[0]?.baseAmount,
										currency: plans?.[0]?.currency
									})
								})}
							</Typography>
						}
						action={
							<Button
								fullWidth
								variant="contained"
								onClick={onTrialSubscribe}
							>
								{t(loggedIn ? 'common.subscribeNow' : 'common.signUp')}
							</Button>
						}
						sx={{
							maxWidth: 413,
							marginRight: '-4px',
							border: ({ palette }) =>
								`1px solid ${palette.primary.main}`
						}}
					/>

					<SubscriptionPlanCard
						type="plan"
						title={t('pricing.subscriptionPlan')}
						credits={selectedPlan?.credits ?? plans?.[0]?.credits}
						price={{
							period: t('common.monthly'),
							amount: selectedPlan?.baseAmount ?? plans?.[0]?.credits,
							currency: selectedPlan?.currency ?? plans?.[0]?.credits
						}}
						content={
							plans?.length > 0 && (
								<RadioGroupList
									name="plan"
									value={selected}
									onChange={event => setSelected(event.target.value)}
									options={planOptions}
									maxItemsCollapsed={5}
								/>
							)
						}
						action={
							<Button fullWidth variant="outlined" onClick={onSubscribe}>
								{t('common.subscribeNow')}
							</Button>
						}
						sx={{
							maxWidth: 460,
							minHeight: { xs: 'auto', md: 544 },
							mt: {
								xs: 5,
								md: 0
							}
						}}
					/>
				</Stack>
			</Container>
		</Box>
	);
}
