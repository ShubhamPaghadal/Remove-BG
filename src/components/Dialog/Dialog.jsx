import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog as MuiDialog } from '@mui/material';
import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import { CloseIcon } from '../Icons';
import { IconButton } from '../IconButton';

function DialogBase({ children, hasCross = true, ...props }, ref) {
	const { t } = useTranslation();

	return (
		<MuiDialog {...props} ref={ref}>
			<div>
				{props.onClose && hasCross && (
					<IconButton
						aria-label={t('common.close')}
						onClick={props.onClose}
						sx={{
							position: 'absolute',
							right: removeValueIfRtl({ value: 16 }),
							left: getValueIfRtl({ value: 16 }),
							top: 16,
							color: 'text.primary',
							zIndex: 1
						}}
					>
						<CloseIcon />
					</IconButton>
				)}
				{children}
			</div>
		</MuiDialog>
	);
}

export const Dialog = forwardRef(DialogBase);
