import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import { formatPrice, formatPriceWithCurrency } from '@/utils';
import { usePlans } from './price';

const COMMON_BENEFITS = [
	'unsubscribe.payment.benefits.0',
	'unsubscribe.payment.benefits.1',
	'unsubscribe.payment.benefits.2',
	'unsubscribe.payment.benefits.3',
	'unsubscribe.payment.benefits.4',
	'unsubscribe.payment.benefits.5'
];

export const useCardData = () => {
	const { t } = useTranslation();
	const { trialPlan, plans } = usePlans();

	const cheapestPlan = plans?.reduce((lowest, current) => {
		if (!lowest) return current;
		return current.price < lowest.price ? current : lowest;
	}, null);

	const getBenefits = useMemo(
		() => COMMON_BENEFITS.map(benefit => t(benefit)),
		[t]
	);

	const trialPrice = formatPriceWithCurrency({
		amount: trialPlan?.baseAmount,
		currency: trialPlan?.currency
	});

	const cheapestPrice = formatPriceWithCurrency({
		amount: cheapestPlan?.baseAmount,
		currency: cheapestPlan?.currency
	});

	return useMemo(
		() => [
			{
				title: t('unsubscribe.payment.trialCard.title'),
				price: trialPrice.price,
				currency: trialPrice.currency,
				days: t('unsubscribe.payment.trialCard.days'),
				description: t('pricing.trial.description', {
					credits: cheapestPlan?.credits,
					amount: formatPrice({
						amount: cheapestPlan?.baseAmount,
						currency: cheapestPlan?.currency
					})
				}),
				credits: t('unsubscribe.payment.creditsPlan', {
					quantity: trialPlan?.credits
				}),
				benefits: getBenefits
			},
			{
				title: t('unsubscribe.payment.subscriptionPlan.title'),
				price: cheapestPrice.price,
				currency: cheapestPrice.currency,
				period: t('unsubscribe.payment.subscriptionPlan.period'),
				days: t('unsubscribe.payment.subscriptionPlan.days'),
				description: t('unsubscribe.payment.subscriptionPlan.description'),
				credits: t('unsubscribe.payment.creditsPlan', {
					quantity: cheapestPlan?.credits
				}),
				benefits: getBenefits,
				text: t('unsubscribe.payment.text')
			}
		],
		[t, getBenefits, trialPlan, cheapestPlan]
	);
};
