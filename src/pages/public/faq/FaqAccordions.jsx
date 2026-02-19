import routes from '@/routes';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Container
} from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { usePlans } from '@/hooks/price';
import { formatPrice } from '@/utils';

function TextWithComponents({ textKey, linkTo }) {
	if (!textKey) return null;

	return (
		<Trans
			i18nKey={textKey}
			components={{
				anchor: <Link style={{ fontWeight: 'bold' }} to={linkTo} />
			}}
		/>
	);
}

export function FaqAccordions() {
	const { t } = useTranslation();
	const { trialPlan } = usePlans();

	const trialPlanPrice = formatPrice({
		amount: trialPlan?.baseAmount,
		currency: trialPlan?.currency
	});

	const items = [
		{
			question: t('faq.items.0.question'),
			answer: t('faq.items.0.answer')
		},
		{
			question: t('faq.items.1.question'),
			answer: t('faq.items.1.answer')
		},
		{
			question: t('faq.items.2.question'),
			answer: t('faq.items.2.answer')
		},
		{
			question: t('faq.items.3.question'),
			answer: t('faq.items.3.answer')
		},
		{
			question: t('faq.items.4.question'),
			answer: t('faq.items.4.answer')
		},
		{
			question: t('faq.items.5.question'),
			answer: t('faq.items.5.answer')
		},
		{
			question: t('faq.items.6.question'),
			answer: t('faq.items.6.answer')
		},
		{
			question: t('faq.items.7.question'),
			answer: t('faq.items.7.answer')
		},
		{
			question: t('faq.items.8.question'),
			answer: t('faq.items.8.answer')
		},
		{
			question: t('faq.items.9.question'),
			answer: t('faq.items.9.answer')
		},
		{
			question: t('faq.items.10.question'),
			answer: t('faq.items.10.answer')
		},
		{
			question: t('faq.items.11.question'),
			answer: t('faq.items.11.answer')
		},
		{
			question: t('faq.items.12.question'),
			answer: t('faq.items.12.answer')
		},
		{
			question: t('faq.items.13.question'),
			answer: t('faq.items.13.answer', { price: trialPlanPrice })
		},
		{
			question: t('faq.items.14.question'),
			answer: t('faq.items.14.answer')
		},
		{
			question: t('faq.items.15.question'),
			answer: (
				<TextWithComponents
					textKey="faq.items.15.answer"
					linkTo={routes.pricing}
				/>
			)
		},
		{
			question: t('faq.items.16.question'),
			answer: t('faq.items.16.answer')
		},
		{
			question: t('faq.items.17.question'),
			answer: t('faq.items.17.answer')
		},
		{
			question: t('faq.items.18.question'),
			answer: t('faq.items.18.answer')
		}
	];

	return (
		<Box component="section" pb={[4, 8]} pt={[1, 3.75]}>
			<Container
				maxWidth="false"
				sx={{
					maxWidth: '992px',
					pl: '21px',
					pr: '22px'
				}}
			>
				<Box>
					{items.map((item, index) => (
						<Accordion key={index} sx={{ margin: '0 0' }}>
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
