import { useDispatch } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { showError } from '@/utils';
import { logout } from '@/store/auth/thunks';
import { SignOutIcon } from '../Icons';

export function SignOutButton() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const signOut = async () => {
		try {
			await dispatch(logout()).unwrap();
		} catch (error) {
			showError(error);
		}
		navigate('/');
	};

	return (
		<Box spacing="2" mt="auto">
			<Button
				fullWidth
				variant="text"
				color="inherit"
				onClick={signOut}
				sx={{ justifyContent: 'start' }}
			>
				<SignOutIcon sx={{ marginRight: 1 }} />
				<Typography
					sx={{
						fontWeight: 500,
						color: '#656565',
						lineHeight: '24px'
					}}
				>
					{t('common.signOut')}
				</Typography>
			</Button>
		</Box>
	);
}
