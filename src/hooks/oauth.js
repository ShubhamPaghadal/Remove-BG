import { AUTH_MODAL_TYPES } from '@/store/auth';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const OAUTH_ERROR_QUERY = 'oauth_error';
const OAUTH_TYPE_QUERY = 'type';

export function useOauthErrors() {
	const { t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();

	const modalMapping = {
		register: AUTH_MODAL_TYPES.SIGN_UP,
		login: AUTH_MODAL_TYPES.LOGIN
	};

	const errorMapping = {
		generic: t('errors.generic'),
		invalid_token: t('errors.generic'),
		email_exists: t('errors.emailExists'),
		user_account_closed: ''
	};

	const errorKey = searchParams.get(OAUTH_ERROR_QUERY);
	const type = searchParams.get(OAUTH_TYPE_QUERY);

	const clearOauthError = () => {
		searchParams.delete(OAUTH_ERROR_QUERY);
		searchParams.delete(OAUTH_TYPE_QUERY);

		setSearchParams(searchParams.toString());
	};

	const modalType = modalMapping?.[type] || modalMapping.login;
	const errorMessage = errorMapping?.[errorKey] || errorMapping.generic;

	useEffect(() => {
		if (errorKey === 'user_account_closed') {
			clearOauthError();
		}
	}, [errorKey]);

	return {
		modalType,
		clearOauthError,
		errorKey,
		hasError: !!errorKey,
		errorMapping,
		errorMessage
	};
}
