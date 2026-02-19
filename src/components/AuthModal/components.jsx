import { AUTH_MODAL_TYPES, setAuthModalType } from '@/store/auth';
import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export function Title(props) {
	return (
		<Typography variant="body3" fontSize={28} fontWeight="semi" {...props} />
	);
}

export function Description(props) {
	return (
		<Typography
			mt={1}
			lineHeight="24px"
			variant="body1"
			color="text.secondary"
			{...props}
		/>
	);
}

export function FieldsWrapper(props) {
	return <Stack spacing={3} {...props} />;
}

export function RememberedButton(props) {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	return (
		<Typography color="text.secondary" fontWeight="semi" {...props}>
			{t('recoverPassword.remembered')}{' '}
			<Typography
				variant="button"
				color="text.primary"
				fontWeight="inherit"
				onClick={() => dispatch(setAuthModalType(AUTH_MODAL_TYPES.LOGIN))}
			>
				{t('common.login')}
			</Typography>
		</Typography>
	);
}

export function ListItem(props) {
	return (
		<Box component="li" display="flex" sx={{ listStyle: 'none' }}>
			<Box
				sx={{
					backgroundColor: 'primary.main',
					flexShrink: 0,
					width: '8px',
					height: '8px',
					borderRadius: '50%',
					mx: 1,
					mt: '7px',
					flexGrow: 0
				}}
			/>
			<Typography
				lineHeight="24px"
				variant="body1"
				color="text.secondary"
				{...props}
			/>
		</Box>
	);
}
