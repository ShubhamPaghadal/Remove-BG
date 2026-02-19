import { useTranslation } from 'react-i18next';
import { Typography, Stack } from '@mui/material';
import { Dialog, DialogContent, dialogClasses } from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Link } from 'react-router-dom';
import routes from '@/routes';

export function NoCreditsModal({
	open,
	onClose,
	onConfirm,
	title,
	description,
	sx,
	...props
}) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			sx={{
				...sx,
				[`.${dialogClasses.paper}`]: {
					width: '100%',
					pt: 5,
					maxWidth: 489
				}
			}}
			onClose={onClose}
			{...props}
		>
			<DialogContent>
				<Typography
					sx={{
						fontSize: {
							xs: 16,
							sm: 20
						},
						fontWeight: 700
					}}
					color="text.primary"
				>
					{title || t('errors.noCreditsAvailable')}
				</Typography>
				<Typography
					sx={{
						fontSize: {
							xs: 14,
							sm: 16
						},
						mt: 2
					}}
					color="text.secondary"
				>
					{description || t('errors.noCreditsAvailableText')}
				</Typography>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					justifyContent="flex-end"
					gap={2}
					mt={3}
				>
					<Button
						variant="text"
						color="secondary"
						onClick={onClose}
						sx={{ order: { xs: 2, sm: 1 } }}
					>
						{t('common.cancel')}
					</Button>
					<Button
						variant="contained"
						onClick={onConfirm}
						component={Link}
						to={routes.billing}
						state={{ subscriptionModal: true }}
						sx={{ order: { xs: 1, sm: 2 } }}
					>
						{t('common.buyCredits')}
					</Button>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}
