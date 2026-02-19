import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_MODAL_TYPES, setAuthModalType } from '@/store/auth';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from '@/routes';

import { Button } from '../Button';

export function LoginButtons({ direction = 'row', spacing = 2, ...props }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { loggedIn } = useSelector(state => state.auth);

	return (
		<Stack
			alignItems="center"
			direction={direction}
			spacing={spacing}
			{...props}
		>
			{!loggedIn ? (
				<>
					<Button
						variant="text"
						color="secondary"
						fullWidth={direction === 'column'}
						onClick={() =>
							dispatch(setAuthModalType(AUTH_MODAL_TYPES.LOGIN))
						}
					>
						{t('common.login')}
					</Button>
					<Button
						fullWidth={direction === 'column'}
						variant="outlined"
						onClick={() =>
							dispatch(setAuthModalType(AUTH_MODAL_TYPES.SIGN_UP))
						}
					>
						{t('common.signUp')}
					</Button>
				</>
			) : (
				<Button
					fullWidth={direction === 'column'}
					variant="outlined"
					component={Link}
					to={routes.myImages}
				>
					{t('common.goToMyAccount')}
				</Button>
			)}
		</Stack>
	);
}
