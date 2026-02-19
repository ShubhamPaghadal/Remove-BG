import { Box, Container, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { FeatureItem } from '@/components/FeatureItem';
import aiBg from '@/images/home/aiBg.webp';
import editionTools from '@/images/home/editionTools.webp';
import highlightYourImage from '@/images/home/highlightYourImage.webp';
import simplifiedProcess from '@/images/home/simplifiedProcess.webp';
import transparentBg from '@/images/home/transparentBg.webp';

const i18nPath = 'home.features';

const featuresList = [
	{
		text: 'transparentBg.text',
		title: 'transparentBg.title',
		src: transparentBg
	},
	{
		text: 'simplifiedProcess.text',
		title: 'simplifiedProcess.title',
		src: simplifiedProcess
	},
	{
		text: 'editionTools.text',
		title: 'editionTools.title',
		src: editionTools
	},
	{
		text: 'highlightYourImage.text',
		title: 'highlightYourImage.title',
		src: highlightYourImage
	},
	{ text: 'aiBg.text', title: 'aiBg.title', src: aiBg }
];

export function Features() {
	const { t } = useTranslation();

	return (
		<Box
			bgcolor="#F1F0EE"
			component="section"
			pb={{ xs: 4, md: 8 }}
			sx={{ scrollMargin: '64px' }}
		>
			<Container maxWidth="lg">
				<Stack gap={4}>
					{featuresList.map(({ src, text, title }, idx) => (
						<FeatureItem
							isLeftImage={(idx + 1) % 2 !== 0}
							key={`${title}-${idx}`}
							title={t(`${i18nPath}.${title}`)}
							text={t(`${i18nPath}.${text}`)}
							src={src}
						/>
					))}
				</Stack>
			</Container>
		</Box>
	);
}
