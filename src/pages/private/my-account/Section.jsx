import { useMedia } from '@/hooks/responsive';
import { Box, Stack, Typography } from '@mui/material';

export function Section({
	title,
	titleAction,
	titleSuffix,
	subtitle,
	children,
	action,
	...props
}) {
	const mdDown = useMedia('mdDown');

	return (
		<Stack {...props} display="inline-flex" width="100%">
			{(titleAction || titleSuffix) && (
				<Box
					alignItems={mdDown ? 'flex-start' : 'center'}
					display="flex"
					flexDirection={mdDown ? 'column' : 'row'}
					justifyContent="space-between"
				>
					{titleSuffix ? (
						<Box display="flex" alignItems="center">
							<SectionTitle title={title} subtitle={subtitle} />
							{titleSuffix}
						</Box>
					) : (
						<SectionTitle title={title} subtitle={subtitle} />
					)}
					{titleAction}
				</Box>
			)}
			{!titleAction && !titleSuffix && (
				<SectionTitle title={title} subtitle={subtitle} />
			)}
			{subtitle && (
				<Typography color="textSecondary" mb={2} variant="body2">
					{subtitle}
				</Typography>
			)}
			<Stack spacing={2}>
				{children}
				{action && (
					<Stack direction="row" justifyContent="end">
						{action}
					</Stack>
				)}
			</Stack>
		</Stack>
	);
}

function SectionTitle({ title, subtitle }) {
	return (
		<Typography
			variant="body2"
			fontWeight="semi"
			fontSize={{
				xs: '20px',
				md: '24px'
			}}
			mb={{
				xs: 3,
				md: subtitle ? 1 : 4
			}}
		>
			{title}
		</Typography>
	);
}
