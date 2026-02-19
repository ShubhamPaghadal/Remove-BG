import { Card } from '@/components/Card';
import {
	Box,
	Collapse,
	Container,
	Stack,
	Typography,
	alpha
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import bgPatternImage from '@/images/bg_pattern_inverted.webp';
import { useMedia } from '@/hooks/responsive';
import { usePlans } from '@/hooks/price';
import { useEffect, useState } from 'react';
import { IconButton } from '@/components/IconButton';
import { ChevronDownIcon } from '@/components/Icons';
import { formatPrice } from '@/utils';

function QuestionCard({ question, answer }) {
	const mdDown = useMedia('mdDown');
	const [expanded, setExpanded] = useState(!mdDown);

	useEffect(() => {
		if (!mdDown) {
			setExpanded(true);
		}
	}, [mdDown]);

	return (
		<Card
			sx={{
				boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.15)',
				border: 'none',
				px: {
					xs: 2,
					md: 4.5
				},
				py: {
					xs: 2,
					md: 4
				}
			}}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				onClick={() => {
					if (mdDown) {
						setExpanded(!expanded);
					}
				}}
				sx={{
					cursor: mdDown ? 'pointer' : 'default'
				}}
			>
				<Typography
					component="h3"
					variant={mdDown ? 'body1' : 'body3'}
					fontWeight="bold"
				>
					{question}
				</Typography>

				{mdDown && (
					<IconButton aria-label={expanded ? 'Collapse' : 'Expand'}>
						<ChevronDownIcon
							sx={{
								transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.3s ease'
							}}
						/>
					</IconButton>
				)}
			</Stack>

			<Collapse in={expanded}>
				<Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
					{answer}
				</Typography>
			</Collapse>
		</Card>
	);
}

export function Faq() {
	const { t } = useTranslation();
	const { trialPlan } = usePlans();

	const trialPlanPrice = formatPrice({
		amount: trialPlan?.baseAmount,
		currency: trialPlan?.currency
	});

	const items = [
		{
			question: t('home.faq.items.0.question'),
			answer: t('home.faq.items.0.answer')
		},
		{
			question: t('home.faq.items.1.question'),
			answer: t('home.faq.items.1.answer')
		},
		{
			question: t('home.faq.items.2.question'),
			answer: t('home.faq.items.2.answer')
		},
		{
			question: t('home.faq.items.3.question'),
			answer: t('home.faq.items.3.answer')
		},
		{
			question: t('home.faq.items.4.question'),
			answer: t('home.faq.items.4.answer', { price: trialPlanPrice })
		}
	];

	return (
		<Box
			component="section"
			bgcolor="#F1F0EE"
			py={{ xs: 8, md: 10 }}
			sx={{
				backgroundImage: `url(${bgPatternImage})`,
				backgroundPosition: 'bottom',
				backgroundRepeat: 'repeat-x'
			}}
		>
			<Container maxWidth="lg">
				<Card
					sx={{
						p: { xs: 2, md: 4 },
						bgcolor: alpha('#fff', 0.4),
						boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
						backdropFilter: 'blur(1px)'
					}}
				>
					<Box textAlign="center" mb={{ xs: 2, md: 4 }} py={1}>
						<Typography
							component="h2"
							fontWeight={{
								xs: 'semi',
								md: 'extraBold'
							}}
							fontSize={{
								xs: 28,
								md: 40
							}}
						>
							{t('home.faq.title')}
						</Typography>
					</Box>

					<Stack spacing={{ xs: 1.5, md: 1.75 }}>
						{items.map((item, index) => (
							<QuestionCard
								key={index}
								question={item.question}
								answer={item.answer}
							/>
						))}
					</Stack>
				</Card>
			</Container>
		</Box>
	);
}
