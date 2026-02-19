import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { v4 as uuid } from 'uuid';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { DEFAULT_MAX_IN_BYTES, getErrorParams } from '@/utils/transaction';

import { useDispatch, useSelector } from 'react-redux';
import { addCustomBackground, removeCustomBackground } from '@/store/editor';
import { getImageAccepted, showError, showSuccess } from '@/utils';
import { useTranslation } from 'react-i18next';
import { MagicIcon } from '@/components/Icons/MagicIcon';
import { Tooltip } from '@/components/Tooltip';
import { useMedia } from '@/hooks/responsive';

import { showNoCredits } from '@/components/NoCreditsModal/utils';
import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import { ImageButton } from './ImageButton';
import { getCustomBgPath, getTransparencyImage } from './utils';
import { BACKGROUND_ROWS_QUANTITY, TOOLBAR_BG_BUTTONS_SIZE } from './constants';
import { AddFileButton } from './AddFileButton';
import { AIBgModal } from './AIBgModal';

function getMobileItemsQty(items = []) {
	const extraItems = 3;
	const quantity = Math.ceil((items.length + extraItems) / 2);

	return Math.max(BACKGROUND_ROWS_QUANTITY, quantity);
}

export function BackgroundSelector({ handleChange = () => {}, value }) {
	const [aiOpen, setAiOpen] = useState(false);
	const loggedIn = useSelector(state => state.auth.loggedIn);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const mdDown = useMedia('mdDown');

	const {
		images = [],
		selectedImage,
		backgrounds = []
	} = useSelector(state => state.editor);
	const currentImage = images.find(item => item.id === selectedImage) || {};

	const { settings = {} } = currentImage;
	const { customBackgrounds = [], background } = settings || {};

	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		accept: getImageAccepted(),
		maxSize: DEFAULT_MAX_IN_BYTES,
		onDrop: files => {
			const [file] = files;

			const url = URL.createObjectURL(file);

			const bgId = uuid();

			dispatch(addCustomBackground({ id: bgId, path: url }));
			handleChange(bgId);
		}
	});

	const handleClose = () => setAiOpen(false);

	const handleOpen = () => {
		if (!loggedIn) {
			return showNoCredits();
		}

		setAiOpen(true);
	};

	const handleAiBackground = async aiData => {
		const { id } = aiData;

		dispatch(addCustomBackground({ id, path: getCustomBgPath(id) }));
		handleChange(id);
		setAiOpen(false);
		showSuccess(t('editor.toolbar.aiBackgrounds.modal.success'));
	};

	const allItems = [...backgrounds, ...customBackgrounds];

	return (
		<>
			<AIBgModal
				transactionId={selectedImage}
				open={aiOpen}
				onClose={handleClose}
				onSuccess={handleAiBackground}
				onError={error => {
					showError(...getErrorParams(error, t, navigate));
					handleClose();
				}}
			/>
			<Box pt={{ xs: 1.5, md: 3 }} pb={0} height="100%">
				<Scrollbars
					style={{
						width: '100%',
						height: mdDown ? 'auto' : 'calc(100% - 60px)',
						'&& .scrollbarTrackVertical': {
							backgroundColor: 'red',
							right: 'unset',
							left: '2px'
						}
					}}
					{...(mdDown ? { autoHeight: true, autoHeightMax: 120 } : {})}
					hideTracksWhenNotNeeded
					renderTrackHorizontal={props => (
						<div
							{...props}
							style={{ display: 'none' }}
							className="track-horizontal"
						/>
					)}
					renderTrackVertical={({ style, ...props }) => {
						return (
							<div
								{...props}
								className="track-vertical"
								style={{
									...style,
									borderRadius: 12,
									right: getValueIfRtl({
										value: 'unset',
										defaultValue: '2px'
									}),
									left: getValueIfRtl({
										value: '2px',
										defaultValue: 'unset'
									}),
									width: '6px',
									height: '152px'
								}}
							/>
						);
					}}
					renderView={props => (
						<div
							{...props}
							style={{
								...props.style,
								marginLeft: getValueIfRtl({
									defaultValue: 0,
									value: '-17px'
								}),
								marginRight: getValueIfRtl({
									value: 0,
									defaultValue: '-17px'
								})
							}}
						/>
					)}
				>
					<Stack
						direction="row"
						alignItems="center"
						gap={0.75}
						flexWrap={{ xs: 'nowrap', md: 'wrap' }}
						justifyContent="flex-start"
						py={{ xs: 0, md: 1 }}
						sx={{
							pr: removeValueIfRtl({
								defaultValue: 0,
								value: 1.5
							})
						}}
						{...(mdDown
							? {
									display: 'grid',
									gridTemplateColumns: `repeat(${getMobileItemsQty(allItems)}, ${TOOLBAR_BG_BUTTONS_SIZE}px)`
								}
							: {})}
					>
						<ImageButton
							size={TOOLBAR_BG_BUTTONS_SIZE}
							selected={!value && value !== 0}
							tooltipTitle={t(
								'editor.toolbar.tooltips.backgroundTransparent'
							)}
							onClick={() => {
								handleChange(null);
							}}
						>
							<Box
								sx={{
									width: '100%',
									height: '100%',
									backgroundRepeat: 'repeat',
									backgroundSize: '10px 10px',
									backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0',
									backgroundImage: getTransparencyImage(),
									m: 0
								}}
							/>
						</ImageButton>

						<Tooltip title={t('editor.toolbar.tooltips.backgroundImage')}>
							<AddFileButton
								size={TOOLBAR_BG_BUTTONS_SIZE}
								{...getRootProps()}
								inputProps={getInputProps()}
							/>
						</Tooltip>

						<Tooltip title={t('editor.toolbar.tooltips.backgroundIA')}>
							<Box component="span">
								<AddFileButton
									size={TOOLBAR_BG_BUTTONS_SIZE}
									onClick={handleOpen}
									iconElement={<MagicIcon />}
								/>
							</Box>
						</Tooltip>

						{!!customBackgrounds?.length &&
							customBackgrounds.map(item => {
								const selected = background === item.id;

								return (
									<ImageButton
										key={item.id}
										size={TOOLBAR_BG_BUTTONS_SIZE}
										imgSrc={item.path}
										imgAlt={item.path}
										selected={selected}
										onClick={() => {
											handleChange(item.id);
										}}
										{...(selected
											? {
													hoverDelete: () => {
														handleChange(null);
														dispatch(
															removeCustomBackground({
																id: item.id
															})
														);
													}
												}
											: {})}
									/>
								);
							})}

						{!!backgrounds?.length &&
							backgrounds.map(item => {
								return (
									<ImageButton
										key={`backgrounds-preset-${item.id}`}
										size={TOOLBAR_BG_BUTTONS_SIZE}
										imgSrc={item.path}
										imgAlt={item.path}
										selected={value === item.id}
										onClick={() => {
											handleChange(item.id);
										}}
									/>
								);
							})}
					</Stack>
				</Scrollbars>
			</Box>
		</>
	);
}
