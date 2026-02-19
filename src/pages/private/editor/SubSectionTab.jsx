import { typography } from '@/theme/typography';
import { Box, ButtonBase, Typography } from '@mui/material';

function SubSectionTab({
	icon = null,
	label = '',
	selected = false,
	onClick = () => {}
}) {
	return (
		<ButtonBase
			sx={{
				flexDirection: { xs: 'row', md: 'column' },
				alignItems: 'center',
				justifyContent: 'center',
				flex: 1,
				py: { xs: 1, md: 2 },
				px: { xs: 1, md: 1.5 },
				minHeight: { xs: 40, md: 78 },
				color: 'text.secondary',
				gap: { xs: 0.5, md: 0.25 },
				fontFamily: typography.fontFamily,
				transition: 'background 0.25s ease',

				...(selected
					? {}
					: {
							background: '#E8E8E8'
						})
			}}
			onClick={evt => onClick(evt, 'segment')}
		>
			<Box
				sx={{
					width: 24,
					height: 24,

					'& > svg': {
						width: '100%',
						height: '100%'
					}
				}}
			>
				{icon}
			</Box>
			{label && (
				<Typography variant="body0" fontWeight={500}>
					{label}
				</Typography>
			)}
		</ButtonBase>
	);
}

export default SubSectionTab;
