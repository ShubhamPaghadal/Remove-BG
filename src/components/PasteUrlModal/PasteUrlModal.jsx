import { useEffect, useState } from 'react';

import { Box, FormControl, FormLabel, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Button } from '@/components/Button';
import { Dialog, DialogContent, dialogClasses } from '@/components/Dialog';
import { TextFieldController } from '@/components/TextFieldController';
import { useUploadFileFn } from '@/pages/private/editor/hooks';
import { yupResolver } from '@hookform/resolvers/yup';

export function PasteUrlModal({
	open,
	onClose,
	onConfirm,
	text,
	confirmText,
	closeText,
	...props
}) {
	const [loading, setLoading] = useState(false);
	const { t } = useTranslation();
	const { urlUploadFile } = useUploadFileFn();

	const validationSchema = Yup.object({
		imageUrl: Yup.string()
			.url(t('dropzone.pasteUrlModal.invalidInput'))
			.required(t('dropzone.pasteUrlModal.requiredInput'))
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isDirty }
	} = useForm({
		resolver: yupResolver(validationSchema),
		mode: 'onChange',
		defaultValues: { imageUrl: '' }
	});

	async function onSubmit(data) {
		setLoading(true);
		await urlUploadFile(data.imageUrl);
		setLoading(false);
	}

	useEffect(() => {
		if (!open) reset();
	}, [open]);

	return (
		<Dialog
			open={open}
			sx={{
				[`.${dialogClasses.paper}`]: {
					height: '280px',
					width: '388px',
					overflow: 'hidden'
				}
			}}
			onClose={onClose}
			{...props}
		>
			<DialogContent
				sx={{
					padding: '48px'
				}}
			>
				<Typography fontSize="20px" fontWeight="bold">
					{t('dropzone.pasteUrlModal.title')}
				</Typography>
				<Box
					marginTop={3}
					component="form"
					onSubmit={handleSubmit(onSubmit)}
				>
					<FormControl fullWidth>
						<FormLabel htmlFor="imageUrl">
							<Typography
								sx={{
									textAlign: 'left',
									fontSize: 14,
									fontWeight: 500,
									mb: 1
								}}
								color="text.secondary"
							>
								{t('dropzone.pasteUrlModal.imageUrlInputLabel')}
							</Typography>
						</FormLabel>
						<TextFieldController
							control={control}
							disabled={loading}
							fullWidth
							id="imageUrl"
							name="imageUrl"
							type="text"
						/>
						<Button
							fullWidth
							size="large"
							variant="contained"
							loading={loading}
							disabled={errors?.imageUrl || loading || !isDirty}
							type="submit"
							sx={{
								marginTop: '24px'
							}}
						>
							{t('dropzone.pasteUrlModal.accept')}
						</Button>
					</FormControl>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
