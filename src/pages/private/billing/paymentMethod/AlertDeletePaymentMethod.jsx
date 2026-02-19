import { useTranslation } from 'react-i18next';
import { Typography, Stack } from '@mui/material';
import { Dialog, DialogContent } from '@/components/Dialog';
import { Button } from '@/components/Button';

export function AlertDeletePaymentMethodModal({ open, onClose }) {
	const { t } = useTranslation();
	return (
		<Dialog open={open} maxWidth="xs" onClose={onClose}>
			<DialogContent>
				<Typography
					sx={{
						textAlign: 'center',
						fontSize: {
							xs: 14,
							sm: 16
						},
						fontWeight: 500,
						pt: 3,
						mb: 5
					}}
					color="neutral.700"
				>
					{t('billing.alertDeletePaymentMethod')}
				</Typography>
				<Stack direction="row" justifyContent="center" spacing={2}>
					<Button variant="contained" onClick={onClose}>
						{t('common.accept')}
					</Button>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}
