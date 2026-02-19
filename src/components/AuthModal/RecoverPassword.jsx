import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/Button';
import {
	CfCaptchaWidget,
	useCfTurnstileChallenge
} from '@/components/CfCaptchaWidget';
import { TextFieldController } from '@/components/TextFieldController';
import schemas from '@/validations';
import authModel from '@/models/auth';
import { useLazyFetch } from '@/hooks/fetch';
import { useGetErrorMessage } from '@/hooks';
import { Description, RememberedButton, Title } from './components';

const MIN_HEIGHT = 400;

export function RecoverPassword() {
	const { t } = useTranslation();

	const getErrorMessage = useGetErrorMessage();

	const {
		cfChallengeToken,
		cfChallengeCompleted,
		cfIdempotencyKey,
		setCfIdempotencyKey,
		triggerChallenge
	} = useCfTurnstileChallenge({
		action: 'recover_password'
	});

	const {
		fetch: forgotPassword,
		isSuccess,
		isLoading,
		error
	} = useLazyFetch(authModel.forgotPassword.bind(authModel), {
		onError(err) {
			if (err?.data?.cfIdempotencyKey) {
				setCfIdempotencyKey(err.data.cfIdempotencyKey);
			}
		}
	});
	const errorMessage = getErrorMessage(error);

	const form = useForm({
		resolver: yupResolver(schemas.recoverPassword()),
		mode: 'onChange',
		defaultValues: {
			email: ''
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
		return forgotPassword({
			...values,
			cfChallengeToken,
			cfIdempotencyKey
		});
	}

	if (isSuccess) {
		return (
			<Box minHeight={MIN_HEIGHT}>
				<Stack spacing={2}>
					<Stack spacing={1}>
						<Title>{t('recoverPassword.title')}</Title>
						<Description>
							{t('recoverPassword.successMessage')}
						</Description>
					</Stack>
					<RememberedButton />
				</Stack>
			</Box>
		);
	}

	return (
		<Box minHeight={MIN_HEIGHT}>
			<Stack spacing={1}>
				<Title>{t('recoverPassword.title')}</Title>
				<Description>{t('recoverPassword.description')}</Description>
			</Stack>
			<Box py={2} component="form" onSubmit={form.handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					<TextFieldController
						fullWidth
						control={form.control}
						id="email"
						name="email"
						placeholder={t('login.fields.email.placeholder')}
					/>
					<CfCaptchaWidget />
					<Stack spacing={2}>
						<Button
							loading={isLoading}
							type="submit"
							variant="contained"
							disabled={!cfChallengeCompleted}
						>
							{t('recoverPassword.reset')}
						</Button>

						{errorMessage && (
							<Typography color="error.main">{errorMessage}</Typography>
						)}

						<RememberedButton />
					</Stack>
				</Stack>
			</Box>
		</Box>
	);
}
