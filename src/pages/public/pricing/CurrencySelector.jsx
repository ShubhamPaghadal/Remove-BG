import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { CurrencySelector as BaseCurrencySelector } from '@/components/CurrencySelector';
import { CurrencyIcon } from '@/components/Icons/CurrencyIcon';
import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';

export function CurrencySelector({ prices, sx }) {
	const { t } = useTranslation();

	return (
		<BaseCurrencySelector
			prices={prices}
			renderValue={value => {
				const parsed = value?.toUpperCase();

				return (
					<Box display="flex" alignItems="center" gap="4px">
						<CurrencyIcon />
						{!value && t('common.currency')}
						{value && t('pricing.currencyLabel', { value: parsed })}
					</Box>
				);
			}}
			sx={theme => ({
				background: '#ffffff',
				'.MuiSelect-select.MuiSelect-select': {
					py: 1
				},
				'.MuiOutlinedInput-notchedOutline': {
					borderColor: '#E8E8E8'
				},
				'.MuiSelect-icon': {
					color: '#B8B8B8',
					right: removeValueIfRtl({ theme, value: '7px' }),
					left: getValueIfRtl({ theme, value: '7px' })
				},
				...sx
			})}
		/>
	);
}
