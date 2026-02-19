import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { localizedRoute } from '@/utils';
import sitemap from './sitemapData';

export function Sitemap() {
	const { t } = useTranslation();

	return (
		<>
			{sitemap.map(({ title, titleKey, links }, index) => (
				<Box py={1} key={index}>
					<Typography color="white" fontWeight="bold" sx={{ mb: '20px' }}>
						{title || t(titleKey)}
					</Typography>
					<Stack spacing={1.5}>
						{links.map(({ labelKey, to }) => (
							<Typography
								component={Link}
								key={labelKey}
								to={localizedRoute(to)}
								sx={{
									color: '#B8B8B8',
									transition: theme =>
										theme.transitions.create('color'),
									'&:hover': {
										color: '#fff'
									}
								}}
							>
								{t(labelKey)}
							</Typography>
						))}
					</Stack>
				</Box>
			))}
		</>
	);
}
