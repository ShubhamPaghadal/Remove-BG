import { useOauthErrors } from '@/hooks/oauth';
import { Typography } from '@mui/material';

export function OAuthErrors() {
	const { errorMessage, hasError } = useOauthErrors();

	if (!hasError) {
		return null;
	}

	return <Typography color="error.main">{errorMessage}</Typography>;
}
