import {
	Box,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { DeleteIcon, EditIcon, MailIcon } from '@/components/Icons';
import { IconButton } from '@/components/IconButton';
import { Pagination } from '@/components/Pagination';

import { getValueIfRtl } from '@/utils/rtlStyle';
import { getPermissionsI18n } from '../utils';
import { TABLE_DATE_FORMAT } from '../constants';

export function DesktopUsersTable({
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
	const { t } = useTranslation();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'end',
				marginTop: '48px !important'
			}}
		>
			<TableContainer>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell
								sx={{
									padding: '0 0 8px',
									width: '30%'
								}}
							>
								<Typography
									fontWeight="bold"
									variant="body0"
									sx={theme => ({
										color: theme.palette.text.secondary
									})}
								>
									{t(`${i18nPath}.headers.users`)}
								</Typography>
							</TableCell>
							<TableCell
								sx={{
									padding: '0 0 8px',
									width: '15%'
								}}
							>
								<Typography
									fontWeight="bold"
									variant="body0"
									sx={theme => ({
										color: theme.palette.text.secondary
									})}
								>
									{t(`${i18nPath}.headers.role`)}
								</Typography>
							</TableCell>
							<TableCell
								sx={{
									padding: '0 8px 8px',
									width: '20%'
								}}
							>
								<Typography
									fontWeight="bold"
									variant="body0"
									sx={theme => ({
										color: theme.palette.text.secondary
									})}
								>
									{t(`${i18nPath}.headers.permissions`)}
								</Typography>
							</TableCell>
							<TableCell
								sx={{
									padding: '0 0 8px',
									width: '15%'
								}}
							>
								<Typography
									fontWeight="bold"
									variant="body0"
									sx={theme => ({
										color: theme.palette.text.secondary
									})}
								>
									{t(`${i18nPath}.headers.status`)}
								</Typography>
							</TableCell>
							<TableCell
								sx={{
									padding: '0 0 8px',
									width: '20%'
								}}
							/>
						</TableRow>
					</TableHead>
					<TableBody>
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
									<TableRow key={`${idx}-${userRow.id}`}>
										<TableCell
											component="th"
											scope="row"
											sx={theme => ({
												color: theme.palette.text.primary,
												width: '30%'
											})}
										>
											<Typography>{userRow.email}</Typography>
											<Typography
												component="p"
												color="text.secondary"
												variant="body0"
											>
												{t(`${i18nPath}.rows.creationDate`, {
													createdAt: `${dayjs.unix(userRow.createdAt).format(TABLE_DATE_FORMAT)}`
												})}
											</Typography>
											<Typography
												component="p"
												color="text.secondary"
												variant="body0"
											>
												{userRow.lastLogin
													? t(`${i18nPath}.rows.lastLogin`, {
															lastLogin: `${dayjs.unix(userRow.lastLogin).format(TABLE_DATE_FORMAT)}`
														})
													: t(`${i18nPath}.rows.noLoginYet`)}
											</Typography>
										</TableCell>
										<TableCell
											sx={theme => ({
												color: theme.palette.text.primary,
												paddingLeft: 0,
												paddingRight: 0,
												width: '15%'
											})}
										>
											{t(`users.roles.${userRow.role}`)}
										</TableCell>
										<TableCell
											sx={theme => ({
												color: theme.palette.text.secondary,
												paddingLeft: 1,
												paddingRight: 1,
												width: '20%'
											})}
										>
											{permissionsI18n}
										</TableCell>
										<TableCell
											sx={theme => ({
												color: theme.palette.text.primary,
												paddingLeft: 0,
												paddingRight: 0,
												width: '15%'
											})}
										>
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
										</TableCell>
										<TableCell
											sx={theme => ({
												color: theme.palette.text.secondary,
												paddingLeft: 0,
												paddingRight: 0,
												width: '20%'
											})}
										>
											<Box
												display="flex"
												gap={1.5}
												useFlexGap
												justifyContent={getValueIfRtl({
													value: 'end',
													alternativeValeu: 'start'
												})}
											>
												<IconButton
													variant="outlined"
													onClick={() => onEdit(userRow)}
												>
													<EditIcon />
												</IconButton>
												<IconButton
													disabled={isActive}
													variant="outlined"
													onClick={() => onInvite(userRow.id)}
												>
													<MailIcon />
												</IconButton>
												<IconButton
													variant="outlined"
													onClick={() => onDelete(userRow)}
												>
													<DeleteIcon />
												</IconButton>
											</Box>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			{pagesTotal > 1 && (
				<Pagination
					count={pagesTotal}
					page={page}
					onChange={(_, value) => setPage(value)}
					sx={{ marginTop: '20px !important' }}
				/>
			)}
		</Box>
	);
}
