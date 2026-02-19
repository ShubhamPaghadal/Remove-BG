import { useState } from 'react';
import { Box, Stack, Typography, alpha } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import { Card } from '../Card';
import { ButtonUploadImage } from '../ButtonUploadImage';
import { Button } from '../Button';
import { PasteUrlModal } from '../PasteUrlModal/PasteUrlModal';

export function ImageDropzone({
	dropzone,
	noDrag,
	sx,
	variant,
	loading,
	...props
}) {
	const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
	const { t } = useTranslation();

	const {
		getRootProps,
		getClickRootProps,
		getInputProps,
		isDragActive,
		disabled
	} = dropzone;

	const rootProps = { ...(noDrag ? getClickRootProps() : getRootProps()) };

	const handleUrlClick = e => {
		e.preventDefault();
		e.stopPropagation();

		setIsUrlModalOpen(true);
	};

	return (
		<>
			<Card
				variant={variant}
				{...props}
				{...rootProps}
				sx={{
					cursor: loading || disabled ? 'default' : 'pointer',
					py: { xs: 3, sm: 4.75 },
					px: { xs: 3, sm: 4.75 },
					borderRadius: '10px',
					background: 'rgba(255, 255, 255, 0.50)',
					boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.15)',
					transitionProperty: 'background',
					...sx,
					...(isDragActive && {
						bgcolor: ({ palette }) => alpha(palette.divider, 0.5),
						opacity: 0.75
					}),
					'&:hover': {
						bgcolor: 'rgba(255, 255, 255, 0.75)',
						boxShadow: '0px 6px 12px 0px rgba(161, 130, 243, 0.80)',
						background: 'rgba(255, 255, 255, 0.75)',
						'> div': {
							border: { xs: 'none', sm: '1px dashed lightgray' }
						}
					}
				}}
			>
				<Box
					sx={{
						height: '100%',
						width: '100%',
						borderRadius: '10px'
					}}
				>
					<input {...getInputProps()} />
					<Stack
						height="100%"
						alignItems="center"
						justifyContent="center"
						spacing={2}
						textAlign="center"
					>
						<ButtonUploadImage loading={loading} disabled={disabled} />

						<Stack spacing={1}>
							<Typography
								color="text.primary"
								fontWeight="semi"
								variant="body2"
							>
								{t('dropzone.instructions')}
							</Typography>
							<Typography variant="body1">
								<Trans
									i18nKey="dropzone.pasteUrl"
									components={{
										linkButton: (
											<Button
												component="span"
												sx={{
													textDecoration: 'underline',
													padding: 0,
													minWidth: 'auto',
													fontWeight: 'bold',
													color: 'text.secondary'
												}}
												onClick={handleUrlClick}
											/>
										)
									}}
								/>
							</Typography>
						</Stack>
					</Stack>
				</Box>
			</Card>
			<PasteUrlModal
				open={isUrlModalOpen}
				onClose={() => setIsUrlModalOpen(false)}
			/>
		</>
	);
}
