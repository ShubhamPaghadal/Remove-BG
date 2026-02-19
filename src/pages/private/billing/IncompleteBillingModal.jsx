import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import routes from '@/routes';
import { DialogContent, DialogTitle, dialogClasses } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TABS } from '@/pages/private/my-account/constants';

export function IncompleteBillingModal({
	open,
	handleClose = () => {},
	...props
}) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			sx={{
				[`.${dialogClasses.paper}`]: {
					width: '100%',
					p: 6,
					maxWidth: 388
				}
			}}
			maxWidth="xs"
			{...props}
		>
			<DialogContent sx={{ p: 0 }}>
				<DialogTitle textAlign="center" sx={{ p: 0, mb: 5 }}>
					{t('billing.modals.incomplete.title')}
				</DialogTitle>
				<Button
					variant="contained"
					fullWidth
					component={Link}
					to={routes.myAccount}
					state={{ tab: TABS.TAX_INFORMATION }}
				>
					{t('billing.modals.incomplete.action')}
				</Button>
			</DialogContent>
		</Dialog>
	);
}
