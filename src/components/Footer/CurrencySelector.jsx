import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { CurrencySelector as BaseCurrencySelector } from '@/components/CurrencySelector';
import { Box } from '@mui/system';
import { setCurrency } from '@/store/auth';
import { getCurrencyParam } from '@/store/auth/utils';
import { getValueIfRtl } from '@/utils/rtlStyle';
import { Select } from './Select';
import { CurrencyIcon } from '../Icons/CurrencyIcon';

function formatCurrency(currency) {
	return currency.toUpperCase();
}

export function CurrencySelector() {
	const { t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const dispatch = useDispatch();

	useEffect(() => {
		const currencyParam = getCurrencyParam(searchParams);
		if (!currencyParam) {
			return;
		}

		dispatch(setCurrency(currencyParam));
		searchParams.delete('currency');
		setSearchParams(searchParams);
	}, []);

	return (
		<BaseCurrencySelector
			SelectComponent={Select}
			style={{ minWidth: 0 }}
			inputProps={{
				'aria-label': t('common.currency')
			}}
			renderValue={value => {
				return (
					<Box
						display="flex"
						alignItems="center"
						gap="4px"
						sx={theme => ({
							margin: getValueIfRtl({
								theme,
								value: '0px 0px 0px 20px'
							})
						})}
					>
						<CurrencyIcon />
						{!value && t('common.currency')}
						{value && formatCurrency(value)}
					</Box>
				);
			}}
		/>
	);
}
