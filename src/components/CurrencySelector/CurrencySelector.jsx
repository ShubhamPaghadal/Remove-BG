import { useTranslation } from 'react-i18next';
import {
	Box,
	CircularProgress,
	MenuItem,
	Select as MuiSelect
} from '@mui/material';

import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import { useCurrencySelector } from './hooks';
import { ChevronDownIcon } from '../Icons';

export function CurrencySelector({
	disabled,
	prices = [],
	fetchOnOpen = false,
	SelectComponent = MuiSelect,
	selfState,
	onChange: onChangeProp,
	...props
}) {
	const { t } = useTranslation();
	const {
		open,
		setOpen,
		currency,
		planCurrency,
		currencies = [],
		fetchingCurrencies,
		onChange
	} = useCurrencySelector({
		fetchOnOpen,
		prices,
		selfState,
		onChange: onChangeProp
	});

	return (
		<SelectComponent
			displayEmpty
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			value={currency || planCurrency || ''}
			renderValue={value => {
				if (value) {
					return value.toUpperCase();
				}

				return t('common.currency');
			}}
			style={{ minWidth: 100 }}
			disabled={disabled}
			MenuProps={{
				sx: {
					'.MuiPaper-root': {
						maxHeight: 200
					},
					'&& .MuiSelect-icon': {
						color: 'green',
						left: '0px',
						right: 'unset'
					}
				}
			}}
			sx={theme => ({
				'.MuiSelect-icon': {
					right: removeValueIfRtl({ theme, value: '7px' }),
					left: getValueIfRtl({ theme, value: '7px' })
				},
				'&& .MuiInputBase-input': {
					paddingRight: removeValueIfRtl({
						theme,
						value: '32px',
						defaultValue: '12px'
					})
				},
				'&& .MuiOutlinedInput-input': {
					paddingRight: removeValueIfRtl({
						theme,
						value: '32px',
						defaultValue: '12px'
					})
				}
			})}
			IconComponent={ChevronDownIcon}
			{...props}
		>
			<Box>
				{fetchingCurrencies && (
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center'
						}}
					>
						<CircularProgress size={30} />
					</Box>
				)}
				{currencies.map(currencyValue => (
					<MenuItem
						key={currencyValue}
						onClick={() => onChange(currencyValue)}
						value={currencyValue}
					>
						{currencyValue.toUpperCase()}
					</MenuItem>
				))}
			</Box>
		</SelectComponent>
	);
}
