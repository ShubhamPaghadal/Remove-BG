import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { AddIcon } from '@/components/Icons';
import { useMedia } from '@/hooks/responsive';
import { getValueIfRtl } from '@/utils/rtlStyle';

export function EmptyState({ onClick }) {
	const { t } = useTranslation();
	const mdDown = useMedia('mdDown');

	return (
		<Box
			sx={{
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				minHeight: mdDown ? '20vh' : '30vh'
			}}
		>
			<Typography fontWeight="semi">
				{t('users.emptyState.title')}
			</Typography>
			<Typography color="text.secondary" variant="body0">
				{t('users.emptyState.subtitle')}
			</Typography>
			<Button
				startIcon={<AddIcon />}
				variant="outlined"
				onClick={onClick}
				sx={theme => ({
					gap: getValueIfRtl({
						value: 1,
						theme
					}),
					marginTop: 2.5
				})}
			>
				{t('users.buttonAddUser')}
			</Button>
		</Box>
	);
}
