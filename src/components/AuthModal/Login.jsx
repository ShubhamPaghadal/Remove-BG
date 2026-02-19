import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/Button';
import {
	CfCaptchaWidget,
	useCfTurnstileChallenge
} from '@/components/CfCaptchaWidget';
import { login } from '@/store/auth/thunks';
import { useAuthLogin } from '@/store/auth/selectors';
import schemas from '@/validations';
import routes from '@/routes';
import {
	AUTH_MODAL_TYPES,
	REDIRECT_SCOPES,
	clearMe,
	setAuthModalType
} from '@/store/auth';
import { useGetErrorMessage } from '@/hooks';
import { OAuthButtons } from './OAuthButtons';
import { Description, FieldsWrapper, Title } from './components';
import { OAuthErrors } from './OAuthErrors';
import { AUTH_MIN_HEIGHT } from './constants';
import { Email, Password } from './Fields';

export function Login() {
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const getErrorMessage = useGetErrorMessage({
		accountDeleted: t('login.errors.deletedAccount')
	});
	const { authModalScope, authModalRedirect } = useSelector(
		state => state.auth
	);

	const redirectTo =
		REDIRECT_SCOPES?.[authModalScope]?.login || authModalRedirect;

	const { success, loading, error } = useSelector(useAuthLogin);
	const {
		cfChallengeToken,
		cfChallengeCompleted,
		cfIdempotencyKey,
		setCfIdempotencyKey,
		triggerChallenge
	} = useCfTurnstileChallenge({
		action: 'login'
	});
	const errorMessage =
		error?.status === 401
			? t('login.credentialsError')
			: getErrorMessage(error);

	const form = useForm({
		resolver: yupResolver(schemas.login()),
		mode: 'onBlur',
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const email = form.watch('email');

	useEffect(() => {
		if (email.includes('@')) {
			triggerChallenge();
		}
	}, [email]);

	useEffect(() => {
		if (error?.data?.cfIdempotencyKey) {
			setCfIdempotencyKey(error.data.cfIdempotencyKey);
		}
	}, [error]);

	function onSubmit(values) {
		dispatch(login({ ...values, cfChallengeToken, cfIdempotencyKey }));
	}

	if (success) {
		dispatch(setAuthModalType(''));
		dispatch(clearMe());
		if (redirectTo?.startsWith('http')) {
			window.location.href = redirectTo;
			return null;
		}

		return <Navigate to={redirectTo || routes.myImages} />;
	}

	return (
		<Box minHeight={AUTH_MIN_HEIGHT.LOGIN}>
			<Stack spacing={1}>
				<Title>{t('login.title')}</Title>
				<Description>{t('login.description')}</Description>
			</Stack>
			<Box
				pt={{ xs: 1, sm: 4 }}
				component="form"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Stack spacing={2}>
					<FieldsWrapper>
						<Email control={form.control} />
						<Password control={form.control} />
					</FieldsWrapper>
					<CfCaptchaWidget />
					<Stack spacing={2}>
						<Typography color="text.secondary" fontWeight="semi">
							{t('login.forgotPassword')}{' '}
							<Typography
								variant="button"
								color="text.primary"
								fontWeight="inherit"
								onClick={() =>
									dispatch(
										setAuthModalType(
											AUTH_MODAL_TYPES.RECOVER_PASSWORD
										)
									)
								}
							>
								{t('common.clickHere')}
							</Typography>
						</Typography>
						<Button
							loading={loading}
							type="submit"
							variant="contained"
							disabled={!cfChallengeCompleted}
						>
							{t('common.login')}
						</Button>

						<div>
							<Divider sx={{ color: 'text.secondary' }}>
								{t('common.or')}
							</Divider>
							<OAuthButtons
								type="login"
								authTrigger={
									authModalScope ? `${authModalScope}-login` : null
								}
								noTextButton
							/>
						</div>

						{errorMessage && (
							<Typography color="error.main">{errorMessage}</Typography>
						)}

						{!errorMessage && <OAuthErrors />}

						<Box>
							<Typography color="text.secondary" fontWeight="semi">
								{t('login.dontHaveAnAccount')}{' '}
								<Typography
									variant="button"
									color="text.primary"
									fontWeight="inherit"
									onClick={() =>
										dispatch(
											setAuthModalType(AUTH_MODAL_TYPES.SIGN_UP)
										)
									}
								>
									{t('common.signUp')}
								</Typography>
							</Typography>
						</Box>
					</Stack>
				</Stack>
			</Box>
		</Box>
	);
}
