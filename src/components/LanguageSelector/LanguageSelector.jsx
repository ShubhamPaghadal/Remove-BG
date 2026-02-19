import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuItem, Select as MuiSelect } from '@mui/material';
import { DEFAULT_LANGUAGE } from '@/i18next';
import { useIsCrawler, useLanguage } from '@/hooks';
import { getAbsolutePath, stripTrailingSlash } from '@/utils';
import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import { useLanguageOptions } from './hooks';

export function LanguageSelector({
	value: valueProp,
	onChange,
	SelectComponent = MuiSelect,
	link,
	...props
}) {
	const language = useLanguage();
	const [value, setValue] = useState(language || DEFAULT_LANGUAGE);
	const location = useLocation();
	const selectElement = useRef(null);

	const options = useLanguageOptions();
	const absolutePath = getAbsolutePath(location.pathname);
	const isCrawler = useIsCrawler();

	return (
		<SelectComponent
			ref={selectElement}
			value={valueProp || value || DEFAULT_LANGUAGE}
			onChange={event => {
				setValue(event.target.value);
				onChange?.(event.target.value);
			}}
			open={isCrawler ? true : undefined}
			MenuProps={{
				MenuListProps: {
					component: link && 'div'
				},
				...(isCrawler && {
					container: () => selectElement.current,
					disableScrollLock: true,
					sx: {
						position: 'static',
						'.MuiPaper-root': {
							position: 'static'
						}
					}
				})
			}}
			sx={theme => ({
				'.MuiSelect-icon': {
					right: removeValueIfRtl({ theme, value: '7px' }),
					left: getValueIfRtl({ theme, value: '7px' })
				}
			})}
			{...props}
		>
			{options.map(({ label, value: optionValue }) => (
				<MenuItem
					key={optionValue}
					value={optionValue}
					{...(link && {
						component: Link,
						to:
							optionValue === DEFAULT_LANGUAGE
								? absolutePath
								: stripTrailingSlash(`/${optionValue}${absolutePath}`)
					})}
				>
					{label}
				</MenuItem>
			))}
		</SelectComponent>
	);
}
