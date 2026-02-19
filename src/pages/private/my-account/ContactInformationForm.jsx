import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TextFieldController } from '@/components/TextFieldController/index.js';

import { Button } from '@/components/Button/index.js';
import { useUpdateContactInformation } from '@/pages/private/my-account/hooks/index.js';
import { Section } from './Section';

export function ContactInformationForm(props) {
	const { t } = useTranslation();
	const { control, onSubmitEnabled, onSubmit } = useUpdateContactInformation();
	return (
		<Section
			{...props}
			title={t('myAccount.contactInformation.title')}
			component="form"
			onSubmit={onSubmit}
			action={
				<Button
					type="submit"
					variant="outlined"
					disabled={!onSubmitEnabled}
				>
					{t('myAccount.contactInformation.submit')}
				</Button>
			}
		>
			<>
				<Stack direction="row" gap={2}>
					<TextFieldController
						fullWidth
						control={control}
						id="firstName"
						label={t(
							'myAccount.contactInformation.fields.firstName.label'
						)}
						name="firstName"
						placeholder={t(
							'myAccount.contactInformation.fields.firstName.placeholder'
						)}
					/>
					<TextFieldController
						fullWidth
						control={control}
						id="lastName"
						label={t(
							'myAccount.contactInformation.fields.lastName.label'
						)}
						name="lastName"
						placeholder={t(
							'myAccount.contactInformation.fields.lastName.placeholder'
						)}
					/>
				</Stack>
				<Stack direction="row" gap={2}>
					<TextFieldController
						fullWidth
						control={control}
						id="email"
						label={t('myAccount.contactInformation.fields.email.label')}
						name="email"
						placeholder={t(
							'myAccount.contactInformation.fields.email.placeholder'
						)}
					/>
				</Stack>
			</>
		</Section>
	);
}
