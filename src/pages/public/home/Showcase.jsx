import { useEffect, useState } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/system';
import { useTranslation } from 'react-i18next';

import { ItemTabs } from '@/components/ItemTabs';
import { CompareSlider } from '@/components/CompareSlider';
import { Card } from '@/components/Card';

import sliderBgImg from '@/images/compare-slider/slider-bg.webp';

import peopleBeforeImg from '@/images/compare-slider/people_before.webp';
import peopleBeforeMobileImg from '@/images/compare-slider/people_before_mobile.webp';
import peopleAfterImg from '@/images/compare-slider/people_after.webp';
import peopleAfterMobileImg from '@/images/compare-slider/people_after_mobile.webp';

import natureBeforeImg from '@/images/compare-slider/nature_before.webp';
import natureBeforeMobileImg from '@/images/compare-slider/nature_before_mobile.webp';
import natureAfterImg from '@/images/compare-slider/nature_after.webp';
import natureAfterMobileImg from '@/images/compare-slider/nature_after_mobile.webp';

import productsBeforeImg from '@/images/compare-slider/products_before.webp';
import productsBeforeMobileImg from '@/images/compare-slider/products_before_mobile.webp';
import productsAfterImg from '@/images/compare-slider/products_after.webp';
import productsAfterMobileImg from '@/images/compare-slider/products_after_mobile.webp';

import graphsBeforeImg from '@/images/compare-slider/graphs_before.webp';
import graphsBeforeMobileImg from '@/images/compare-slider/graphs_before_mobile.webp';
import graphsAfterImg from '@/images/compare-slider/graphs_after.webp';
import graphsAfterMobileImg from '@/images/compare-slider/graphs_after_mobile.webp';

import carsBeforeImg from '@/images/compare-slider/cars_before.webp';
import carsBeforeMobileImg from '@/images/compare-slider/cars_before_mobile.webp';
import carsAfterImg from '@/images/compare-slider/cars_after.webp';
import carsAfterMobileImg from '@/images/compare-slider/cars_after_mobile.webp';

import bgPatternImg from '@/images/bg_pattern_inverted.webp';
import { useMedia } from '@/hooks/responsive';

const categories = [
	{
		id: 'people',
		label: 'home.showcase.slider.categories.people',
		images: {
			mobile: {
				before: peopleBeforeMobileImg,
				after: peopleAfterMobileImg
			},
			desktop: {
				before: peopleBeforeImg,
				after: peopleAfterImg
			}
		}
	},
	{
		id: 'products',
		label: 'home.showcase.slider.categories.products',
		images: {
			mobile: {
				before: productsBeforeMobileImg,
				after: productsAfterMobileImg
			},
			desktop: {
				before: productsBeforeImg,
				after: productsAfterImg
			}
		}
	},
	{
		id: 'nature',
		label: 'home.showcase.slider.categories.nature',
		images: {
			mobile: {
				before: natureBeforeMobileImg,
				after: natureAfterMobileImg
			},
			desktop: {
				before: natureBeforeImg,
				after: natureAfterImg
			}
		}
	},
	{
		id: 'vehicles',
		label: 'home.showcase.slider.categories.vehicles',
		images: {
			mobile: {
				before: carsBeforeMobileImg,
				after: carsAfterMobileImg
			},
			desktop: {
				before: carsBeforeImg,
				after: carsAfterImg
			}
		}
	},
	{
		id: 'graphs',
		label: 'home.showcase.slider.categories.graphs',
		images: {
			mobile: {
				before: graphsBeforeMobileImg,
				after: graphsAfterMobileImg
			},
			desktop: {
				before: graphsBeforeImg,
				after: graphsAfterImg
			}
		}
	}
];

export function Showcase() {
	const { t } = useTranslation();

	const mdDown = useMedia('mdDown');

	const [activeCatId, setActiveCatId] = useState(categories[0].id);
	const [sliderPosition, setSliderPosition] = useState(50);

	useEffect(() => {
		setSliderPosition(50);
	}, [activeCatId]);

	const activeCategoryImages = categories.find(c => c.id === activeCatId)
		.images[mdDown ? 'mobile' : 'desktop'];

	return (
		<Box
			component="section"
			py={{ xs: 6, md: 8 }}
			color="#FFF"
			bgcolor="#F1F0EE"
			minHeight={544}
			position="relative"
		>
			<Box
				position="absolute"
				left={0}
				top={0}
				height={544}
				right={0}
				bgcolor="#141414"
				sx={{
					backgroundImage: `url(${sliderBgImg})`,
					backgroundPosition: 'center'
				}}
			/>

			<Box
				position="absolute"
				left={0}
				top={544}
				height={320}
				right={0}
				sx={{
					transform: 'rotate(180deg)',
					backgroundImage: `url(${bgPatternImg})`,
					backgroundPosition: 'bottom',
					backgroundRepeat: 'repeat-x'
				}}
			/>

			<Box position="relative">
				<Container maxWidth="lg">
					<Box textAlign="center">
						<Box mx="auto">
							<Typography
								fontSize={{ xs: 28, md: 48 }}
								fontWeight="extraBold"
								variant="h4"
							>
								{t('home.showcase.title')}
							</Typography>
							<Typography
								variant={mdDown ? 'body2' : 'body3'}
								sx={{ color: '#E8E8E8', mt: 2, display: 'block' }}
							>
								{t('home.showcase.description')}
							</Typography>
						</Box>

						<Box>
							<Box pt={2} pb={{ xs: 2, md: 4 }}>
								<Box py={1} mx="auto">
									<Typography
										variant="body2"
										sx={{
											color: '#DFF265'
										}}
									>
										{t('home.showcase.slider.title')}
									</Typography>
								</Box>

								<Box maxWidth={1} py={1}>
									<Stack
										pb={{ xs: 2, md: 0 }}
										alignItems="center"
										direction="row"
										justifyContent="center"
										spacing={1}
										useFlexGap
										sx={() => ({
											...(mdDown && {
												flexWrap: 'nowrap',
												width: 'auto',
												overflowX: 'auto',
												justifyContent: 'start',
												'& > *': {
													flex: '0 0 auto'
												}
											})
										})}
									>
										{categories.map(category => {
											return (
												<ItemTabs
													key={category.id}
													selected={activeCatId === category.id}
													label={t(category.label)}
													onClick={() => {
														setActiveCatId(category.id);
													}}
												/>
											);
										})}
									</Stack>
								</Box>
							</Box>

							<Card
								variant="transparent"
								sx={{
									background: alpha('#fff', 0.4),
									boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
									mx: 'auto',
									maxWidth: {
										xs: 280,
										md: 'none'
									},
									p: {
										xs: 1,
										md: 2
									}
								}}
							>
								<Box>
									<CompareSlider
										position={sliderPosition}
										onPositionChange={setSliderPosition}
										itemOne={{
											src: activeCategoryImages.before,
											alt: 'Before'
										}}
										itemTwo={{
											src: activeCategoryImages.after,
											alt: 'After'
										}}
									/>
								</Box>
							</Card>
						</Box>
					</Box>
				</Container>
			</Box>
		</Box>
	);
}
