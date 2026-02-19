import { useMemo } from 'react';
import {
	Box,
	ButtonBase,
	CardMedia,
	Container,
	Stack,
	Typography,
	alpha,
	useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import { useMedia } from '@/hooks/responsive';
import { Card } from '@/components/Card';
import { ImageDropzone } from '@/components/ImageDropzone';
import { useUploadFileFn } from '@/pages/private/editor/hooks';
import { localizedRoute } from '@/utils';
import routes from '@/routes';

import bgColorsImage from '@/images/bg_colors.webp';
import bgPatternImage from '@/images/bg_pattern.webp';
import placeholder1 from '@/images/placeholder-01.jpg';
import placeholder2 from '@/images/placeholder-02.jpg';
import placeholder3 from '@/images/placeholder-03.jpg';
import placeholder4 from '@/images/placeholder-04.jpg';
import placeholderThumbnail1 from '@/images/placeholder-thumbnail-01.webp';
import placeholderThumbnail1x2 from '@/images/placeholder-thumbnail-01x2.webp';
import placeholderThumbnail2 from '@/images/placeholder-thumbnail-02.webp';
import placeholderThumbnail2x2 from '@/images/placeholder-thumbnail-02x2.webp';
import placeholderThumbnail3 from '@/images/placeholder-thumbnail-03.webp';
import placeholderThumbnail3x2 from '@/images/placeholder-thumbnail-03x2.webp';
import placeholderThumbnail4 from '@/images/placeholder-thumbnail-04.webp';
import placeholderThumbnail4x2 from '@/images/placeholder-thumbnail-04x2.webp';
import { MIN_SHOW_ALL_TEST_IMAGES } from '@/pages/private/dashboard/constants';
import { DropImagePopover } from '@/components/DropImagePopover';
import { useDropzone } from '@/hooks/dropzone';

export function Hero() {
	const { t } = useTranslation();
	const { uploadFile } = useUploadFileFn();

	const mdDown = useMedia('mdDown');
	const showAll = useMediaQuery(
		theme => theme.breakpoints.up(MIN_SHOW_ALL_TEST_IMAGES),
		{
			noSsr: true
		}
	);

	const dropzone = useDropzone({
		onDrop: async (files, rejectedFiles) => {
			const [file] = files;
			uploadFile(file, rejectedFiles);
		},
		split: true
	});

	const placeholderImages = useMemo(() => {
		const imgs = [
			{
				id: 1,
				src: placeholder1,
				thumbnail: placeholderThumbnail1,
				thumbnail2x: placeholderThumbnail1x2
			},
			{
				id: 2,
				src: placeholder2,
				thumbnail: placeholderThumbnail2,
				thumbnail2x: placeholderThumbnail2x2
			},
			{
				id: 3,
				src: placeholder3,
				thumbnail: placeholderThumbnail3,
				thumbnail2x: placeholderThumbnail3x2
			}
		];

		if (showAll) {
			return imgs.concat([
				{
					id: 4,
					src: placeholder4,
					thumbnail: placeholderThumbnail4,
					thumbnail2x: placeholderThumbnail4x2
				}
			]);
		}
		return imgs;
	}, [showAll]);

	return (
		<Box
			component="section"
			bgcolor="#F1F0EE"
			py={{
				xs: 6,
				md: 12
			}}
			sx={{
				backgroundImage: `url('${bgColorsImage}')`,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				position: 'relative'
			}}
			{...dropzone.getDropRootProps()}
		>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundImage: `url('${bgPatternImage}')`,
					backgroundPosition: 'bottom',
					backgroundRepeat: 'repeat-x'
				}}
			/>

			<DropImagePopover dropzone={dropzone} />

			<Container maxWidth="lg" sx={{ position: 'relative' }}>
				<Box textAlign="center" mx="auto">
					<Typography
						component="h1"
						variant={mdDown ? 'h2' : 'lead'}
						fontSize={mdDown ? 28 : 62}
						fontWeight="bold"
						sx={{ mb: 1, '& em': { fontStyle: 'normal' } }}
					>
						<Trans
							i18nKey="home.hero.title"
							components={{
								em: <em />
							}}
						/>
					</Typography>
					<Typography
						variant={mdDown ? 'body2' : 'body3'}
						color="text.secondary"
					>
						{t('home.hero.subheading')}
					</Typography>
				</Box>

				<Box maxWidth={590} mx="auto" mt={4}>
					<Card
						sx={{
							p: {
								xs: 1.5,
								md: 2
							},
							width: '100%',
							bgcolor: alpha('#fff', 0.4),
							boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
							backdropFilter: 'blur(1px)'
						}}
					>
						<ImageDropzone
							sx={{ height: 202, py: 2, px: 2 }}
							dropzone={dropzone}
							noDrag
						/>

						<Stack
							justifyContent="center"
							pt={2}
							pb={{ xs: 0, md: 2 }}
							px={{
								xs: 0,
								md: 2
							}}
							useFlexGap
							spacing={2}
							alignItems="center"
							direction={{
								xs: 'column',
								md: 'row'
							}}
						>
							<Typography
								variant={mdDown ? 'body0' : 'body2'}
								fontWeight="semi"
								sx={{
									whiteSpace: {
										md: 'pre-line'
									}
								}}
							>
								{t('dashboard.placeholder.noImage')}
							</Typography>
							<Stack
								direction="row"
								alignItems="center"
								spacing={1}
								useFlexGap
							>
								{placeholderImages.map(image => (
									<Card key={image.id}>
										<ButtonBase
											onClick={() => {
												uploadFile(image.src);
											}}
											aria-label={`${t('pageTitles.removeBackground')} - ${t('editor.toolbar.backgroundTabs.photo')} ${image.id}`}
										>
											<CardMedia
												image={image.thumbnail}
												style={{
													backgroundImage: `image-set(url(${image.thumbnail}) 1x, url(${image.thumbnail2x}) 2x)`,
													height: 80,
													width: 80
												}}
											/>
										</ButtonBase>
									</Card>
								))}
							</Stack>
						</Stack>
					</Card>

					<Box textAlign="center" mt={2}>
						<Typography color="text.secondary" variant="body0">
							<Trans
								i18nKey="home.hero.disclaimer"
								components={{
									anchor1: (
										<Link
											style={{ fontWeight: 'bold' }}
											to={localizedRoute(routes.termsAndConditions)}
										/>
									),
									anchor2: (
										<Link
											style={{ fontWeight: 'bold' }}
											to={localizedRoute(routes.privacyPolicy)}
										/>
									)
								}}
							/>
						</Typography>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}
