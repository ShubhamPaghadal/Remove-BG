import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RadioGroupList } from '@/components/RadioGroupList';
import { Button } from '@/components/Button';
import { CurrencySelector } from '@/components/CurrencySelector';
import { CurrencyIcon } from '@/components/Icons/CurrencyIcon';
import { usePlans } from '@/hooks/price';
import { formatPrice } from '@/utils';
import { Faq } from '@/pages/public/pricing/Faq';
import { getCheapestPlan, getDiscount } from '@/utils/plans';
import { Plan } from './Plan';

export function Plans() {
	const { t } = useTranslation();
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

	const selectedPlan = plans?.find(item => item.id === selected);
	const cheapestPlan = getCheapestPlan(prices);
	const discount = getDiscount(trialPlan, cheapestPlan);
	const trialDiscount = useSelector(state => state.auth.user?.trialDiscount);
	const theme = useTheme();

	const hasTrialDiscount = !!trialDiscount;
	const badgeLabel =
		(discount || hasTrialDiscount) &&
		t(
			hasTrialDiscount
				? 'checkout.trialDiscountBadge'
				: 'pricing.hero.badgeLabel',
			{ discount }
		);
	const trialColor = hasTrialDiscount
		? theme.palette.secondary.main
		: theme.palette.primary.main;

	return (
		<Box pt="20px">
			<Stack
				justifyContent="space-between"
				mb={{ xs: '20px', sm: '36px' }}
				sx={{
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { xs: 'flex-start', sm: 'center' },
					gap: '12px',
					maxWidth: '792px'
				}}
			>
				<Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
					{t('billing.selectPlan')}
				</Typography>
				<CurrencySelector
					renderValue={value => (
						<Box display="flex" alignItems="center" gap="4px">
							<CurrencyIcon />
							{!value && t('common.currency')}
							{value && value.toUpperCase()}
						</Box>
					)}
				/>
			</Stack>
			<Stack
				sx={{
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: 'flex-start',
					gap: { xs: '20px', md: '16px' },
					mb: 5
				}}
			>
				<Plan
					badgeLabel={badgeLabel}
					type="trial"
					title={t('pricing.trial.title')}
					credits={trialPlan?.credits}
					prices={prices}
					price={{
						amount: trialPlan?.baseAmount,
						currency: trialPlan?.currency
					}}
					content={
						<Typography
							variant="body3"
							color="text.secondary"
							fontSize={16}
							maxWidth={226}
							display="inline-block"
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
							sx={{ backgroundColor: trialColor }}
						>
							{t('common.subscribe')}
						</Button>
					}
					sx={{
						border: `1px solid ${trialColor}`,
						boxShadow: hasTrialDiscount
							? 'none'
							: '0px 2px 4px 0px rgba(161, 130, 243, 0.50)',
						minHeight: { xs: 0, sm: 511 },
						overflow: 'visible'
					}}
					trialDiscount={hasTrialDiscount}
				/>

				<Plan
					type="plan"
					title={t('pricing.subscriptionPlan')}
					credits={selectedPlan?.credits ?? plans?.[0]?.credits}
					price={{
						period: t('common.monthly'),
						amount: selectedPlan?.baseAmount ?? plans?.[0]?.baseAmount,
						currency: selectedPlan?.currency ?? plans?.[0]?.currency
					}}
					content={
						plans?.length > 0 && (
							<RadioGroupList
								name="plan"
								value={selected}
								onChange={event => setSelected(event.target.value)}
								options={planOptions}
								maxItemsCollapsed={5}
								seeMoreAlign="left"
							/>
						)
					}
					action={
						<Button fullWidth variant="outlined" onClick={onSubscribe}>
							{t('common.subscribeNow')}
						</Button>
					}
					sx={{
						minHeight: { xs: 0, sm: 511 }
					}}
				/>
			</Stack>
			<Faq />
		</Box>
	);
}
