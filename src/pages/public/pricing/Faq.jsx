import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import bgPatternImage from '@/images/bg_pattern_inverted.webp';
import { FaqAccordions } from './FaqAccordions';

export function Faq() {
	const { t } = useTranslation();

	return (
		<Box
			component="section"
			bgcolor="#FFF"
			pt={{ xs: 3, md: 6 }}
			pb={{ xs: 4, md: 24 }}
			sx={{
				backgroundImage: { xs: 'none', md: `url(${bgPatternImage})` },
				backgroundPosition: 'bottom',
				backgroundRepeat: 'repeat-x',
				backgroundSize: 'auto 250px'
			}}
		>
			<Container maxWidth="lg">
				<Box textAlign="center" mb={{ xs: 1, md: 4 }} py={1}>
					<Typography
						component="h2"
						fontSize={{ xs: 28, md: 40 }}
						lineHeight={{ xs: 1.3, md: 1.5 }}
						fontWeight={{ xs: 'regular', md: 'extraBold' }}
					>
						{t('home.faq.title')}
					</Typography>
				</Box>

				<FaqAccordions />
			</Container>
		</Box>
	);
}
