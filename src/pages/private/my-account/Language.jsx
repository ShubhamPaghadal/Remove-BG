import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/Button';
import { useLanguage } from '@/hooks';
import userModel from '@/models/user';
import { fetchMe } from '@/store/auth/thunks';
import { showError, showSuccess } from '@/utils';
import { Section } from './Section';

function Language() {
	const language = useLanguage();
	const [value, setValue] = useState(language);
	const { t } = useTranslation();
	const dispatch = useDispatch();

	async function onSubmit() {
		try {
			await userModel.update({ language: value });
			await dispatch(fetchMe()).unwrap();
			showSuccess(t('myAccount.languageUpdateSuccess'));
		} catch (error) {
			showError(error);
		}
	}

	return (
		<Section
			title={t('common.language')}
			action={
				<Button type="submit" variant="outlined" onClick={onSubmit}>
					{t('myAccount.changePassword.submit')}
				</Button>
			}
		>
			<LanguageSelector onChange={setValue} value={value} />
		</Section>
	);
}

export default Language;
