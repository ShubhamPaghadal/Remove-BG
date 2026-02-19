import {
	Alert,
	Box,
	LinearProgress,
	Typography,
	alertClasses,
	Stack,
	linearProgressClasses,
	Button
} from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';
import { FaqIcon } from '../Icons';

export const LongTextAlert = forwardRef(
	(
		{
			severity,
			handleClose,
			message,
			messageTitle,
			action,
			duration,
			open,
			...props
		},
		ref
	) => {
		const [progress, setProgress] = useState(0);

		useEffect(() => {
			const timer = setInterval(
				() => {
					setProgress(oldProgress => {
						if (oldProgress >= 100) {
							clearInterval(timer);

							return 100;
						}

						return oldProgress + 1;
					});
				},
				(duration - 250) / 100
			);

			return () => {
				clearInterval(timer);
			};
		}, []);

		return (
			<Box position="relative" borderRadius={6} ref={ref} maxWidth={590}>
				<Alert
					{...props}
					onClose={handleClose}
					severity={severity}
					icon={severity === 'error' ? <FaqIcon color="error" /> : null}
					sx={{
						width: '100%',
						backgroundColor: 'background.default',
						alignItems: 'flex-start',
						minWidth: { xs: 250, md: 340 },
						border: 1,
						borderColor: 'divider',
						borderRadius: 1,
						py: 1,
						pl: 2,

						[`.${alertClasses.action}`]: {
							pt: 0,
							pr: 1,
							color: 'text.primary',

							'& svg': {
								fontSize: '1.50rem'
							}
						},
						[`.${alertClasses.icon}`]:
							severity === 'success'
								? {
										color: '#BAD221'
									}
								: {}
					}}
				>
					<Stack justifyContent="flex-start" alignItems="flex-start">
						{messageTitle && (
							<Typography
								variant="body1"
								fontWeight={700}
								color="text.primary"
							>
								{messageTitle}
							</Typography>
						)}
						<Typography
							variant="body1"
							mt={messageTitle ? 0.5 : 0}
							mb={0.5}
							fontWeight={500}
							color="text.secondary"
						>
							{message}
						</Typography>
						{action && (
							<Button
								variant="contained"
								sx={{
									mt: 1.5
								}}
								{...action}
								onClick={() => {
									action.onClick();

									if (action?.closeAfterClick) {
										handleClose();
									}
								}}
							/>
						)}
					</Stack>
				</Alert>
				{open && (
					<LinearProgress
						sx={theme => ({
							height: 4,
							borderRadius: 1,

							[`&.${linearProgressClasses.colorPrimary}`]: {
								backgroundColor: theme.palette.text.disabled
							},

							[`& .${linearProgressClasses.bar}`]: {
								backgroundColor:
									severity === 'success'
										? '#BAD221'
										: theme.palette[severity]?.main
							},

							position: 'absolute',
							width: 'calc(100% - 10px)',
							zIndex: -1,
							bottom: -2,
							left: 5
						})}
						variant="determinate"
						value={progress}
					/>
				)}
			</Box>
		);
	}
);
