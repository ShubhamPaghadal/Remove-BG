import MuiRadio from '@mui/material/Radio';

import { RadioIcon } from './RadioIcon';
import { RadioIconChecked } from './RadioIconChecked';

export function Radio({ color = 'primary', ...props }) {
	return (
		<MuiRadio
			disableRipple
			color={color}
			checkedIcon={<RadioIconChecked color={color} />}
			icon={<RadioIcon color={color} />}
			{...props}
		/>
	);
}
