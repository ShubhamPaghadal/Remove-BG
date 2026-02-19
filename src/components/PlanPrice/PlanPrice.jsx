import { formatPrice } from '@/utils';
import { Typography } from '@mui/material';

export function PlanPrice({
	amount,
	currency,
	period,
	sx,
	trialDiscount,
	...props
}) {
	return (
		<Typography
			color={trialDiscount ? 'text.disabled' : 'primary.main'}
			fontSize={trialDiscount ? 20 : 40}
			fontWeight={trialDiscount ? 800 : 'bold'}
			lineHeight={trialDiscount ? '28px' : '40px'}
			{...props}
			sx={{
				textDecoration: trialDiscount ? 'line-through' : 'none',

				...sx,
				'.period': {
					display: 'inline-block',
					marginInlineStart: '6px'
				}
			}}
		>
			{formatPrice({ amount, currency })}
			{period && (
				<Typography
					className="period"
					component="span"
					variant="body0"
					color="text.secondary"
				>
					{`/${period}`}
				</Typography>
			)}
		</Typography>
	);
}
