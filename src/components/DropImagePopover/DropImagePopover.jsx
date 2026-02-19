import { Box, Typography, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PictureFrame } from '@/components/Icons';

export function DropImagePopover({ dropzone }) {
	const { t } = useTranslation();

	const { isDragActive } = dropzone;

	return (
		<Fade in={isDragActive}>
			<Box
				sx={{
					boxSizing: 'border-box',
					width: '100%',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					position: 'absolute',
					backgroundColor: 'rgba(223, 242, 101, 0.75)',
					padding: 8.5,
					zIndex: 100,
					pointerEvents: 'none'
				}}
			>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					sx={{
						borderRadius: '20px',
						border: '2px dashed #FFF',
						width: '100%',
						height: '100%'
					}}
				>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						sx={{ position: 'absolute', zIndex: 1 }}
					>
						<PictureFrame sx={{ fontSize: 220 }} />
					</Box>
					<Typography
						sx={{
							fontSize: 40,
							fontWeight: 500,
							zIndex: 2
						}}
					>
						{t('dropzone.dropImagePopover')}
					</Typography>
				</Box>
			</Box>
		</Fade>
	);
}
