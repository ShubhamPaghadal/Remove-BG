import { Controller } from 'react-hook-form';
import { FormControlLabel } from '@mui/material';

import { Switch } from '@/components/Switch';

export function SwitchController({ control, label, name, sx, ...props }) {
	return (
		<FormControlLabel
			control={
				<Controller
					name={name}
					control={control}
					render={({ field }) => (
						<Switch checked={field.value || false} {...field} />
					)}
				/>
			}
			id={name}
			label={label}
			sx={sx}
			{...props}
		/>
	);
}
