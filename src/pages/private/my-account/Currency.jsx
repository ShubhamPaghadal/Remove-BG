import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CurrencySelector } from '@/components/CurrencySelector';
import { Button } from '@/components/Button';
import userModel from '@/models/user';
import { showError, showSuccess } from '@/utils';
import { useShowCurrencySelector } from '@/hooks';
import { Section } from './Section';

function Currency() {
	const defaultCurrency = useSelector(state => state.auth.currency);
	const [currency, setCurrency] = useState(defaultCurrency);
	const { t } = useTranslation();
	const allowChangeCurrency = useShowCurrencySelector();

	async function onSubmit() {
		try {
			await userModel.update({ currency });
			showSuccess(t('myAccount.currencyUpdateSuccess'));
		} catch (error) {
			showError(error);
		}
	}

	return (
		<Section
			title={t('common.currency')}
			action={
				<Button
					type="submit"
					disabled={!currency || !allowChangeCurrency}
					variant="outlined"
					onClick={onSubmit}
				>
					{t('myAccount.changePassword.submit')}
				</Button>
			}
		>
			<CurrencySelector
				selfState
				disabled={!allowChangeCurrency}
				onChange={value => setCurrency(value)}
			/>
		</Section>
	);
}

export default Currency;
