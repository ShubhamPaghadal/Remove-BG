import { useTranslation } from 'react-i18next';
import { TextFieldController } from '@/components/TextFieldController/index.js';
import { Button } from '@/components/Button/index.js';
import { useChangePassword } from '@/pages/private/my-account/hooks/index.js';
import { Section } from './Section';

export function ChangePasswordForm(props) {
	const { t } = useTranslation();
	const { control, onSubmitEnabled, onSubmit } = useChangePassword();
	return (
		<Section
			{...props}
			title={t('myAccount.changePassword.title')}
			display="inline-flex"
			component="form"
			onSubmit={onSubmit}
			action={
				<Button
					type="submit"
					variant="outlined"
					disabled={!onSubmitEnabled}
				>
					{t('myAccount.changePassword.submit')}
				</Button>
			}
		>
			<TextFieldController
				fullWidth
				control={control}
				id="password"
				label={t('myAccount.changePassword.fields.password.label')}
				name="password"
				type="password"
				placeholder={t(
					'myAccount.changePassword.fields.password.placeholder'
				)}
			/>
		</Section>
	);
}
