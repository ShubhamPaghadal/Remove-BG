import { SUPPORT_EMAIL } from '@/config';
import { Typography, Box } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useMedia } from '@/hooks/responsive';

export function Support() {
	const { t } = useTranslation();
	const mdDown = useMedia('mdDown');

	return (
		<Box
			sx={{
				backgroundColor: 'white',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				gap: '16px',
				padding: mdDown ? '40px 20px' : '80px 0'
			}}
		>
			<Typography variant={mdDown ? 'body3' : 'h2'} sx={{ fontWeight: 500 }}>
				{t('unsubscribe.support.title')}
			</Typography>
			<Typography
				variant={mdDown ? 'body1' : 'body3'}
				sx={{ maxWidth: '793px' }}
			>
				<Trans
					i18nKey="unsubscribe.support.description"
					components={{
						anchor1: (
							<Box
								component="a"
								style={{
									color: '#A182F3'
								}}
								href={`mailto:${SUPPORT_EMAIL}`}
							/>
						)
					}}
				/>
			</Typography>
			<Typography variant="body1" sx={{ color: 'text.secondary' }}>
				{t('unsubscribe.support.text')}
			</Typography>
		</Box>
	);
}
