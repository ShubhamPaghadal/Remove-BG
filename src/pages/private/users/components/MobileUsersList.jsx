import { useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { DotsMenuIcon } from '@/components/Icons';
import { IconButton } from '@/components/IconButton';
import { Pagination } from '@/components/Pagination';
import { MobileDotsMenu } from './MobileDotsMenu';

import { getPermissionsI18n } from '../utils';
import { TABLE_DATE_FORMAT } from '../constants';

export function MobileUsersList({
	i18nPath,
	loggedUserId,
	onDelete,
	onEdit,
	onInvite,
	page,
	pagesTotal,
	rows,
	setPage
}) {
	const [selectedUser, setSelectedUser] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const { t } = useTranslation();

	const handleClick = ({ currentTarget }, user) => {
		setSelectedUser(user);
		setAnchorEl(currentTarget);
	};

	return (
		<Box display="flex" gap={1} flexDirection="column">
			{rows
				?.filter(row => row.id !== loggedUserId)
				.map((userRow, idx) => {
					const isActive = Boolean(userRow.registrationCompleted);
					const permissionsI18n = getPermissionsI18n(
						userRow?.views,
						userRow?.role,
						t
					);

					return (
						<Box
							key={`${idx}-${userRow.id}`}
							sx={theme => ({
								borderBottom: `1px solid ${theme.palette.text.disabled}`,
								'&:first-of-type': {
									borderTop: `1px solid ${theme.palette.text.disabled}`
								},

								padding: '20px 0'
							})}
						>
							<Box display="flex" justifyContent="space-between">
								<Box
									key={`${idx}-${userRow.transactionId}`}
									sx={{
										display: 'flex',
										flexDirection: 'column'
									}}
								>
									<Typography>{userRow.email}</Typography>
									<Typography
										color="text.secondary"
										variant="body0"
										mt={0.5}
									>
										{t(`${i18nPath}.rows.creationDate`, {
											createdAt: `${dayjs.unix(userRow.createdAt).format(TABLE_DATE_FORMAT)}`
										})}
									</Typography>
									<Typography color="text.secondary" variant="body0">
										{userRow.lastLogin
											? t(`${i18nPath}.rows.lastLogin`, {
													lastLogin: `${dayjs.unix(userRow.lastLogin).format(TABLE_DATE_FORMAT)}`
												})
											: t(`${i18nPath}.rows.noLoginYet`)}
									</Typography>
								</Box>
								<IconButton
									variant="outlined"
									onClick={e => handleClick(e, userRow)}
								>
									<DotsMenuIcon />
								</IconButton>
							</Box>
							<Typography mt={1.5}>
								{t(`users.roles.${userRow.role}`)}
							</Typography>
							<Box
								mt={1.5}
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between'
								}}
							>
								<Typography>{permissionsI18n}</Typography>
								<Chip
									sx={theme => ({
										backgroundColor: isActive
											? theme.palette.success.main
											: '#FFD041'
									})}
									label={t(
										`${i18nPath}.rows.${isActive ? 'active' : 'pending'}`
									)}
								/>
							</Box>
						</Box>
					);
				})}
			{pagesTotal > 1 && (
				<Pagination
					count={pagesTotal}
					page={page}
					onChange={(_, value) => setPage(value)}
					sx={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '20px !important'
					}}
				/>
			)}
			<MobileDotsMenu
				anchorEl={anchorEl}
				isActive={Boolean(selectedUser?.registrationCompleted)}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				onDelete={() => {
					onDelete(selectedUser);
					setAnchorEl(null);
				}}
				onEdit={() => {
					onEdit(selectedUser);
					setAnchorEl(null);
				}}
				onInvite={() => {
					onInvite(selectedUser.id);
					setAnchorEl(null);
				}}
			/>
		</Box>
	);
}
