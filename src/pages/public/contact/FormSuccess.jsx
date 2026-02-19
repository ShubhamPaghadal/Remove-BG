import { useTranslation, Trans } from 'react-i18next';
import { Typography, alpha, Box } from '@mui/material';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { SuccessMessageIcon } from '@/components/Icons';
import { Link } from 'react-router-dom';

export default function SuccessCard() {
	const { t } = useTranslation();

	return (
		<Card
			sx={{
				padding: [2, 5],
				bgcolor: alpha('#fff', 0.8),
				boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
				backdropFilter: 'blur(1px)',
				maxWidth: '590px'
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					textAlign: 'center'
				}}
			>
				<Box
					mt="73px"
					mb="44px"
					sx={{
						width: ['120px', '180px'],
						height: ['120px', '180px'],
						borderRadius: '50%',
						backgroundColor: '#F7F7F7',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<SuccessMessageIcon
						sx={{ width: ['32px', '64px'], height: ['56px', '112px'] }}
					/>
				</Box>
				<Typography
					variant="body3"
					color="text.secondary"
					mb="24px"
					px="1px"
					sx={{ fontSize: [12, 20] }}
				>
					<Trans i18nKey="contact.form.successMessage" />
				</Typography>
				<Link to="/">
					<Button
						type="submit"
						variant="contained"
						sx={{ width: '144px', marginBottom: 5 }}
					>
						{t('common.back')}
					</Button>
				</Link>
			</Box>
		</Card>
	);
}
