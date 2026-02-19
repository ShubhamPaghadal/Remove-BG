import { forwardRef } from 'react';
import { Button } from '../Button';

export const IconButton = forwardRef(
	({ variant = 'text', color, ...props }, ref) => {
		const commonStyles = {
			minWidth: 'auto',
			px: 1
		};

		if (variant === 'outlined') {
			return (
				<Button
					{...props}
					ref={ref}
					variant="outlined"
					color={color}
					sx={{ ...commonStyles, ...props.sx }}
				/>
			);
		}
		return (
			<Button
				variant={variant}
				{...props}
				color={color}
				ref={ref}
				sx={{ ...commonStyles, ...props.sx }}
			/>
		);
	}
);
