import { Card } from '@/components/Card';
import { PlanPrice } from '@/components/PlanPrice';

import { Badge } from '@/components/Badge';
import { StepIndicator } from '@/components/StepIndicator';
import { Box, Typography, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMedia } from '@/hooks/responsive';

export function SubscriptionPlanCard({
	badgeLabel,
	content,
	title,
	credits = 0,
	price,
	prices,
	action,
	type,
	sx,
	...props
}) {
	const { t } = useTranslation();
	const mdDown = useMedia('mdDown');

	const hasBadge = Boolean(badgeLabel);

	return (
		<Card
			variant="transparent"
			{...props}
			sx={{
				...sx,
				p: 3,
				bgcolor: hasBadge
					? 'rgba(161, 130, 243, 0.15)'
					: alpha('#FFF', 0.8),
				position: 'relative',
				overflow: 'visible'
			}}
		>
			<Card
				sx={{
					border: 0,
					px: { xs: 2, md: 3.125 },
					pb: { xs: 2, md: 4 },
					pt: { xs: 4, md: 5 },
					width: '100%'
				}}
			>
				{hasBadge && (
					<Box
						display="flex"
						justifyContent="end"
						sx={{
							position: 'absolute',
							top: '8px'
						}}
					>
						<Badge label={badgeLabel} />
					</Box>
				)}
				<Box display="flex" justifyContent="space-between">
					<StepIndicator
						label={t(`common.${type}`)}
						sx={{
							mb: 2,
							display: 'inline-flex'
						}}
					/>
				</Box>
				<Box mb={1}>
					<Typography
						variant="body3"
						fontSize={{
							xs: 20,
							md: 28
						}}
						fontWeight={{
							xs: 700,
							md: 500
						}}
					>
						{title}
					</Typography>
					<Typography variant={mdDown ? 'body2' : 'body3'} component="p">
						({t('plans.creditsPlan', { quantity: credits })})
					</Typography>
				</Box>
				<PlanPrice
					{...price}
					sx={{
						mb: 2
					}}
				/>
				<Box>{content}</Box>
				{action && <Box mt={{ xs: 3, md: 4 }}>{action}</Box>}
			</Card>
		</Card>
	);
}
