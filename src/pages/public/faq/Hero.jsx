import { Box, Container, Typography, Stack } from '@mui/material';
import bgColorsImage from '@/images/bg_colors.webp';
import bgPatternImage from '@/images/bg_pattern.webp';
import { useTranslation } from 'react-i18next';

export function Hero() {
	const { t } = useTranslation();

	return (
		<Box
			component="section"
			bgcolor="#FFF"
			pt={['44px', '90px']}
			pb={[3, 8]}
			position="relative"
		>
			<Box
				height={[168, 302]}
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
				<Stack textAlign="center" alignItems="center" spacing={[1.5, 2]}>
					<Typography
						variant="lead"
						fontWeight={400}
						sx={{
							display: 'block',
							lineHeight: 'normal',
							fontSize: [28, 64],
							letterSpacing: [0, -5]
						}}
					>
						{t('pageTitles.faq')}
					</Typography>
					<Typography
						variant="body2"
						fontWeight={400}
						sx={{
							display: 'flex',
							alignItems: 'center',
							maxWidth: ['277px', '590px'],
							height: '56px',
							fontSize: ['12px', '16px'],
							lineHeight: ['16px', '24px'],
							mt: [0, '1px'],
							letterSpacing: [0, 0],
							textWrap: ['wrap', 'balance']
						}}
					>
						{t('faq.description')}
					</Typography>
				</Stack>
			</Container>
		</Box>
	);
}
