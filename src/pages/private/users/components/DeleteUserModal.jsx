import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { Dialog, DialogContent, dialogClasses } from '@/components/Dialog';
import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';

const i18nPath = 'users.deleteUserModal';

export function DeleteUserModal({ open, onClose, onConfirm, userName }) {
	const { t } = useTranslation();

	return (
		<Dialog
			open={open}
			sx={{
				[`.${dialogClasses.paper}`]: {
					width: { xs: 280, sm: 388 },
					overflow: 'hidden'
				}
			}}
			onClose={onClose}
		>
			<DialogContent
				sx={{
					padding: '48px 24px 24px'
				}}
			>
				<Typography fontSize="20px" fontWeight="bold">
					{t(`${i18nPath}.title`)}
				</Typography>
				<Box marginTop={3}>
					<Typography variant="body2" color="text.secondary">
						{t(`${i18nPath}.description`, { userName })}
					</Typography>
					<Divider sx={{ marginTop: 2 }} />
					<Box sx={{ display: 'flex', marginTop: 3 }}>
						<Button
							fullWidth
							size="large"
							variant="outlined"
							onClick={onClose}
						>
							{t('common.cancel')}
						</Button>
						<Button
							fullWidth
							size="large"
							variant="contained"
							onClick={onConfirm}
							sx={theme => ({
								marginLeft: removeValueIfRtl({ value: 2, theme }),
								marginRight: getValueIfRtl({ value: 2, theme })
							})}
						>
							{t('common.delete')}
						</Button>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
