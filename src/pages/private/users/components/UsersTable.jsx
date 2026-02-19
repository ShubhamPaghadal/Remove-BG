import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { showError, showSuccess } from '@/utils';
import { useAuthMe } from '@/store/auth/selectors';
import { useMedia } from '@/hooks/responsive';
import collaboratorModel from '@/models/collaborator';

import { AddEditUserModal } from './AddEditUserModal';
import { DeleteUserModal } from './DeleteUserModal';
import { DesktopUsersTable } from './DesktopUsersTable';
import { MobileUsersList } from './MobileUsersList';

const i18nPath = 'users.table';

export function UsersTable({ fetchUsers, page, pagesTotal, rows, setPage }) {
	const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
	const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const authMe = useSelector(useAuthMe);
	const mdDown = useMedia('mdDown');
	const { t } = useTranslation();

	const loggedUserId = authMe.data.id;

	function handlePageChange(pageNumber) {
		fetchUsers({ page: pageNumber });
		setPage(pageNumber);
	}

	async function handleSendInvitation(id) {
		try {
			await collaboratorModel.sendInvitation(id);
			showSuccess(t(`${i18nPath}.snackbarSuccess.invite`));
		} catch (err) {
			showError(err);
		}
	}

	async function handleDeleteClick(user) {
		setSelectedUser(user);
		setIsDeleteUserModalOpen(true);
	}
	async function handleDelete() {
		try {
			await collaboratorModel.deleteCollaborator(selectedUser.id);
			fetchUsers();
			showSuccess(t('users.deleteUserModal.snackbarSuccess'));
			setIsDeleteUserModalOpen(false);
		} catch (err) {
			showError(err);
		}
	}

	async function handleEditClick(user) {
		setSelectedUser(user);
		setIsEditUserModalOpen(true);
	}

	return (
		<>
			{mdDown ? (
				<MobileUsersList
					i18nPath={i18nPath}
					loggedUserId={loggedUserId}
					onDelete={handleDeleteClick}
					onEdit={handleEditClick}
					onInvite={handleSendInvitation}
					page={page}
					pagesTotal={pagesTotal}
					rows={rows}
					setPage={handlePageChange}
				/>
			) : (
				<DesktopUsersTable
					i18nPath={i18nPath}
					loggedUserId={loggedUserId}
					onDelete={handleDeleteClick}
					onEdit={handleEditClick}
					onInvite={handleSendInvitation}
					page={page}
					pagesTotal={pagesTotal}
					rows={rows}
					setPage={handlePageChange}
				/>
			)}
			<DeleteUserModal
				fetchUsers={fetchUsers}
				open={isDeleteUserModalOpen}
				onClose={() => setIsDeleteUserModalOpen(false)}
				onConfirm={handleDelete}
				userName={selectedUser?.name ?? selectedUser?.email}
			/>
			<AddEditUserModal
				editMode
				fetchUsers={fetchUsers}
				open={isEditUserModalOpen}
				onClose={() => setIsEditUserModalOpen(false)}
				user={selectedUser}
			/>
		</>
	);
}
