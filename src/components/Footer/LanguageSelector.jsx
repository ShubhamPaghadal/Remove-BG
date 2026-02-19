import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import {
	LanguageSelector as BaseLanguageSelector,
	useDisplayLanguage
} from '@/components/LanguageSelector';
import { setLanguage } from '@/store/auth';
import { getValueIfRtl } from '@/utils/rtlStyle';
import { Select } from './Select';
import { LanguageIcon } from '../Icons/LanguageIcon';

export function LanguageSelector(props) {
	const dispatch = useDispatch();
	const displayName = useDisplayLanguage();
	const { t } = useTranslation();

	return (
		<BaseLanguageSelector
			onChange={value => {
				dispatch(setLanguage(value));
			}}
			SelectComponent={Select}
			inputProps={{
				'aria-label': t('common.language')
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
								value: '0px 0px 0px 22px'
							})
						})}
					>
						<LanguageIcon />
						{displayName(value)}
					</Box>
				);
			}}
			{...props}
		/>
	);
}
