import { useDropzone } from 'react-dropzone';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import bgColorsFooterImage from '@/images/bg_colors_footer.webp';
import { useMedia } from '@/hooks/responsive';
import { COMPANY_NAME } from '@/config';
import { useUploadFileFn } from '@/pages/private/editor/hooks';
import { getImageAccepted } from '@/utils';
import { DEFAULT_MAX_IN_BYTES } from '@/utils/transaction';

import { removeValueIfRtl } from '@/utils/rtlStyle';
import routes from '@/routes';
import { Logo } from '../Logo';
import { ButtonUploadImage } from '../ButtonUploadImage';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { Sitemap } from './Sitemap';
import { SitemapMobile } from './SitemapMobile';
import { Social } from './Social';

export function Footer({ prefooter = true }) {
	const { t } = useTranslation();
	const mdUp = useMedia('mdUp');
	const mdDown = useMedia('mdDown');
	const { uploadFile } = useUploadFileFn();
	const { pathname } = useLocation();

	const renderFooter = pathname.includes(routes.unsubscribe)
		? false
		: prefooter;

	const handleDrop = async (files, rejectedFiles) => {
		const [file] = files;

		uploadFile(file, rejectedFiles);
	};

	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		accept: getImageAccepted(),
		multiple: false,
		maxSize: DEFAULT_MAX_IN_BYTES,
		onDrop: handleDrop
	});

	return (
		<>
			{renderFooter && (
				<Box
					component="section"
					position="relative"
					display="flex"
					flexDirection="column"
					width="100%"
					alignItems="center"
					sx={{
						backgroundImage: `url('${bgColorsFooterImage}')`,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
						overflow: 'hidden',
						py: mdUp ? 12 : 10
					}}
				>
					<Box
						position="absolute"
						sx={theme => ({
							border: `1px dashed ${theme.palette.text.secondary}`,
							borderRadius: '12px 12px 0 0',
							borderBottom: 'none',
							bottom: 0,
							height: mdDown ? 109 : 125,
							width: 'calc(100% - 40px)',
							maxWidth: 792
						})}
					/>
					<Container maxWidth="lg">
						<Stack
							textAlign="center"
							alignItems="center"
							spacing={mdUp ? 6 : 4}
							position="relative"
						>
							<Typography
								component="h2"
								variant={mdUp ? 'lead' : 'h4'}
								fontWeight="bold"
							>
								{t('footer.cta.title')}
							</Typography>

							<ButtonUploadImage
								{...getRootProps()}
								inputProps={getInputProps()}
							/>
						</Stack>
					</Container>
				</Box>
			)}

			<Box component="footer" bgcolor="secondary.main">
				<Box
					width="100%"
					height={16}
					sx={{
						background:
							'linear-gradient(90deg, #9747FF 0%, #F372C2 51%, #DFF265 100%)'
					}}
				/>
				<Container maxWidth="lg">
					<Box sx={{ pt: { xs: 5, md: 10 }, pb: { xs: 3.5, md: 7 } }}>
						<Stack
							alignItems="start"
							direction="row"
							width="100%"
							sx={{
								flexDirection: { xs: 'column', md: 'row' },
								gap: { xs: 8, md: 0 },
								pb: {
									xs: 3.5,
									md: 14
								},
								'& > *': {
									flex: 1
								}
							}}
						>
							<Box>
								<Box component={Link} route="/" sx={{ lineHeight: 0 }}>
									<Logo mode="dark" />
								</Box>
							</Box>
							<Box sx={{ display: { xs: 'none', md: 'block' } }}>
								<Sitemap />
							</Box>
							<Box sx={{ display: { xs: 'block', md: 'none' } }}>
								<SitemapMobile />
							</Box>
						</Stack>

						<Stack
							justifyContent="space-between"
							color="#B8B8B8"
							sx={{
								flexDirection: { xs: 'column-reverse', md: 'row' },
								alignItems: { xs: 'start', md: 'center' },
								gap: 3.5
							}}
						>
							<Typography>
								{t('copyright', {
									company: COMPANY_NAME,
									year: new Date().getFullYear()
								})}
							</Typography>
							<Stack
								direction="row"
								sx={{
									gap: {
										xs: '16px',
										md: '20px',
										alignItems: 'center',
										flexWrap: 'wrap'
									}
								}}
							>
								<CurrencySelector />
								<LanguageSelector
									sx={{
										marginRight: '4px',
										'&& .MuiInputBase-input': {
											paddingRight: removeValueIfRtl({
												value: '32px',
												defaultValue: '0px !important'
											})
										}
									}}
									link
								/>
								<Social />
							</Stack>
						</Stack>
					</Box>
				</Container>
			</Box>
		</>
	);
}
