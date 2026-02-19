import {
	Link,
	Tooltip as MuiTooltip,
	Stack,
	tooltipClasses
} from '@mui/material';
import { InfoIcon } from '@/components/Icons/InfoIcon';
import { useTranslation } from 'react-i18next';
import { useMedia } from '@/hooks/responsive';
import { useState } from 'react';

function BaseTooltip({ disabled, ...props }) {
	return (
		<MuiTooltip
			PopperProps={{
				sx: {
					'.MuiTooltip-tooltip': {
						backgroundColor: '#fff',
						color: 'text.secondary',
						boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.15)',
						p: 2,
						border: '1px solid #E8E8E8',
						borderRadius: 2,
						fontSize: 12,
						lineHeight: '20px',
						whiteSpace: 'pre-wrap',
						display: disabled ? 'none' : 'flex'
					}
				}
			}}
			enterTouchDelay={0}
			{...props}
		/>
	);
}

function IconTooltip({ iconSx = {}, ...props }) {
	return (
		<BaseTooltip {...props}>
			<InfoIcon sx={{ fontSize: '12px', cursor: 'help', ...iconSx }} />
		</BaseTooltip>
	);
}

export function Tooltip({ icon, ...props }) {
	if (icon) {
		return <IconTooltip {...props} />;
	}

	return <BaseTooltip {...props} />;
}

export function TooltipMobileFriendly({
	children,
	disableTooltip = false,
	isIcon = false,
	tooltipi18nPath
}) {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();
	const smDown = useMedia('smDown');

	const handleClose = () => {
		setOpen(false);
	};
	const handleOpen = () => {
		setOpen(true);
	};

	const propsSm = {
		disableHoverListener: disableTooltip,
		disableTouchListener: disableTooltip,
		title: smDown ? (
			<MobileTooltipContent
				handleClose={handleClose}
				tooltipi18nPath={tooltipi18nPath}
			/>
		) : (
			t(`${tooltipi18nPath}.title`)
		)
	};
	const propsSmUp = {
		...propsSm,
		PopperProps: {
			sx: {
				[`.${tooltipClasses.tooltip}`]: {
					backgroundColor: 'text.primary',
					borderRadius: 2
				}
			}
		}
	};

	return (
		<Tooltip
			open={open}
			onOpen={handleOpen}
			onClose={handleClose}
			{...(smDown ? propsSm : propsSmUp)}
		>
			{disableTooltip || isIcon ? children : <span>{children}</span>}
		</Tooltip>
	);
}

function MobileTooltipContent({ handleClose, tooltipi18nPath }) {
	const { t } = useTranslation();

	return (
		<Stack flexDirection="column" alignItems="flex-start" gap={1}>
			{t(`${tooltipi18nPath}.title`)}
			<Link component="button" underline="none" onClick={handleClose}>
				{t(t(`${tooltipi18nPath}.button`))}
			</Link>
		</Stack>
	);
}
