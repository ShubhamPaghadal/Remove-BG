import { Box, Container, Typography } from '@mui/material';
import bgColorsImage from '@/images/bg_colors.webp';
import bgPatternImage from '@/images/bg_pattern.webp';
import { useTranslation } from 'react-i18next';

export function Hero() {
	const { t } = useTranslation();

	return (
		<Box
			component="section"
			bgcolor="#FFF"
			pt={['50px', '110px']}
			pb={[4, 8]}
			position="relative"
		>
			<Box
				height={[168, 306]}
				left={0}
				position="absolute"
				py={10}
				right={0}
				top={0}
				zIndex={0}
				sx={{
					backgroundImage: `url('${bgColorsImage}')`,
					backgroundPosition: 'center center',
					backgroundSize: ['130vw 300px', '140vw 500px'],
					overflow: 'hidden'
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: 183,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundImage: `url('${bgPatternImage}')`,
						backgroundPosition: 'bottom',
						backgroundRepeat: 'repeat-x'
					}}
				/>
			</Box>

			<Container
				maxWidth="md"
				sx={{
					position: 'relative'
				}}
			>
				<Box textAlign="center">
					<Typography
						variant="lead"
						fontWeight={400}
						sx={{
							display: 'block',
							lineHeight: ['28px', '56px'],
							fontSize: [28, 64],
							letterSpacing: [0, -1]
						}}
					>
						{t('pageTitles.contact')}
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}
