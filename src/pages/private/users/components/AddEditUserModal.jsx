import { useEffect, useState } from 'react';

import {
	Box,
	Checkbox,
	Divider,
	FormControl,
	FormHelperText,
	FormLabel,
	ListItemText,
	MenuItem,
	Stack,
	svgIconClasses,
	Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Button } from '@/components/Button';
import { CheckboxCheckedIcon, CheckboxIcon } from '@/components/Icons';
import { Dialog, DialogContent, dialogClasses } from '@/components/Dialog';
import { TextFieldController } from '@/components/TextFieldController';
import { yupResolver } from '@hookform/resolvers/yup';
import { showError, showSuccess } from '@/utils';
import collaboratorModel from '@/models/collaborator';

import {
	getValueIfRtl,
	removeValueIfRtl,
	reverseRightLeft
} from '@/utils/rtlStyle';
import {
	ADMIN_VIEWS,
	PERMISSIONS,
	ROLES,
	VIEWS_PERMISSIONS
} from '../constants';
import { SelectController } from './SelectController';
import { SwitchController } from './SwitchController';

const i18nPath = 'users.addEditUserModal';

const canDeleteSwitchTopMargin = {
	admin: 8,
	collaborator: 16,
	limited: 32
};

function getUserPermissionValue(user, permission) {
	return user.role === ROLES.ADMIN
		? PERMISSIONS.ADMIN[permission]
		: user.permissions[permission];
}

function getUserPermissions(user) {
	switch (user.role) {
		case ROLES.ADMIN:
			return PERMISSIONS.ADMIN;
		case ROLES.LIMITED:
			return PERMISSIONS.LIMITED;
		default:
			return {
				create: true,
				edit: true,
				delete: user.deleteImages
			};
	}
}

