import { IconButton } from '@/components/IconButton';
import { Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks';
import { oauthClients } from './oauth';

export function OAuthButtons({ type, authTrigger, noTextButton, ...props }) {
	const { t } = useTranslation();
	const language = useLanguage();

	const buttonTexts = noTextButton
		? {}
		: {
				google: t(
					type === 'login' ? 'oauth.loginWith' : 'oauth.signUpWith',
					{
						provider: 'google'
					}
				)
			};

	const buttons = oauthClients.map(client => ({
		name: client.name,
		href: client.getUrl({
			type,
			language,
			authTrigger
		}),
		image: client.image,
		provider: client.provider
	}));

	return (
		<Stack
			direction="row"
			alignItems="center"
			spacing={1}
			useFlexGap
			py={2}
			{...props}
		>
			{buttons.map(({ image, name, href, provider }) => {
				const buttonText = buttonTexts?.[provider];

				return (
					<Tooltip
						key={name}
						title={t(
							type === 'login' ? 'oauth.loginWith' : 'oauth.signUpWith',
							{ provider: name }
						)}
						arrow
					>
						<IconButton
							key={name}
							fullWidth
							href={href}
							variant="outlined"
							sx={{ flex: buttonText ? 14 : 1, minWidth: 40 }}
						>
							<img src={image} alt={name} width="24" height="24" />
							{buttonText && (
								<Typography
									sx={{ ml: 1 }}
									variant="body1"
									fontWeight={500}
								>
									{buttonText}
								</Typography>
							)}
						</IconButton>
					</Tooltip>
				);
			})}
		</Stack>
	);
}
