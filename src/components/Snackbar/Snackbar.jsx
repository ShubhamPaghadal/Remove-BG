import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MuiSnackbar from '@mui/material/Snackbar';
import Alert, { alertClasses } from '@mui/material/Alert';
import { toCamelCase } from '@/utils';
import { useMedia } from '@/hooks/responsive';

import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import { LongTextAlert } from './LongTextAlert';

const DURATION = 3000;

export function Snackbar() {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState({
		message: ''
	});
	const { t, i18n } = useTranslation();
	const smDown = useMedia('smDown');

	const { message, messageKey, errorCode, uuid } = data;

	const suffix = uuid ? ` Error ID: ${uuid}` : '';
	let finalMessage = messageKey ? t(messageKey) : message;

	if (errorCode) {
		finalMessage = i18n.exists(`errors.${toCamelCase(errorCode)}`)
			? t(`errors.${toCamelCase(errorCode)}`)
			: finalMessage;
	}

	finalMessage += suffix;

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	useEffect(() => {
		function handleShowSnackbar(event) {
			setOpen(true);
			setData(event.detail);
		}

		window.addEventListener('showSnackbar', handleShowSnackbar);

		return () => {
			window.removeEventListener('showSnackbar', handleShowSnackbar);
		};
	}, []);

	const isLongTextVariant = data?.variant === 'long-text';

	return (
		<MuiSnackbar
			open={open}
			autoHideDuration={data.duration || DURATION}
			onClose={handleClose}
			sx={theme => ({
				top: isLongTextVariant ? 60 : { xs: 60, sm: 'inherit' },
				[`.${alertClasses.action}`]: {
					marginRight: getValueIfRtl({
						theme,
						value: 'auto',
						defaultValue: '-8px'
					}),
					marginLeft: removeValueIfRtl({
						theme,
						value: 'auto',
						defaultValue: '0px'
					}),
					marginTop: getValueIfRtl({
						theme,
						value: '3px',
						defaultValue: '8px'
					}),
					paddingLeft: getValueIfRtl({
						theme,
						value: '0px',
						defaultValue: '16px'
					})
				}
			})}
			anchorOrigin={
				isLongTextVariant || smDown
					? { vertical: 'top', horizontal: 'center' }
					: { vertical: 'bottom', horizontal: 'right' }
			}
		>
			{isLongTextVariant ? (
				<LongTextAlert
					{...data}
					open={open}
					duration={data.duration || DURATION}
					handleClose={handleClose}
				/>
			) : (
				<Alert
					onClose={handleClose}
					severity={data.severity}
					sx={{
						width: { xs: 'calc(100% - 40px)', sm: '100%' },
						backgroundColor: 'background.default',
						alignItems: 'right',
						minWidth: { xs: 280, sm: 340 },
						maxWidth: { xs: 400, sm: 'inherit' },
						border: 1,
						borderColor: 'divider',
						boxShadow: '0px 4px 6px 0px rgba(205, 209, 224, 0.50)',
						[`.${alertClasses.message}`]: {
							color: 'text.secondary',
							fontSize: 14
						},
						[`.${alertClasses.action}`]: {
							pt: 0,
							display: { xs: 'none', sm: 'inherit' }
						},
						[`.${alertClasses.icon}`]:
							data.severity === 'success'
								? {
										color: '#BAD221'
									}
								: {}
					}}
				>
					&nbsp;{finalMessage}
				</Alert>
			)}
		</MuiSnackbar>
	);
}
