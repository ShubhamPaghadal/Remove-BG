import { IconButton } from '@/components/IconButton';
import {
	AddIcon,
	CenterIcon,
	CompareIcon,
	RedoIcon,
	RemoveIcon,
	UndoIcon
} from '@/components/Icons';
import { useShallowSelector } from '@/hooks';
import { Box, Divider, Stack } from '@mui/material';
import { isRtl } from '@/utils/rtlStyle';

import { DownloadButton } from './DownloadButton';

export function Actions({
	onZoomIn = () => { },
	onZoomOut = () => { },
	onUndo = () => { },
	onRedo = () => { },
	onShowOriginalMouseDown = () => { },
	onShowOriginalMouseUp = () => { },
	disabledZoomIn = false,
	disabledZoomOut = false,
	disabledUndo = false,
	disabledRedo = false,
	downloadBulkProps = {},
	onCenterImage = () => { }
}) {
	const { bulkMode } = useShallowSelector(state => ({
		downloadImage: state.editor.downloadImage,
		imageSize: state.editor.imageSize,
		bulkMode: state.editor.bulkMode
	}));

	const endIconStyle = isRtl()
		? {
			position: 'absolute',
			left: 16,
			marginLeft: 0
		}
		: {};

	return (
		<Stack
			direction="row"
			justifyContent={{ xs: 'center', md: 'space-between' }}
			flexWrap="wrap"
			gap={2}
			alignItems="center"
			sx={{ width: '100%' }}
		>
			<Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
				<IconButton
					color="secondary"
					onClick={onZoomOut}
					disabled={disabledZoomOut}
				>
					<RemoveIcon />
				</IconButton>
				<IconButton
					color="secondary"
					onClick={onZoomIn}
					disabled={disabledZoomIn}
				>
					<AddIcon />
				</IconButton>

				<Divider orientation="vertical" flexItem />

				<IconButton
					color="secondary"
					onMouseDown={onShowOriginalMouseDown}
					onMouseUp={onShowOriginalMouseUp}
					onTouchStart={onShowOriginalMouseDown}
					onTouchEnd={onShowOriginalMouseUp}
				>
					<CompareIcon />
				</IconButton>

				<Divider orientation="vertical" flexItem />

				<IconButton
					color="secondary"
					onClick={onUndo}
					disabled={disabledUndo}
				>
					<UndoIcon />
				</IconButton>

				<IconButton
					color="secondary"
					onClick={onRedo}
					disabled={disabledRedo}
				>
					<RedoIcon />
				</IconButton>

				<Divider orientation="vertical" flexItem />

				<IconButton color="secondary" onClick={onCenterImage}>
					<CenterIcon />
				</IconButton>
			</Stack>

			<Box sx={{ display: { xs: 'none', md: 'block' } }}>
				{bulkMode && (
					<DownloadButton
						onDownload={downloadBulkProps?.onDownload}
						loading={downloadBulkProps?.loading}
						disabled={downloadBulkProps?.disabled}
						showResolution={false}
						buttonProps={{
							sx: {
								minWidth: 165,
								height: 40,
								'&& .MuiButton-endIcon': endIconStyle
							}
						}}
					/>
				)}
			</Box>
		</Stack>
	);
}
