import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Container
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/utils';
import { usePlans } from '@/hooks/price';

export function FaqAccordions() {
	const { t } = useTranslation();
	const { plans, trialPlan } = usePlans();

	const basePlanPrice = formatPrice({
		amount: plans?.[0]?.baseAmount,
		currency: plans?.[0]?.currency
	});

	const trialPlanPrice = formatPrice({
		amount: trialPlan?.baseAmount,
		currency: trialPlan?.currency
	});

	const items = [
		{
			question: t('pricing.faq.items.0.question'),
			answer: t('pricing.faq.items.0.answer', { price: trialPlanPrice })
		},
		{
			question: t('pricing.faq.items.1.question'),
			answer: t('pricing.faq.items.1.answer')
		},
		{
			question: t('pricing.faq.items.2.question'),
			answer: t('pricing.faq.items.2.answer')
		},
		{
			question: t('pricing.faq.items.3.question'),
			answer: t('pricing.faq.items.3.answer')
		},
		{
			question: t('pricing.faq.items.4.question'),
			answer: t('pricing.faq.items.4.answer')
		},
		{
			question: t('pricing.faq.items.5.question'),
			answer: t('pricing.faq.items.5.answer')
		},
		{
			question: t('pricing.faq.items.6.question'),
			answer: t('pricing.faq.items.6.answer')
		},
		{
			question: t('pricing.faq.items.7.question', {
				price: trialPlanPrice
			}),
			answer: t('pricing.faq.items.7.answer', {
				price: basePlanPrice
			})
		}
	];

	return (
		<Box component="section" pb={[4, 8]} pt={[1, 3.75]}>
			<Container
				maxWidth="false"
				sx={{
					maxWidth: '992px',
					padding: 0
				}}
			>
				<Box>
					{items.map((item, index) => (
						<Accordion
							key={index}
							sx={{
								'&:last-child': {
									borderBottom: '1px solid #E8E8E8'
								},
								margin: '0 0'
							}}
						>
							<AccordionSummary
								sx={{
									'.MuiAccordionSummary-content': {
										my: ['21px', '30px']
									}
								}}
							>
								{item.question}
							</AccordionSummary>
							<AccordionDetails
								color="text.secondary"
								sx={{
									pt: ['1px', '12px'],
									pb: ['22px', '31px'],
									whiteSpace: 'pre-line'
								}}
							>
								{item.answer}
							</AccordionDetails>
						</Accordion>
					))}
				</Box>
			</Container>
		</Box>
	);
}
