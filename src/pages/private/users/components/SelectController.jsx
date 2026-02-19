import { Controller } from 'react-hook-form';
import { Select } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function SelectController({
	control,
	label,
	multiple,
	name,
	renderOptions,
	...props
}) {
	const { t } = useTranslation();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				return (
					<Select
						displayEmpty
						id={name}
						label={label}
						multiple={multiple}
						renderValue={selected => {
							if (!selected) return '';

							return multiple
								? selected
										.map(value =>
											t(`users.viewsPermissions.${value}`)
										)
										.join(', ')
								: t(`users.roles.${selected}`);
						}}
						{...field}
						{...props}
					>
						{renderOptions}
					</Select>
				);
			}}
		/>
	);
}
