import { Button } from '@/components/Button';
import { AddIcon } from '@/components/Icons';
import routes from '@/routes';
import { getValueIfRtl } from '@/utils/rtlStyle';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function EmptyView({ canCreateImages }) {
	const { t } = useTranslation();

	return (
		<Stack
			alignItems="center"
			justifyContent="center"
			sx={{ minHeight: 348 }}
		>
			<Stack alignItems="center" textAlign="center">
				<Typography variant="body1" fontWeight={500} component="h4">
					{t('myImages.emptyView.title')}
				</Typography>
				<Typography variant="body0" color="text.secondary" sx={{ mt: 0.5 }}>
					{t('myImages.emptyView.description')}
				</Typography>

				<Button
					component={Link}
					disabled={!canCreateImages}
					variant="outlined"
					startIcon={<AddIcon />}
					to={routes.dashboard}
					sx={theme => ({
						gap: getValueIfRtl({
							value: 1,
							theme
						}),
						mt: 2.5
					})}
				>
					{t('common.createNewImage')}
				</Button>
			</Stack>
		</Stack>
	);
}
