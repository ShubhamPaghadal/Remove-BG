import { AddIcon } from '@/components/Icons';
import { Box, ButtonBase, CircularProgress } from '@mui/material';
import { forwardRef } from 'react';

export const AddFileButton = forwardRef(function AddFileButton(
	{
		children,
		size = 48,
		inputProps,
		disabled,
		loading,
		iconElement = null,
		...rest
	},
	ref
) {
	const baseStyles = {
		flexShrink: 0,
		width: size,
		height: size,
		borderRadius: 2,
		p: 0.5,
		transition: 'all 0.25s ease-in-out',
		background: '#ffffff'
	};

	return (
		<ButtonBase
			ref={ref}
			disableRipple
			disabled={disabled || loading}
			{...rest}
			sx={theme => ({
				...baseStyles,
				border: ({ palette }) => `1px solid ${palette.primary.main}`,

				'&:disabled': {
					background: ({ palette }) => palette.neutral[100],
					color: ({ palette }) => palette.neutral[400],
					borderColor: ({ palette }) => palette.neutral[400]
				},
				'&:active': {
					background: ({ palette }) => palette.primary.dark,
					color: ({ palette }) => palette.primary.contrastText
				},

				[theme.breakpoints.up('sm')]: {
					'&:hover': {
						background: ({ palette }) => palette.primary.main,
						color: ({ palette }) => palette.primary.contrastText
					}
				}
			})}
		>
			<Box
				sx={{
					overflow: 'hidden',
					width: '100%',
					height: '100%',
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				{loading ? (
					<CircularProgress size={size / 2} />
				) : (
					iconElement || <AddIcon />
				)}
				{inputProps && <input {...inputProps} />}
			</Box>
		</ButtonBase>
	);
});
