import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, dialogClasses } from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Box, FormControl, FormLabel, Stack, Typography } from '@mui/material';
import { TextFieldController } from '@/components/TextFieldController';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import transactionModel from '@/models/transaction';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showError } from '@/utils';
import { fetchCredits } from '@/store/editor/thunks';
import { MAX_DALLE_PROMPT_LENGTH } from './constants';

export function AIBgModal({
	transactionId,
	open,
	onClose,
	onSuccess,
	onError,
	sx,
	...props
}) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	const validationSchema = Yup.object({
		prompt: Yup.string().max(MAX_DALLE_PROMPT_LENGTH).required()
	});

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(validationSchema),
		mode: 'onChange',
		defaultValues: {
			prompt: ''
		}
	});

	const getCredits = async () => {
		try {
			await dispatch(fetchCredits()).unwrap();
		} catch (error) {
			showError(error);
		}
	};

	async function onSubmit(data) {
		try {
			setLoading(true);
			if (!transactionId) return;

			const generatedImg = await transactionModel.generateBackground(
				transactionId,
				data
			);

			onSuccess?.(generatedImg);
			getCredits();
		} catch (error) {
			onError?.(error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!open) {
			reset();
		}
	}, [open]);

	return (
		<Dialog
			open={open}
			sx={{
				...sx,
				[`.${dialogClasses.paper}`]: {
					width: '100%'
				}
			}}
			maxWidth="xs"
			onClose={onClose}
			{...props}
		>
			<DialogContent sx={{ p: 6 }}>
				<Box component="form" onSubmit={handleSubmit(onSubmit)}>
					<Box
						sx={theme => ({
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
							[theme.breakpoints.down('sm')]: {
								alignItems: 'flex-start'
							}
						})}
					>
						<Typography
							fontWeight="bold"
							sx={{
								fontSize: { xs: 16, sm: 20 }
							}}
						>
							{t('editor.toolbar.aiBackgrounds.modal.title')}
						</Typography>
						<Typography
							fontSize={{ xs: 12, sm: 14 }}
							color="text.secondary"
						>
							{t('editor.toolbar.aiBackgrounds.modal.subtitle')}
						</Typography>
					</Box>
					<Box mt={2} width="100%">
						<FormControl sx={{ width: '100%' }}>
							<FormLabel>
								<Typography
									sx={{
										textAlign: 'left',
										fontSize: 14,
										fontWeight: 500,
										mb: 1
									}}
									color="text.secondary"
								>
									{t('editor.toolbar.aiBackgrounds.modal.label')}
								</Typography>
							</FormLabel>
							<TextFieldController
								variant="filled"
								disabled={loading}
								fullWidth
								control={control}
								multiline
								id="prompt"
								name="prompt"
								placeholder={t(
									'editor.toolbar.aiBackgrounds.modal.placeholder'
								)}
								rows={5}
								sx={{ textarea: { boxShadow: 'none', px: 1.5 } }}
							/>
						</FormControl>
					</Box>
					<Stack
						direction="row"
						justifyContent="center"
						spacing={2}
						mt={3}
					>
						<Button
							fullWidth
							type="submit"
							variant="contained"
							loading={loading}
						>
							{t('editor.toolbar.aiBackgrounds.modal.button')}
						</Button>
					</Stack>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
