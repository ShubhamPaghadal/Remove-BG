import { forwardRef } from 'react';
import MuiCard from '@mui/material/Card';
import { alpha } from '@mui/system';

export const Card = forwardRef(({ variant, ...props }, ref) => {
	return (
		<MuiCard
			{...props}
			ref={ref}
			sx={theme => ({
				...(variant === 'pressed' && {
					border: ({ palette }) => `1px solid ${palette.divider}`,
					bgcolor: '#F7F7F7'
				}),

				...(variant === 'transparent' && {
					border: 'none',
					background: alpha('#fff', 0.8),
					boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.30)',
					backdropFilter: 'blur(1px)'
				}),

				...(variant === 'standard' && {
					border: 'none'
				}),

				...(typeof props.sx === 'function' ? props.sx(theme) : props.sx)
			})}
		/>
	);
});