export function AddEditUserModal({
	fetchUsers,
	open,
	onClose,
	onConfirm,
	text,
	confirmText,
	closeText,
	editMode,
	user,
	...props
}) {
	const [isLoading, setIsLoading] = useState(false);
	const { t } = useTranslation();

	const validationSchema = Yup.object({
		email: Yup.string().email().required(),
		role: Yup.number().required()
	});

	const {
		control,
		formState: { isDirty, isValid },
		handleSubmit,
		reset,
		setError,
		watch
	} = useForm({
		resolver: yupResolver(validationSchema),
		mode: 'onChange',
		defaultValues: {
			canDeleteAccount: false,
			createAndEditImages: false,
			deleteImages: false,
			email: '',
			views: [],
			role: ''
		}
	});

	const views = watch('views');
	const role = watch('role');

	const isAdmin = role === ROLES.ADMIN;
	const isCollaborator = role === ROLES.COLLABORATOR;

	async function onSubmit(data) {
		const permissionsPayload = getUserPermissions(data);
		const viewsPayload =
			data.role === ROLES.ADMIN
				? ADMIN_VIEWS
				: VIEWS_PERMISSIONS.reduce((acc, key) => {
						acc[key] = data.views.includes(key);
						return acc;
					}, {});

		const basePayload = {
			canDeleteAccount: data.canDeleteAccount,
			permissions: permissionsPayload,
			role: data.role,
			views: viewsPayload
		};

		try {
			setIsLoading(true);
			if (editMode)
				await collaboratorModel.edit({
					...basePayload,
					collaboratorId: user.id
				});
			else
				await collaboratorModel.add({ ...basePayload, email: data.email });
			showSuccess(
				t(`${i18nPath}.snackbarSuccess.${editMode ? 'edit' : 'add'}`)
			);
			setIsLoading(false);
			fetchUsers();
		} catch (error) {
			if (error.status === 409) {
				setIsLoading(false);
				setError('email', {
					type: 'custom',
					message: t(`${i18nPath}.errors.${error.data.errorCode}`)
				});
				return;
			}
			showError(error);
		}

		onClose();
	}

	useEffect(() => {
		if (!open) {
			reset();
			setIsLoading(false);
		}
	}, [open]);

	useEffect(() => {
		if (user) {
			const userFormValues = {
				canDeleteAccount: Boolean(user.canDeleteAccount),
				createAndEditImages: getUserPermissionValue(user, 'create'),
				deleteImages: getUserPermissionValue(user, 'delete'),
				email: user.email,
				views: Object.entries(user.views)
					.filter(([, value]) => value)
					.map(([key]) => key),
				role: user.role
			};

			reset(userFormValues);
		}
	}, [user]);

	useEffect(() => {
		const currentFormValues = watch();

		if (!isDirty) return;

		if (isCollaborator) {
			const defaultCheckedViews = [
				VIEWS_PERMISSIONS[0],
				VIEWS_PERMISSIONS[2]
			];

			const userFormValues = {
				...currentFormValues,
				views: defaultCheckedViews,
				createAndEditImages: true,
				deleteImages: true
			};

			reset(userFormValues);
		} else {
			reset({
				...currentFormValues,
				views: []
			});
		}
	}, [role]);

	return (
		<Dialog
			open={open}
			sx={{
				[`.${dialogClasses.paper}`]: {
					width: { xs: 280, sm: 388 },
					overflow: 'hidden'
				}
			}}
			onClose={onClose}
			{...props}
		>
			<DialogContent
				sx={{
					padding: '48px 24px 24px'
				}}
			>
				<Typography fontSize="20px" fontWeight="bold">
					{t(`${i18nPath}.titles.${editMode ? 'edit' : 'add'}`)}
				</Typography>
				<Box
					marginTop={3}
					component="form"
					onSubmit={handleSubmit(onSubmit)}
				>
					<FormControl fullWidth>
						<FormLabel htmlFor="email">
							<Typography
								sx={{
									textAlign: reverseRightLeft({ direction: 'left' }),
									fontSize: 14,
									fontWeight: 500,
									mb: 1
								}}
								color="text.secondary"
							>
								{t(`${i18nPath}.inputs.emailLabel`)}
							</Typography>
						</FormLabel>
						<TextFieldController
							fullWidth
							control={control}
							disabled={editMode}
							id="email"
							name="email"
							placeholder={user?.email ?? t(`${i18nPath}.inputs.email`)}
						/>
					</FormControl>
					<FormControl fullWidth>
						<FormLabel htmlFor="role" sx={{ marginTop: 4 }}>
							<Typography
								sx={{
									textAlign: reverseRightLeft({ direction: 'left' }),
									fontSize: 14,
									fontWeight: 500,
									mb: 1
								}}
								color="text.secondary"
							>
								{t(`${i18nPath}.inputs.role`)}
							</Typography>
						</FormLabel>
						<SelectController
							control={control}
							id="role"
							name="role"
							placeholder={t(`${i18nPath}.inputs.role`)}
							renderOptions={Object.values(ROLES).map(roleId => {
								return (
									<MenuItem key={roleId} value={roleId}>
										{t(`users.roles.${roleId}`)}
									</MenuItem>
								);
							})}
						/>
					</FormControl>

					{isAdmin && (
						<FormHelperText
							sx={{ marginTop: 1 }}
							variant="body0"
							color="text.secondary"
						>
							{t(`${i18nPath}.descriptions.admin`)}
						</FormHelperText>
					)}

					{role && !isAdmin && (
						<FormControl fullWidth>
							<FormLabel htmlFor="views" sx={{ marginTop: 4 }}>
								<Typography
									sx={{
										textAlign: reverseRightLeft({
											direction: 'left'
										}),
										fontSize: 14,
										fontWeight: 500,
										mb: 1
									}}
									color="text.secondary"
								>
									{t(`${i18nPath}.inputs.permissions`)}
								</Typography>
							</FormLabel>
							<SelectController
								control={control}
								id="views"
								multiple
								name="views"
								placeholder={t(`${i18nPath}.inputs.permissions`)}
								renderOptions={VIEWS_PERMISSIONS.map((view, idx) => {
									const isEditorView = view === VIEWS_PERMISSIONS[0];
									const isMyimagesView = view === VIEWS_PERMISSIONS[2];

									if (role === ROLES.LIMITED && isEditorView)
										return null;

									const itemValue = t(
										`users.viewsPermissions.${view}`
									);
									const isChecked = views?.includes(view);
									const isDisabled =
										isCollaborator &&
										(isEditorView || isMyimagesView);

									return (
										<MenuItem
											disabled={isDisabled}
											key={`${idx}-${view}`}
											value={view}
										>
											<Checkbox
												icon={
													<CheckboxIcon
														sx={{
															[`${svgIconClasses}.root`]: {
																width: 2,
																height: 2
															}
														}}
													/>
												}
												checkedIcon={
													<CheckboxCheckedIcon size={16} />
												}
												checked={isChecked}
												value={itemValue}
											/>
											<ListItemText primary={itemValue} />
										</MenuItem>
									);
								})}
							/>
						</FormControl>
					)}

					{isCollaborator && (
						<Stack direction="column">
							<Typography sx={{ marginTop: 3 }} color="text.secondary">
								{t(`${i18nPath}.descriptions.collaborator`)}
							</Typography>
							<SwitchController
								control={control}
								name="deleteImages"
								label={t(`${i18nPath}.switches.deleteImages`)}
								sx={{ margin: '12px 0 0' }}
							/>
							<Divider sx={{ marginTop: 2 }} />
						</Stack>
					)}
					<SwitchController
						control={control}
						name="canDeleteAccount"
						label={t(`${i18nPath}.switches.canDeleteAccount`)}
						sx={{
							margin: `${canDeleteSwitchTopMargin[role] ?? 32}px 0 0`
						}}
					/>
					<Divider sx={{ marginTop: 2 }} />
					<Box sx={{ display: 'flex', marginTop: 3 }}>
						<Button
							fullWidth
							size="large"
							variant="outlined"
							onClick={onClose}
						>
							{t('common.cancel')}
						</Button>
						<Button
							fullWidth
							size="large"
							variant="contained"
							loading={isLoading}
							disabled={isLoading || (editMode && !isDirty) || !isValid}
							type="submit"
							sx={theme => ({
								marginLeft: removeValueIfRtl({ value: 2, theme }),
								marginRight: getValueIfRtl({ value: 2, theme })
							})}
						>
							{t(`common.${editMode ? 'edit' : 'add'}`)}
						</Button>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
