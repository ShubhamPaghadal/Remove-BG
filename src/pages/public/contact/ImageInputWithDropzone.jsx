import { Trans } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { Box, Stack, Typography } from '@mui/material';
import { UploadIcon } from '@/components/Icons/UploadIcon.jsx';
import { DeleteIcon } from '@/components/Icons';
import { IconButton } from '@/components/IconButton/index.js';
import { trimFileName } from '@/components/FileImageCard/utils';

/**
 * @param {object} props
 * @param {import('react-dropzone').DropzoneOptions} props.dropzoneProps
 */
export function ImageInputWithDropzone({
	dropzoneProps,
	accept,
	value,
	error,
	onDeleteFile
}) {
	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		accept: {
			'*/*': accept ?? []
		},
		...dropzoneProps
	});

	return (
		<Stack>
			<Box
				sx={{
					display: 'flex',
					border: `dashed 1px #B8B8B8`,
					px: 1.5,
					py: '10px',
					borderRadius: 2,
					justifyContent: 'center',
					'&:hover': {
						backgroundColor: 'rgb(161, 130, 243, 0.15)',
						border: '1px solid transparent',
						cursor: 'pointer'
					}
				}}
				{...getRootProps()}
			>
				<input {...getInputProps()} />
				<Stack direction="column">
					<Stack direction="row" alignItems="center">
						<Trans
							i18nKey="contact.form.dropzone.uploadOrDrop"
							components={{
								icon: (
									<UploadIcon
										sx={theme => ({
											color: theme.palette.primary.main,
											height: '16px',
											mr: 1
										})}
									/>
								),

								purpleText: (
									<Typography
										component="span"
										fontWeight="bold"
										color="primary.main"
										mx={0.5}
									/>
								)
							}}
						/>
					</Stack>
					{value && (
						<Typography
							sx={theme => ({
								width: '100%',
								color: theme.palette.primary.main
							})}
						>
							{trimFileName(value.name, 25)}
							<IconButton
								variant="text"
								onClick={e => {
									e.stopPropagation();
									if (onDeleteFile) {
										onDeleteFile();
									}
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Typography>
					)}
				</Stack>
			</Box>
			<Typography
				sx={theme => ({
					color: theme.palette.error.main,
					alignSelf: 'flex-start',
					fontSize: '0.75rem',
					marginTop: '3px'
				})}
			>
				{error && error?.message}
			</Typography>
		</Stack>
	);
}
