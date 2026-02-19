import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Dialog,
	DialogContent,
	dialogContentClasses,
	Drawer,
	Stack
} from '@mui/material';
import { useLoadCfTurnstileScript } from '@/components/CfCaptchaWidget';
import {
	AUTH_MODAL_TYPES,
	clearAuthModalData,
	setAuthModalType
} from '@/store/auth';
import { useOauthErrors } from '@/hooks/oauth';
import { useMedia } from '@/hooks/responsive';

import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { RecoverPassword } from './RecoverPassword';
import { ChangePassword } from './ChangePassword';
import { IconButton } from '../IconButton';
import { CloseIcon } from '../Icons';
import { AUTH_MIN_WIDTH } from './constants';

export function AuthModal() {
	const { clearOauthError } = useOauthErrors();
	const authModalType = useSelector(state => state.auth.authModalType);
	const smDown = useMedia('smDown');
	const dispatch = useDispatch();
	const [lastOpen, setLastOpen] = useState(authModalType);
	const type = authModalType || lastOpen;
	const open = !!authModalType;

	const isSignupFlow =
		type === AUTH_MODAL_TYPES.SIGN_UP ||
		type === AUTH_MODAL_TYPES.FAST_SIGN_UP;
	const MODAL_DEFAULT_PADDING = { xs: '40px 28px 0px', sm: '40px 28px 32px' };
	const MODAL_SIGNUP_PADDING = { xs: '40px 28px 0px', sm: '48px 28px 0px' };
	const MODAL_PADDING = isSignupFlow
		? MODAL_SIGNUP_PADDING
		: MODAL_DEFAULT_PADDING;

	useEffect(() => {
		if (authModalType) {
			return setLastOpen(authModalType);
		}
		setTimeout(() => {
			setLastOpen(null);
		}, 200);
	}, [authModalType]);

	useLoadCfTurnstileScript(open);

	useEffect(() => {
		if (!authModalType) {
			setTimeout(() => {
				dispatch(clearAuthModalData());
			}, 200);
		}
	}, [authModalType]);

	const handleClose = (_, reason) => {
		if (reason !== 'backdropClick' || smDown) {
			dispatch(setAuthModalType(null));
			clearOauthError();
		}
	};

	const content = (
		<>
			<IconButton
				onClick={handleClose}
				sx={{
					position: 'absolute',
					right: removeValueIfRtl({
						value: ({ spacing }) => spacing(1.5)
					}),
					top: ({ spacing }) => spacing(1.5),
					left: getValueIfRtl({ value: ({ spacing }) => spacing(1.5) }),
					zIndex: 1
				}}
			>
				<CloseIcon sx={{ color: 'text.secondary' }} />
			</IconButton>
			<Stack
				component={DialogContent}
				direction="row"
				width="100%"
				minWidth={AUTH_MIN_WIDTH}
				alignItems="center"
				textAlign="center"
				sx={{
					px: 3,
					pt: 5,
					pb: 4,
					overflowY: 'visible'
				}}
			>
				<Stack
					spacing={2}
					width={{
						xs: '100%',
						sm: 342
					}}
					mx="auto"
				>
					{type === AUTH_MODAL_TYPES.LOGIN && <Login />}
					{type === AUTH_MODAL_TYPES.SIGN_UP && <SignUp />}
					{type === AUTH_MODAL_TYPES.FAST_SIGN_UP && (
						<SignUp fastCheckout />
					)}
					{type === AUTH_MODAL_TYPES.RECOVER_PASSWORD && (
						<RecoverPassword />
					)}
					{type === AUTH_MODAL_TYPES.CHANGE_PASSWORD && <ChangePassword />}
				</Stack>
			</Stack>
		</>
	);

	if (smDown) {
		return (
			<Drawer
				open={open}
				onClose={handleClose}
				anchor="bottom"
				sx={{
					'.MuiPaper-root': {
						borderRadius: '12px 12px 0px 0px'
					}
				}}
			>
				{content}
			</Drawer>
		);
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="xl"
			sx={{
				[`.${dialogContentClasses.root}`]: {
					padding: MODAL_PADDING
				}
			}}
		>
			{content}
		</Dialog>
	);
}
