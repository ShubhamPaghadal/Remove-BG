import { Fade, Stack, Typography } from '@mui/material';
import { useMedia } from '@/hooks/responsive';
import { Card } from '../Card';

export function QuickStat({
	title,
	value,
	action,
	availableData,
	animation,
	...props
}) {
	const smDown = useMedia('smDown');

	const valueRender = (
		<Typography
			variant={smDown ? 'body1' : 'body3'}
			fontWeight="bold"
			minWidth={{ xs: 'initial', sm: '34px' }}
			textAlign="right"
		>
			{value}
		</Typography>
	);

	return (
		<Card variant="outlined" {...props}>
			<Stack
				alignItems="center"
				direction="row"
				height="100%"
				justifyContent={{ xs: 'center', sm: 'space-between' }}
				spacing={{ xs: 1, sm: 4 }}
				sx={{
					py: 1,
					pl: availableData || !animation ? 2 : 1,
					pr: action ? 1 : 2,
					transition: animation ? 'padding 1s ease' : 'inherit',
					minHeight: '62px',
					...(!availableData && animation ? { pr: 3 } : {})
				}}
			>
				<Stack
					alignItems="center"
					direction="row"
					spacing={{ xs: 1, sm: 2 }}
					useFlexGap
				>
					<Fade in={availableData} timeout={animation ? 1500 : 300}>
						{valueRender}
					</Fade>
					<Typography
						color="text.secondary"
						fontWeight="bold"
						variant="body1"
					>
						{title}
					</Typography>
				</Stack>

				{action}
			</Stack>
		</Card>
	);
}
