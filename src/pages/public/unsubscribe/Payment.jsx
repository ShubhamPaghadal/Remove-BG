import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMedia } from '@/hooks/responsive';
import successIcon from '@/images/successIcon.svg';
import { useCardData } from '@/hooks/plans';

export function Payment() {
	const { t } = useTranslation();
	const mdDown = useMedia('mdDown');

	const cards = useCardData();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				gap: '16px',
				margin: '40px auto',
				width: '100%',
				textAlign: 'center',
				alignItems: 'center',
				padding: mdDown ? '0px 20px 40px 20px' : 'unset'
			}}
		>
			<Typography variant={mdDown ? 'body3' : 'h2'} sx={{ fontWeight: 500 }}>
				{t('unsubscribe.payment.title')}
			</Typography>
			<Typography
				variant={mdDown ? 'body1' : 'body3'}
				sx={{
					maxWidth: '793px',
					margin: mdDown ? '8px auto' : '24px auto'
				}}
			>
				{t('unsubscribe.payment.subtitle')}
			</Typography>
			<Box
				sx={{
					display: 'flex',
					gap: '16px',
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'center',
					textAlign: 'left',
					alignItems: 'flex-start'
				}}
			>
				{cards.map((card, index) => (
					<Box
						key={index}
						sx={{
							width: { xs: '90%', md: '388px' },
							borderRadius: '12px',
							boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
							padding: '24px',
							backgroundColor: 'white',
							alignItems: 'flex-start',
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: '8px',
								borderBottom: theme =>
									`1px solid ${theme.palette.neutral[200]}`
							}}
						>
							<Typography variant="body3" sx={{ fontWeight: 700 }}>
								{card.title}
							</Typography>
							<Box>
								<Box
									sx={{
										maxWidth: '100%',
										height: { xs: '24px', sm: 'unset' },
										display: 'flex',
										alignItems: 'center'
									}}
								>
									<Typography
										component="span"
										variant="h2"
										sx={{
											color: 'primary.main',
											fontWeight: 400,
											fontSize: { xs: '20px', sm: '40px' }
										}}
									>
										{card.currency}
									</Typography>
									&nbsp;
									<Typography
										component="span"
										variant="h2"
										sx={{
											color: 'primary.main',
											fontWeight: 700,
											fontSize: { xs: '20px', sm: '40px' }
										}}
									>
										{card.price}
									</Typography>
									{card.period && (
										<Typography
											className="period"
											component="span"
											variant="h2"
											color="primary.main"
											sx={{ fontWeight: 400, fontSize: '20px' }}
										>
											{card.period}
										</Typography>
									)}
								</Box>
								<Typography
									variant="body0"
									sx={{ fontWeight: 700, margin: 0 }}
								>
									{card.days}
								</Typography>
							</Box>
							<Typography
								variant="body1"
								sx={{
									margin: '4px 0px 16px 0px',
									minHeight: { sm: 'unset', md: '84px' },
									maxWidth: '100%'
								}}
							>
								{card.description}
							</Typography>
						</Box>
						<Typography
							variant="body0"
							sx={{ fontWeight: 700, margin: '16px 0' }}
						>
							{card.credits}
						</Typography>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: '12px'
							}}
						>
							{card.benefits.map((benefit, benefitIndex) => (
								<Box
									key={benefitIndex}
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: '8px'
									}}
								>
									<img src={successIcon} alt="check" />
									<Typography variant="body0">{benefit}</Typography>
								</Box>
							))}
						</Box>
						<Typography
							variant="body0"
							sx={{
								color: 'text.secondary',
								minHeight: { sm: 'unset', md: '60px' },
								marginTop: '16px'
							}}
						>
							{card.text}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
}
