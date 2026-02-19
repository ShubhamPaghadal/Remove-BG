import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { SignUpPadlockIcon } from '@/components/Icons/SignUpPadlockIcon';
import { MailIcon } from '@/components/Icons';
import { TextFieldController } from '@/components/TextFieldController';

function Field({ Icon, ...props }) {
	return (
		<Box position="relative">
			{Icon && (
				<Icon
					sx={{
						position: 'absolute',
						top: 8,
						left: 12,
						color: '#B8B8B8'
					}}
				/>
			)}
			<TextFieldController
				fullWidth
				sx={{ '.MuiInputBase-input': { pl: 5 } }}
				{...props}
			/>
		</Box>
	);
}

export function Email(props) {
	const { t } = useTranslation();

	return (
		<Field
			Icon={MailIcon}
			id="email"
			name="email"
			placeholder={t('login.fields.email.placeholder')}
			{...props}
		/>
	);
}

export function Password(props) {
	const { t } = useTranslation();

	return (
		<Field
			Icon={SignUpPadlockIcon}
			id="password"
			name="password"
			placeholder={t('login.fields.password.placeholder')}
			type="password"
			{...props}
		/>
	);
}
