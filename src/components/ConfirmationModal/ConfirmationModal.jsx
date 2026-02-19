import { useTranslation } from 'react-i18next';
import { Typography, Stack, DialogTitle } from '@mui/material';
import { Dialog, DialogContent, dialogClasses } from '@/components/Dialog';
import { Button } from '@/components/Button';

export function ConfirmationModal({
	open,
	loading,
	onClose,
	onConfirm,
	text,
	confirmText,
	closeText,
	sx,
	title,
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
					pt: 4.5
				}
			}}
			maxWidth="xs"
			onClose={onClose}
			{...props}
		>
			{!!title && (
				<DialogTitle
					sx={{
						fontSize: '20px',
						fontWeight: 700,
						lineHeight: '28px',
						mb: '18px',
						py: 0,
						width: '80%'
					}}
				>
					{title}
				</DialogTitle>
			)}

			<DialogContent>
				<Typography
					sx={{
						textAlign: 'center',
						fontSize: {
							xs: 14,
							sm: 16
						},
						fontWeight: 500,
						mb: 6
					}}
					color="neutral.700"
				>
					{text}
				</Typography>
				<Stack
					direction="row"
					justifyContent="center"
					spacing={2}
					useFlexGap
				>
					<Button fullWidth variant="outlined" onClick={onClose}>
						{closeText || t('common.cancel')}
					</Button>
					<Button
						fullWidth
						variant="contained"
						loading={loading}
						onClick={onConfirm}
					>
						{confirmText}
					</Button>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}
