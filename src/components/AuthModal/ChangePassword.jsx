import { useTranslation } from 'react-i18next';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/Button';
import { TextFieldController } from '@/components/TextFieldController';
import schemas from '@/validations';
import authModel from '@/models/auth';
import { useLazyFetch } from '@/hooks/fetch';
import { useGetErrorMessage } from '@/hooks';
import { AUTH_MODAL_TYPES, setAuthModalType } from '@/store/auth';
import {
	Description,
	FieldsWrapper,
	ListItem,
	RememberedButton,
	Title
} from './components';
import { LevelPassword } from '../LevelPassword';

const MIN_HEIGHT = 400;

export function ChangePassword() {
	const { t } = useTranslation();
	const location = useLocation();
	const dispatch = useDispatch();

	const getErrorMessage = useGetErrorMessage({
		invalidToken: t('changePassword.invalidToken')
	});
	const {
		fetch: resetPassword,
		isSuccess,
		isLoading,
		error
	} = useLazyFetch(authModel.resetPassword.bind(authModel));
	const errorMessage = getErrorMessage(error);

	const form = useForm({
		resolver: yupResolver(schemas.resetPassword(t)),
		mode: 'onChange',
		defaultValues: {
			password: '',
			repeatPassword: ''
		}
	});

	function onSubmit({ password }) {
		return resetPassword({
			password,
			token: location.state?.resetPasswordToken
		});
	}

	if (error?.data?.errorCode === 'invalid_token') {
		return (
			<Box minHeight={MIN_HEIGHT}>
				<Stack spacing={4}>
					<Stack spacing={1}>
						<Title>{t('changePassword.title')}</Title>
						<Description color="error.main">{errorMessage}</Description>
					</Stack>
					<Button
						variant="contained"
						onClick={() =>
							dispatch(
								setAuthModalType(AUTH_MODAL_TYPES.RECOVER_PASSWORD)
							)
						}
					>
						{t('common.accept')}
					</Button>
				</Stack>
			</Box>
		);
	}

	if (isSuccess) {
		return (
			<Box>
				<Stack spacing={3}>
					<Title fontSize={20} textAlign="left">
						{t('changePassword.successTitle')}
					</Title>
					<Description
						textAlign="left"
						variant="body2"
						whiteSpace="pre-wrap"
					>
						{t('changePassword.successMessage')}
					</Description>
					<Divider />
					<Button
						variant="contained"
						onClick={() =>
							dispatch(setAuthModalType(AUTH_MODAL_TYPES.LOGIN))
						}
					>
						{t('common.accept')}
					</Button>
				</Stack>
			</Box>
		);
	}

	return (
		<Box minHeight={MIN_HEIGHT}>
			<Stack spacing={1}>
				<Title>{t('changePassword.title')}</Title>
				<Description>{t('changePassword.description')}</Description>
				<Stack component="ul" textAlign="left" pl={0} spacing={1}>
					<ListItem>
						{t('changePassword.requirements.combineLetters')}
					</ListItem>
					<ListItem>
						{t('changePassword.requirements.noPersonalInfo')}
					</ListItem>
					<ListItem>
						{t('changePassword.requirements.minCharacters', { value: 8 })}
					</ListItem>
				</Stack>
			</Stack>
			<Box py={2} component="form" onSubmit={form.handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					<FieldsWrapper>
						<TextFieldController
							control={form.control}
							fullWidth
							id="password"
							name="password"
							placeholder={t('login.fields.password.placeholder')}
							type="password"
						/>
						<TextFieldController
							control={form.control}
							fullWidth
							id="repeatPassword"
							name="repeatPassword"
							placeholder={t('changePassword.repeatPassword')}
							type="password"
						/>
						<LevelPassword password={form.watch('password')} />
					</FieldsWrapper>
					<Stack spacing={2}>
						<Button loading={isLoading} type="submit" variant="contained">
							{t('changePassword.confirm')}
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
