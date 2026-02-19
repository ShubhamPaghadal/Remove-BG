import { Box, CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { AddIcon } from '@/components/Icons';
import { useFetch } from '@/hooks/fetch';
import { showError } from '@/utils';
import { useMedia } from '@/hooks/responsive';
import { PageTitle } from '@/components/PageTitle';
import { IconButton } from '@/components/IconButton';
import collaboratorModel from '@/models/collaborator';

import { AddEditUserModal } from './components/AddEditUserModal';
import { EmptyState } from './components/EmptyState';
import { UsersTable } from './components/UsersTable';
import { useUserPermissions } from '../hooks/hooks';

export function Users() {
	const [page, setPage] = useState(1);
	const [isAddEditUserModalOpen, setIsAddEditUserModalOpen] = useState(false);
	const { t } = useTranslation();
	const mdDown = useMedia('mdDown');
	const { redirectIfNoPermissions } = useUserPermissions();

	function handleAddUserClick() {
		setIsAddEditUserModalOpen(true);
	}

	const {
		fetch: fetchUsers,
		data: { pagination, rows: users } = {},
		isLoading: isUsersLoading
	} = useFetch(collaboratorModel.list.bind(collaboratorModel), {
		onError: showError
	});

	useEffect(() => {
		redirectIfNoPermissions();
	}, []);

	if (isUsersLoading)
		return (
			<Box textAlign="center">
				<CircularProgress />
			</Box>
		);

	return (
		<div>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				mb={{ xs: 3, sm: 4 }}
			>
				<PageTitle>{t('pageTitles.users')}</PageTitle>

				{mdDown ? (
					<IconButton variant="contained" onClick={handleAddUserClick}>
						<AddIcon />
					</IconButton>
				) : (
					<Button variant="contained" onClick={handleAddUserClick}>
						{t('users.buttonAddUser')}
					</Button>
				)}
			</Stack>

			{users?.length > 1 ? (
				<UsersTable
					fetchUsers={fetchUsers}
					page={page}
					pageSize={10}
					pagesTotal={pagination?.total_pages}
					rows={users}
					setPage={setPage}
				/>
			) : (
				<EmptyState onClick={handleAddUserClick} />
			)}
			<AddEditUserModal
				fetchUsers={fetchUsers}
				open={isAddEditUserModalOpen}
				onClose={() => setIsAddEditUserModalOpen(false)}
			/>
		</div>
	);
}
