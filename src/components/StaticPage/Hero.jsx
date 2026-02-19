import { Box, Container, Typography } from '@mui/material';
import bgColorsImage from '@/images/bg_colors.webp';
import bgPatternImage from '@/images/bg_pattern.webp';
import { useMedia } from '@/hooks/responsive';

export function Hero({ title, description }) {
	const mdDown = useMedia('mdDown');

	return (
		<Box
			component="section"
			bgcolor="#FFF"
			py={mdDown ? 6 : 12}
			position="relative"
			height={mdDown ? 172 : 320}
			display="flex"
			alignItems="center"
			overflow="hidden"
		>
			<Box
				height="100%"
				left={0}
				position="absolute"
				py={mdDown ? 6 : 12}
				right={0}
				top={0}
				zIndex={0}
				sx={{
					backgroundImage: `url('${bgColorsImage}')`,
					backgroundPosition: 'center',
					backgroundSize: mdDown ? '200%' : 'cover',
					backgroundRepeat: 'no-repeat'
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						left: 0,
						width: '100%',
						height: '100%',
						backgroundImage: `url('${bgPatternImage}')`,
						backgroundPosition: 'top',
						backgroundRepeat: 'repeat-x'
					}}
				/>
			</Box>

			<Container
				maxWidth="lg"
				sx={{
					position: 'relative'
				}}
			>
				<Box textAlign="center">
					{title && (
						<Typography
							variant={mdDown ? 'h2' : 'lead'}
							fontSize={mdDown ? 28 : 64}
							fontWeight={400}
							sx={{
								display: 'block',
								mb: 1
							}}
						>
							{title}
						</Typography>
					)}
					{description && (
						<Typography
							variant={mdDown ? 'body0' : 'body3'}
							color="text.secondary"
						>
							{description}
						</Typography>
					)}
				</Box>
			</Container>
		</Box>
	);
}
