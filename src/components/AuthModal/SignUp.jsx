import { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
	Box,
	CircularProgress,
	Divider,
	Stack,
	Typography
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import { LevelPassword } from '@/components/LevelPassword';
import { Button } from '@/components/Button';
import {
	CfCaptchaWidget,
	useCfTurnstileChallenge
} from '@/components/CfCaptchaWidget';
import schemas from '@/validations';
import { fetchMe, signUp } from '@/store/auth/thunks';
import {
	AUTH_MODAL_TYPES,
	REDIRECT_SCOPES,
	setAuthModalType
} from '@/store/auth';
import { localizedRoute, showError } from '@/utils';
import { useAuthLogin, useAuthSignUp } from '@/store/auth/selectors';
import { useOauthErrors } from '@/hooks/oauth';
import routes from '@/routes';
import { useGetErrorMessage, useLanguage } from '@/hooks';
import { reverseRightLeft } from '@/utils/rtlStyle';
import { OAuthButtons } from './OAuthButtons';
import { FieldsWrapper, Title } from './components';
import { OAuthErrors } from './OAuthErrors';
import { AUTH_MIN_HEIGHT, FAST_CHECKOUT_MIN_HEIGHT } from './constants';
import { Email, Password } from './Fields';

export function SignUp({ fastCheckout = false }) {
	const { clearOauthError } = useOauthErrors();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const getErrorMessage = useGetErrorMessage();
	const isEditor = useSelector(state => state.auth.authModalEditor);
	const { authModalScope, authModalRedirect } = useSelector(
		state => state.auth
	);
	const navigate = useNavigate();
	const language = useLanguage();

	const { success, loading, error } = useSelector(useAuthSignUp);
	const { loading: loggingIn, success: loggedIn } = useSelector(useAuthLogin);

	const redirectTo =
		REDIRECT_SCOPES?.[authModalScope]?.register || authModalRedirect;

	const {
		cfChallengeToken,
		cfChallengeCompleted,
		cfIdempotencyKey,
		setCfIdempotencyKey,
		triggerChallenge
	} = useCfTurnstileChallenge({
		action: 'register'
	});

	const form = useForm({
		resolver: yupResolver(schemas.signUp()),
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

	async function onSubmit(values) {
		try {
			await dispatch(
				signUp({
					...values,
					language,
					cfChallengeToken,
					cfIdempotencyKey,
					gclid: localStorage.getItem('gclid') || undefined
				})
			).unwrap();
		} catch (err) {
			if (err?.data?.cfIdempotencyKey) {
				setCfIdempotencyKey(err.data.cfIdempotencyKey);
			}
			return;
		}

		try {
			localStorage.removeItem('gclid');
			await dispatch(fetchMe()).unwrap();

			if (redirectTo?.startsWith('http')) {
				window.location.href = redirectTo;
			} else {
				dispatch(setAuthModalType(''));
				navigate(redirectTo || routes.myImages);
			}
		} catch (err) {
			showError(err);
		}
	}

	const handleClose = () => {
		dispatch(setAuthModalType(null));
		clearOauthError();
	};

	if (loggingIn) {
		return (
			<Box textAlign="center">
				<CircularProgress />
			</Box>
		);
	}

	if (loggedIn && !success) {
		dispatch(setAuthModalType(''));
		return <Navigate to={routes.myImages} />;
	}

	return (
		<Box
			minHeight={
				fastCheckout ? FAST_CHECKOUT_MIN_HEIGHT : AUTH_MIN_HEIGHT.SIGNUP
			}
			pb={{ xs: 0, sm: 2 }}
		>
			<Stack spacing={1.5} sx={{ marginTop: 0 }} alignItems="left">
				{fastCheckout ? (
					<Title
						align={reverseRightLeft({ direction: 'left' })}
						fontSize={20}
					>
						{t('signUp.fastTitle')}
					</Title>
				) : (
					<Title
						align={reverseRightLeft({ direction: 'left' })}
						fontSize={20}
						sx={{ maxWidth: 250, mx: 'auto' }}
					>
						{t(isEditor ? 'signUp.editorTitle' : 'signUp.title')}
					</Title>
				)}
				{fastCheckout && (
					<Typography
						align={reverseRightLeft({ direction: 'left' })}
						color="text.secondary"
						sx={{ mb: '12px!important' }}
					>
						{t('signUp.fastDescription')}
					</Typography>
				)}
				{!fastCheckout && (
					<Typography
						align={reverseRightLeft({ direction: 'left' })}
						color="text.secondary"
					>
						{t(
							isEditor
								? 'signUp.editorDescription'
								: 'signUp.description'
						)}
					</Typography>
				)}
			</Stack>

			<Box component="form" pt={2} onSubmit={form.handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					<FieldsWrapper>
						<Email control={form.control} />
						<Stack spacing={3}>
							<Password control={form.control} />
							{!fastCheckout && (
								<LevelPassword password={form.watch('password')} />
							)}
						</Stack>
					</FieldsWrapper>
					<CfCaptchaWidget />
					<Stack textAlign="center" spacing={2}>
						<Button
							type="submit"
							variant="contained"
							loading={loading}
							disabled={!cfChallengeCompleted}
						>
							{t(fastCheckout ? 'common.continue' : 'common.signUp')}
						</Button>

						<div>
							<Divider sx={{ color: 'text.secondary' }}>
								{t('common.or')}
							</Divider>
							<OAuthButtons
								type="create"
								authTrigger={
									authModalScope ? `${authModalScope}-register` : null
								}
								noTextButton
							/>
						</div>

						{error && (
							<Typography color="error">
								{getErrorMessage(error)}
							</Typography>
						)}

						{!error && <OAuthErrors />}

						{!fastCheckout && (
							<Box>
								<Typography color="text.secondary" fontWeight="semi">
									{t('signUp.alreadyHaveAnAccount')}{' '}
									<Typography
										variant="button"
										color="text.primary"
										fontWeight="inherit"
										onClick={() =>
											dispatch(
												setAuthModalType(AUTH_MODAL_TYPES.LOGIN)
											)
										}
									>
										{t('common.login')}
									</Typography>
								</Typography>
							</Box>
						)}

						<Typography color="text.secondary" variant="body0">
							<Trans
								i18nKey="signUp.termsAndConditions"
								components={{
									anchor1: (
										<Link
											style={{ fontWeight: 'bold' }}
											to={localizedRoute(routes.termsAndConditions)}
											onClick={handleClose}
										/>
									),
									anchor2: (
										<Link
											style={{ fontWeight: 'bold' }}
											to={localizedRoute(routes.privacyPolicy)}
											onClick={handleClose}
										/>
									)
								}}
							/>
						</Typography>
					</Stack>
				</Stack>
			</Box>
		</Box>
	);
}
