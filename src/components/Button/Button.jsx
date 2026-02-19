import { CircularProgress, Button as MuiButton } from '@mui/material';
import { forwardRef, useMemo } from 'react';

export const Button = forwardRef(
	({ children, loading, disabled, ...props }, ref) => {
		const startIcon = useMemo(() => {
			if (loading) {
				return <CircularProgress size={20} color="inherit" thickness={5} />;
			}
			return props.startIcon;
		}, [loading, props.startIcon]);

		return (
			<MuiButton
				{...props}
				ref={ref}
				startIcon={startIcon}
				disabled={loading || disabled}
			>
				{children}
			</MuiButton>
		);
	}
);
