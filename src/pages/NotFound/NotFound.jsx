import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha, Stack } from '@mui/material';
import bgColorsImage from '@/images/bg_colors.webp';
import { Card } from '@/components/Card';
import transparencyPatternImage from '@/images/transparency_pattern.webp';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageNotFound } from '@/store/site';

function NotFound() {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setPageNotFound(true));

		return () => {
			dispatch(setPageNotFound(false));
		};
	}, []);

	return (
		<Box
			data-page-not-found
			height="calc(100vh - 64px)"
			left={0}
			position="relative"
			right={0}
			top={0}
			zIndex={0}
			sx={{
				backgroundImage: `url('${transparencyPatternImage}')`,
				backgroundPosition: 'center center',
				backgroundRepeat: 'repeat',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				position: 'relative'
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundImage: `url('${bgColorsImage}')`,
					backgroundSize: '200vw 180vh',
					backgroundPosition: 'center center',
					backgroundRepeat: 'no-repeat'
				}}
			/>
			<Box maxWidth={590} maxHeight={229} mb={8} width={354}>
				<Card
					sx={{
						p: 2,
						width: '100%',
						bgcolor: alpha('#fff', 0.8),
						boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
						backdropFilter: 'blur(1px)'
					}}
				>
					<Card
						sx={{
							p: 1.5,
							width: '100%',
							bgcolor: 'white',
							border: 'none'
						}}
					>
						<Stack
							alignItems="center"
							direction="column"
							justifyContent="center"
							px={1.5}
							pt={0.5}
							pb={1.5}
						>
							<Typography
								variant="body2"
								fontWeight={400}
								align="center"
								sx={{
									whiteSpace: 'pre-line',
									fontSize: 120,
									lineHeight: '56px',
									height: 133,
									display: 'flex',
									alignItems: 'center'
								}}
							>
								404
							</Typography>
							<Typography
								variant="body2"
								fontWeight={500}
								sx={{
									margin: 0,
									whiteSpace: 'pre-line',
									lineHeight: '24px',
									fontSize: 16
								}}
							>
								{t('pageTitles.notFound')}
							</Typography>
						</Stack>
					</Card>
				</Card>
			</Box>
		</Box>
	);
}

export default NotFound;
