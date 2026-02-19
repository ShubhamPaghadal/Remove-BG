import { useRef, useEffect } from 'react';
import { Box, CardMedia, Container, Stack, Typography } from '@mui/material';
import { useTranslation, Trans } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Card } from '@/components/Card';
import { StepIndicator } from '@/components/StepIndicator';

import step1Image from '@/images/home/step1.webp';
import step2Image from '@/images/home/step2.webp';
import step3Image from '@/images/home/step3.webp';
import { useMedia } from '@/hooks/responsive';
import routes from '@/routes';

const stepImages = {
	select: step1Image,
	remove: step2Image,
	download: step3Image
};

export function HowToUse() {
	const { t } = useTranslation();
	const location = useLocation();
	const howToUseRef = useRef(null);
	const mdDown = useMedia('mdDown');

	const steps = ['select', 'remove', 'download'];

	useEffect(() => {
		const howToUseHash = routes.howToUse.replace(/^\//, '');

		if (location.hash.includes(howToUseHash)) {
			setTimeout(() => {
				howToUseRef.current.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
					inline: 'start'
				});
			}, 100);
		}
	}, [location]);

	return (
		<Box
			component="section"
			bgcolor="#F1F0EE"
			py={{ xs: 4, md: 8 }}
			ref={howToUseRef}
			sx={{ scrollMargin: '64px' }}
		>
			<Container maxWidth="lg">
				<Box
					textAlign={{
						xs: 'center',
						md: 'start'
					}}
					mb={{
						xs: 4,
						md: 6
					}}
				>
					<Typography
						component="h2"
						variant={mdDown ? 'h2' : 'lead'}
						fontSize={mdDown ? 28 : 62}
						fontWeight="bold"
						lineHeight={mdDown ? '32px' : '62px'}
						sx={{
							whiteSpace: 'pre-line',
							strong: {
								background:
									'linear-gradient(90deg, #9747FF 0%, #F372C2 100%)',
								backgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								WebkitBackgroundClip: 'text'
							}
						}}
					>
						<Trans
							i18nKey="home.howToUse.title"
							component={{
								strong: <strong />
							}}
						/>
					</Typography>
				</Box>

				<Stack
					justifyContent="space-between"
					alignItems={{
						xs: 'center',
						md: 'start'
					}}
					direction={{
						xs: 'column',
						md: 'row'
					}}
				>
					{steps.map(step => {
						return (
							<Card
								key={step}
								variant="standard"
								sx={{
									maxWidth: 270,
									borderRadius: 0,
									bgcolor: 'transparent',
									mb: {
										xs: 5,
										md: 0
									},
									'&:last-child': {
										mb: 0
									}
								}}
							>
								<Stack
									alignItems="start"
									spacing={{
										xs: 3,
										md: 4
									}}
								>
									<CardMedia
										component="img"
										src={stepImages[step]}
										width="270"
										height="156"
										alt=""
										loading="lazy"
										sx={{ width: '100%', height: 'auto' }}
									/>
									<Stack spacing={2} alignItems="start">
										<StepIndicator
											label={t(`home.howToUse.steps.${step}.tag`)}
										/>
										<Typography variant="body2" color="text.primary">
											{t(`home.howToUse.steps.${step}.title`)}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											{t(`home.howToUse.steps.${step}.description`)}
										</Typography>
									</Stack>
								</Stack>
							</Card>
						);
					})}
				</Stack>
			</Container>
		</Box>
	);
}
