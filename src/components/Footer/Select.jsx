import { forwardRef } from 'react';
import { Select as MuiSelect } from '@mui/material';
import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import { ChevronDownIcon } from '../Icons';

export const Select = forwardRef(({ sx, children, ...props }, ref) => {
	return (
		<MuiSelect
			ref={ref}
			displayEmpty
			variant="standard"
			IconComponent={ChevronDownIcon}
			sx={theme => ({
				color: 'inherit',
				':after': {
					display: 'none'
				},
				'.MuiSelect-icon': {
					color: 'inherit',
					right: removeValueIfRtl({ theme, value: '0px' }),
					left: getValueIfRtl({ theme, value: '0px' })
				},
				...sx
			})}
			{...props}
		>
			{children}
		</MuiSelect>
	);
});

Select.displayName = 'Select';
