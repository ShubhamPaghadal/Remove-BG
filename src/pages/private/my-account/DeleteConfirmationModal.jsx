import { useEffect, useState } from 'react';

import { Box, FormControl, FormLabel, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Button } from '@/components/Button';
import { Dialog, DialogContent, dialogClasses } from '@/components/Dialog';
import { TextFieldController } from '@/components/TextFieldController';
import { logout } from '@/store/auth/thunks';
import { showError, showSuccess } from '@/utils';
import { useAuthMe } from '@/store/auth/selectors';
import { yupResolver } from '@hookform/resolvers/yup';
import userModel from '@/models/user';

const i18nPath = 'myAccount.deleteAccount.modal';

export function DeleteConfirmationModal({
	closeText,
	confirmText,
	onClose,
	onConfirm,
	open,
	text,
	...props
}) {
	const [loading, setLoading] = useState(false);
	const authMe = useSelector(useAuthMe);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const validationSchema = Yup.object({
		email: Yup.string().email().required()
	});

	const { control, handleSubmit, reset, watch } = useForm({
		resolver: yupResolver(validationSchema),
		mode: 'onChange',
		defaultValues: { imageUrl: '' }
	});

	async function onSubmit() {
		setLoading(true);

		try {
			await userModel.delete();
			await dispatch(logout()).unwrap();

			navigate('/');
			showSuccess(t(`${i18nPath}.userDeleteSuccess`));
		} catch (error) {
			showError(error);
		}

		setLoading(false);
	}

	useEffect(() => {
		if (!open) reset();
	}, [open]);

	const email = watch('email');

	return (
		<Dialog
			onClose={onClose}
			open={open}
			sx={{
				[`.${dialogClasses.paper}`]: {
					overflow: 'hidden',
					width: '388px'
				}
			}}
			{...props}
		>
			<DialogContent
				sx={{
					gap: '24px',
					padding: '20px'
				}}
			>
				<Typography fontSize="20px" fontWeight="bold">
					{t(`${i18nPath}.title`)}
				</Typography>
				<Box
					component="form"
					marginTop={3}
					onSubmit={handleSubmit(onSubmit)}
				>
					<FormControl fullWidth>
						<FormLabel htmlFor="imageUrl">
							<Typography
								sx={{
									fontSize: 14,
									fontWeight: 500,
									mb: 1,
									textAlign: 'left'
								}}
								color="text.secondary"
							>
								{t(`${i18nPath}.inputLabel`)}
							</Typography>
						</FormLabel>
						<TextFieldController
							control={control}
							fullWidth
							id="email"
							name="email"
							placeholder={authMe.data.email}
							variant="filled"
						/>
						<Box mt={4}>
							<Button
								color="error"
								disabled={email !== authMe.data.email || loading}
								fullWidth
								loading={loading}
								type="submit"
								variant="contained"
							>
								{!loading && t(`${i18nPath}.deleteButton`)}
							</Button>
							<Button
								disabled={loading}
								fullWidth
								onClick={onClose}
								sx={{ mt: 1 }}
								variant="text"
							>
								{t(`${i18nPath}.cancelButton`)}
							</Button>
						</Box>
					</FormControl>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
