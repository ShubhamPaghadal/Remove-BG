import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { StampCheckmarkIcon } from '@/components/Icons/StampCheckmarkIcon';
import { PlanPrice } from '@/components/PlanPrice';

import { StepIndicator } from '@/components/StepIndicator';
import { useMedia } from '@/hooks/responsive';
import { Box, chipClasses, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function Plan({
	badgeLabel,
	content,
	title,
	credits = 0,
	price,
	prices,
	action,
	type,
	sx,
	trialDiscount,
	hasCurrencySelector,
	...props
}) {
	const mdDown = useMedia('mdDown');
	const { t } = useTranslation();

	const trialDiscountPrice = { ...price, amount: 0 };

	return (
		<Card
			sx={{
				p: 3,
				width: '100%',
				borderRadius: '8px',
				maxWidth: '388px',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',

				...sx
			}}
			{...props}
		>
			{Boolean(badgeLabel || trialDiscount) && (
				<Box
					display="flex"
					justifyContent="end"
					sx={{
						position: 'absolute',
						right: '5%',
						top: '-16px'
					}}
				>
					{trialDiscount ? (
						<Badge
							icon={
								<StampCheckmarkIcon
									sx={{ fontSize: mdDown ? '16px' : '20px' }}
								/>
							}
							label={badgeLabel}
							sx={{
								backgroundColor: 'lime',
								border: 'none',
								borderRadius: '4px',
								boxShadow: 'none',
								color: 'text.primary',
								fontSize: mdDown ? '12px' : '14px',
								gap: mdDown ? '4px' : '8px',
								height: 'fit-content',
								lineHeight: mdDown ? '20px' : '24px',
								padding: '4px 8px',

								[`& .${chipClasses.icon}`]: {
									margin: 0
								},

								[`& .${chipClasses.label}`]: {
									padding: 0
								}
							}}
						/>
					) : (
						<Badge label={badgeLabel} />
					)}
				</Box>
			)}
			<StepIndicator
				dotSx={{ backgroundColor: trialDiscount ? 'lime' : 'primary.main' }}
				label={t(`common.${type}`)}
				sx={{
					mb: 2,
					display: 'inline-flex',
					alignSelf: 'flex-start'
				}}
			/>
			<Box mb={0.5}>
				<Typography variant="body3" fontSize={20}>
					{title}
				</Typography>
				<Typography variant="body3" component="p" fontSize={16}>
					({t('plans.creditsPlan', { quantity: credits })})
				</Typography>
			</Box>
			{trialDiscount ? (
				<Box>
					<PlanPrice {...price} trialDiscount />
					<Box alignItems="center" display="flex" gap="12px" mb={2}>
						<PlanPrice {...trialDiscountPrice} sx={{ color: 'black' }} />
						<Typography
							fontWeight={700}
							lineHeight="20px"
							sx={{
								backgroundColor: 'lime',
								borderRadius: '4px',
								padding: '4px 8px'
							}}
							variant="body0"
						>
							{t('common.discount', {
								discount: '100'
							})}
						</Typography>
					</Box>
				</Box>
			) : (
				<PlanPrice
					{...price}
					sx={{
						mb: 2
					}}
				/>
			)}
			<Box>{content}</Box>
			{action && (
				<Box pt={4} mt="auto">
					{action}
				</Box>
			)}
		</Card>
	);
}
