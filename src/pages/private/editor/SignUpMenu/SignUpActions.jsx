import { oauthClients } from '@/components/AuthModal/oauth';
import { SignUpMailIcon } from '@/components/Icons/SignUpMailIcon';
import { useLanguage } from '@/hooks';
import { AUTH_MODAL_TYPES, setAuthModalOptions } from '@/store/auth';
import { capitalize } from '@/utils';
import { reverseRightLeft } from '@/utils/rtlStyle';
import { ButtonBase, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export function SignUpActions({ onClick = () => {} }) {
	const { t } = useTranslation();
	const language = useLanguage();
	const dispatch = useDispatch();

	const actions = [
		{
			provider: t('login.fields.email.label'),
			onClick: () => {
				dispatch(
					setAuthModalOptions({
						type: AUTH_MODAL_TYPES.FAST_SIGN_UP,
						editor: true,
						scope: 'download'
					})
				);
				onClick();
			},
			icon: <SignUpMailIcon />
		},
		...oauthClients.toReversed().map(client => ({
			provider: capitalize(client.provider),
			href: client.getUrl({
				type: 'create',
				language,
				fastCheckout: true
			}),
			component: 'a',
			icon: (
				<Box sx={{ p: '2px', height: 24 }}>
					<img src={client.image} alt="" />
				</Box>
			)
		}))
	];

	return (
		<>
			{actions.map(({ label, icon, provider, ...action }, index) => (
				<Fragment key={index}>
					<ButtonBase
						key={index}
						{...action}
						sx={theme => ({
							height: 48,
							textAlign: reverseRightLeft({ theme, direction: 'left' }),
							justifyContent: reverseRightLeft({
								theme,
								direction: 'left'
							}),
							pl: 1.5,
							gap: 1,
							transition: 'all 0.25s ease-in-out',
							width: '100%',
							':hover': {
								bgcolor: 'neutral.150'
							}
						})}
					>
						{icon}
						<Typography variant="body1" fontWeight="bold">
							{t('editor.continueWith', {
								provider
							})}
						</Typography>
					</ButtonBase>
					{index !== actions.length - 1 && (
						<Divider sx={{ color: '#E8E8E8', my: 0.5 }} />
					)}
				</Fragment>
			))}
		</>
	);
}
