import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';
import { parseMessage } from './utils';

export function TextFieldController({ control, name, type, ...props }) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, formState }) => {
				return (
					<TextField
						{...field}
						{...props}
						error={formState.errors[name] !== undefined}
						helperText={parseMessage(formState.errors[name]?.message)}
						type={type}
						value={field.value || ''}
					/>
				);
			}}
		/>
	);
}
