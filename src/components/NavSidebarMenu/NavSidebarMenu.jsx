import { useState } from 'react';

import routes from '@/routes';
import {
	Dialog,
	dialogContentClasses,
	DialogContent,
	List,
	ListItemButton,
	ListItemIcon,
	Stack,
	Typography,
	dialogClasses,
	paperClasses,
	Box
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Form } from '@/pages/public/contact/Form.jsx';
import {
	AccountCircleIcon,
	BackgroundReplaceIcon,
	CloseIcon,
	FaqIcon,
	GroupOfUsersIcon,
	ImagesIcon,
	ReceiptLongIcon
} from '@/components/Icons';
import { useSelector } from 'react-redux';

import { useAuthMe } from '@/store/auth/selectors';
import { ROLES } from '@/pages/private/users/constants';

export function NavSidebarMenu({ onClose }) {
	const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
	const { t } = useTranslation();
	const authMe = useSelector(useAuthMe);

	const userData = authMe?.data;
	const userViews = userData?.views;

	const handleOpenModalForm = () => {
		setIsUrlModalOpen(true);
	};

	function checkPermission(permission) {
		return permission && userData?.parentAccount;
	}

	const menuItems = [
		{
			id: 'remove-bg',
			label: 'pageTitles.removeBackground',
			path: routes.dashboard,
			icon: <BackgroundReplaceIcon />,
			hideItem: checkPermission(userData?.role === ROLES.LIMITED)
		},
		{
			id: 'my-images',
			label: 'pageTitles.myImages',
			path: routes.myImages,
			icon: <ImagesIcon />,
			hideItem: checkPermission(!userViews?.myImages)
		},
		{
			id: 'billing',
			label: 'pageTitles.billing',
			path: routes.billing,
			icon: <ReceiptLongIcon />,
			hideItem: checkPermission(!userViews?.billing)
		},
		{
			id: 'users',
			label: 'pageTitles.users',
			path: routes.users,
			icon: <GroupOfUsersIcon />,
			hideItem: checkPermission(userData?.role !== ROLES.ADMIN)
		},
		{
			id: 'myAccount',
			label: 'pageTitles.myAccount',
			path: routes.myAccount,
			icon: <AccountCircleIcon />
		},
		{
			id: 'contact',
			label: 'common.contact',
			path: routes.contact,
			icon: <FaqIcon />
		}
	];

	return (
		<List
			disablePadding
			sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}
		>
			{menuItems.map(item => {
				if (item.hideItem) return null;

				const isContact = item.id === 'contact';

				return (
					<ListItemButton
						key={item.id}
						LinkComponent={isContact ? null : NavLink}
						to={item.path}
						onClick={() => {
							if (isContact) handleOpenModalForm();
							else onClose();
						}}
						sx={{
							minHeight: 40,
							borderRadius: 2,
							color: 'text.secondary',
							px: 1,
							'&.active': {
								bgcolor: 'primary.lightest',
								color: 'text.primary'
							}
						}}
					>
						<Stack direction="row" alignItems="center" width={1}>
							{!!item.icon && (
								<ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
									{item.icon}
								</ListItemIcon>
							)}
							<Typography
								sx={{
									fontWeight: 600,
									color: 'inherit'
								}}
							>
								{t(item.label)}
							</Typography>
						</Stack>
					</ListItemButton>
				);
			})}
			<ContactModal
				open={isUrlModalOpen}
				onClose={() => {
					setIsUrlModalOpen(false);
					onClose();
				}}
			/>
		</List>
	);
}

function ContactModal({ open, onClose, ...props }) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			{...props}
			sx={{
				[`.${dialogClasses.paper}`]: {
					padding: 0
				},
				[`.${dialogContentClasses.root}`]: {
					padding: 2
				},
				[`.${paperClasses.root}`]: {
					border: 'none',
					boxShadow: 'none'
				}
			}}
		>
			<DialogContent>
				<Box component="span" display="flex" justifyContent="end">
					<CloseIcon onClick={onClose} cursor="pointer" />
				</Box>
				<Form
					p={0}
					m={0}
					boxSx={{
						marginTop: '0px !important'
					}}
					cardSx={{
						padding: 0,
						px: 4
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
