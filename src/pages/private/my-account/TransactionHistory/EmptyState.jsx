import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useMedia } from '@/hooks/responsive';

const i18nPath = 'myAccount.txHistory.noResults';

export function EmptyState({ onClick }) {
	const mdDown = useMedia('mdDown');
	const { t } = useTranslation();

	return (
		<Box
			sx={{
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				minHeight: mdDown ? 'auto' : '30vh'
			}}
		>
			<Typography fontWeight="semi">{t(`${i18nPath}.title`)}</Typography>
			<Typography color="text.secondary" variant="body0">
				{t(`${i18nPath}.subtitle`)}
			</Typography>
			<Button onClick={onClick} variant="outlined" sx={{ marginTop: 3.5 }}>
				{t(`${i18nPath}.button`)}
			</Button>
		</Box>
	);
}
