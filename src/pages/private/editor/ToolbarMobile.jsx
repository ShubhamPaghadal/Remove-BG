import { useSelector } from 'react-redux';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons';
import { Box, ClickAwayListener, Slide, Stack } from '@mui/material';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toolbar } from './Toolbar';
import { DownloadButton } from './DownloadButton';

export function ToolbarMobile({
	downloadProps,
	downloadBulkProps,
	goPrev,
	goNext,
	disabledArrows,
	saveDisabled = false
}) {
	const [openToolbar, setOpenToolbar] = useState(false);
	const { t } = useTranslation();
	const containerRef = useRef(null);
	const { bulkMode } = useSelector(state => state.editor);

	const handleOpenToolbar = () => setOpenToolbar(true);

	const handleCloseToolbar = () => setOpenToolbar(false);

	const bulkActionsRender = (
		<Stack direction="row" alignItems="center" justifyContent="space-between">
			<IconButton
				variant="outlined"
				onClick={goNext}
				disabled={disabledArrows}
			>
				<ChevronLeftIcon />
			</IconButton>
			<Button
				variant="contained"
				loading={downloadBulkProps?.loading}
				onClick={downloadBulkProps?.onDownload}
				disabled={downloadBulkProps?.disabled}
				sx={{
					minWidth: 164,
					maxWidth: 'calc(100% - 100px)',
					pl: 1,
					pr: 1
				}}
			>
				{t('common.downloadImages')}
			</Button>
			<IconButton
				variant="outlined"
				onClick={goPrev}
				disabled={disabledArrows}
			>
				<ChevronRightIcon />
			</IconButton>
		</Stack>
	);

	return (
		<ClickAwayListener onClickAway={handleCloseToolbar}>
			<Box
				sx={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					zIndex: 10,
					width: '100%',
					px: 3.5,
					pt: 2,
					pb: 1.5,
					background: '#ffffff',
					borderRadius: '8px 8px 0px 0px',
					boxShadow: '0px -2px 4px 0px rgba(0, 0, 0, 0.08)'
				}}
				ref={containerRef}
			>
				{bulkMode ? (
					bulkActionsRender
				) : (
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Box position="relative">
							<Button
								variant="text"
								color="secondary"
								onClick={handleOpenToolbar}
								disabled={false}
							>
								{t('common.edit')}
							</Button>
						</Box>

						{downloadProps && <DownloadButton {...downloadProps} />}
					</Stack>
				)}

				<Slide
					direction="up"
					in={openToolbar}
					container={containerRef.current}
					mountOnEnter
					unmountOnExit
				>
					<Box position="absolute" bottom={0} left={0} width="100%">
						<Toolbar
							handleCloseToolbar={handleCloseToolbar}
							saveDisabled={saveDisabled}
						/>
					</Box>
				</Slide>
			</Box>
		</ClickAwayListener>
	);
}
