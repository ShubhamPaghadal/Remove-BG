import { DeleteIcon, EditIcon, MailIcon } from '@/components/Icons';

import {
	listClasses,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export function MobileDotsMenu({
	anchorEl,
	isActive,
	open,
	onDelete,
	onEdit,
	onInvite,
	onClose
}) {
	const { t } = useTranslation();

	const menuItems = [
		{
			i18nKey: 'edit',
			icon: <EditIcon />,
			onClick: onEdit,
			disabled: false
		},
		{
			i18nKey: 'sendEmail',
			icon: <MailIcon />,
			onClick: onInvite,
			disabled: isActive
		},
		{
			i18nKey: 'delete',
			icon: <DeleteIcon />,
			onClick: onDelete,
			disabled: false
		}
	];

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			sx={{
				[`.${listClasses.root}`]: {
					width: 200
				}
			}}
		>
			{menuItems.map(({ disabled, i18nKey, icon, onClick }) => (
				<MenuItem disabled={disabled} key={i18nKey} onClick={onClick}>
					<ListItemIcon>{icon}</ListItemIcon>
					<ListItemText>{t(`common.${i18nKey}`)}</ListItemText>
				</MenuItem>
			))}
		</Menu>
	);
}
