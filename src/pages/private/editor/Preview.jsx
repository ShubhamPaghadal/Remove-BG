import { useMedia } from '@/hooks/responsive';
import {
	debounce,
	showError,
	getDownloadFileName,
	downloadImage as downloadImageFn
} from '@/utils';
import { saveAs } from 'file-saver';
import { Card } from '@/components/Card';
import { Box, CardMedia, Stack } from '@mui/material';
import { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	saveInStack,
	setDownload,
	setImageReady,
	updateImageHasChanges
} from '@/store/editor';
import transactionModel from '@/models/transaction';
import { getErrorParams } from '@/utils/transaction';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MagicLoading } from '@/components/MagicLoading';

import { fetchCredits } from '@/store/editor/thunks';
import useSamInitializer, {
	useSamEvents,
	useSamEventsMobile
} from '@/hooks/sam';

import {
	useBackgroundListeners,
	useCropSelector,
	useImageEditionCallbacks,
	useImageZoomPan,
	useInitFabricImg,
	useKeyBindings,
	useZoomListener
} from './hooks';
import {
	canvasToBlob,
	getDataToSave,
	getImageUrl,
	getLQCanvas,
	getNameFromPath,
	getTransparencyImage
} from './utils';
import { MagicBrushCanvas } from './BrushCanvas';
import { PreviewLoading } from './PreviewLoading';
import SamContext from './sam/createContext';

const SEGMENT_IMAGE_COLOR = '#A182F3';

function Loading() {
	return (
		<Stack
			justifyContent="center"
			alignItems="center"
			sx={{
				background: 'rgba(255,255,255, 0.5)',
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				borderRadius: 3
			}}
		>
			<MagicLoading />
		</Stack>
	);
}

export function Preview({
	compare,
	currentImage,
	initialComparePosition = 100
}) {
	const {
		image: [image],
		maskSvgData: [maskSvgData],
		fixedSvgData: [fixedSvgData]
	} = useContext(SamContext);
	const { handleMouseMove, handleMouseOut, handleMaskClick, handleMouseIn } =
		useSamEvents();

	const { handleMaskClick: handleMaskClickMobile } = useSamEventsMobile();

	const canvasWrapperRef = useRef(null);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const canvasRef = useRef(null);
	const originalCanvasRef = useRef(null);
	const [brushCanvas, setBrushCanvas] = useState(null);
	const { loggedIn } = useSelector(state => state.auth);
	const mdDown = useMedia('mdDown');

	const segmentBoxEvents = mdDown
		? { onClick: handleMaskClickMobile }
		: {
				onMouseMove: handleMouseMove,
				onMouseEnter: handleMouseIn,
				onMouseOut: handleMouseOut,
				onClick: handleMaskClick
			};

	const customControlCallbacks = useImageEditionCallbacks();

	const {
		downloadImage = false,
		section,
		subsection,
		tab,
		localFiles = [],
		selectedImage,
		removeBackground: { loading: removing = false } = {},
		applyBrush: { loading: improving = false } = {}
	} = useSelector(state => state.editor);
	const dispatch = useDispatch();

	const [position, setPosition] = useState(initialComparePosition);
	const [triggeredAnimation, setTriggeredAnimation] = useState(false);

	const {
		metadata = {},
		settings = {},
		positions = {},
		latest = {},
		cropped = {},
		base = {},
		id,
		localId
	} = currentImage || {};
	const downloadFileName = getDownloadFileName(
		currentImage?.originalFileName ?? getNameFromPath(latest?.path)
	);

	const isActions = section === 'actions';
	const isBrush = subsection === 'brush' && isActions;
	const isSegment = subsection === 'segment' && tab === 'erase';
	const isCrop = section === 'actions' && tab === 'trim';

	const basePath = getImageUrl(base?.path);
	const latestPath = getImageUrl(latest?.path);
	const imageUrl = cropped?.path || latestPath;

	const hasLocalFiles = !!localFiles?.length;

	const previewImage = hasLocalFiles
		? localFiles?.[0]?.blob
		: currentImage?.tempBlob || basePath;

	const {
		backgroundColor,
		undoStack,
		angle = 0,
		origin = [0, 0],
		scale = [1, 1],
		crop = null,
		dirty = false
	} = settings;

	/* Original image canvas */
	const {
		canvas: originalCanvas = null,
		rendered: originalRendered,
		canvasImg: originalCanvasImg,
		imageLoaded: originalImageLoaded
	} = useInitFabricImg({
		imgUrl: getImageUrl(base?.path),
		canvasRef: originalCanvasRef,
		id,
		canvasWrapperRef,
		type: 'originalCanvas'
	});

	/* Removed Background canvas */
	const {
		canvas = null,
		canvasImg,
		rendered,
		imageLoaded
	} = useInitFabricImg({
		imgUrl: imageUrl,
		originalImgUrl: basePath,
		canvasRef,
		id,
		type: 'mainCanvas',
		canvasWrapperRef,
		customControls: true,
		customControlCallbacks,
		imgSetSettings: {
			angle,
			scale,
			origin,
			crop,
			dirty
		},
		editionMode: !isActions,
		main: true,
		addedImgCallback: () => {
			if (!undoStack.length) {
				dispatch(saveInStack());
				dispatch(updateImageHasChanges(false));
			}
		},
		referenceImage: originalCanvasImg,
		metadata
	});

	const { croppedImg } = useCropSelector({
		canvas,
		canvasImg,
		imageUrl: latestPath,
		callbacks: customControlCallbacks
	});

	const initializing =
		!rendered ||
		!originalRendered ||
		!imageLoaded ||
		!originalImageLoaded ||
		!croppedImg;

	/* Handle background changes */
	useBackgroundListeners({ canvas, rendered, originalCanvasImg });

	useZoomListener({ canvas, currentImage });
	useZoomListener({ canvas: originalCanvas, currentImage });

	const finishDownload = debounce(() => {
		dispatch(setDownload(null));
	}, 500);

	const downloadHQ = async () => {
		const dataToSave = await getDataToSave(selectedImage, settings);

		await downloadImageFn(
			transactionModel.downloadUrl(id, 'high'),
			downloadFileName,
			{ method: 'post', body: dataToSave }
		);

		dispatch(fetchCredits());
	};

	const download = async (quality = 'high') => {
		try {
			const type = 'image/png';

			if (!loggedIn || quality === 'low') {
				const lqCanvas = await getLQCanvas({
					canvas,
					backgroundColor
				});
				const blob = await canvasToBlob(lqCanvas.getElement(), type);

				saveAs(blob, downloadFileName);
				dispatch(updateImageHasChanges(false));

				return;
			}

			await downloadHQ(type);
			dispatch(updateImageHasChanges(false));
		} catch (error) {
			showError(...getErrorParams(error, t, navigate));
		} finally {
			finishDownload();
		}
	};

	useEffect(() => {
		if (downloadImage) {
			download(downloadImage);
		}
	}, [downloadImage]);

	useEffect(() => {
		let timeout = null;

		if (hasLocalFiles) {
			setPosition(100);
			return;
		}

		if (!initializing && !hasLocalFiles && initialComparePosition > 0) {
			timeout = setTimeout(() => {
				setPosition(prevPosition => {
					if (prevPosition <= 0) {
						setTriggeredAnimation(true);
					}

					return 0;
				});
			}, 100);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [initializing, selectedImage, hasLocalFiles]);

	useEffect(() => {
		const timeout = null;

		if (position <= 0) {
			setTimeout(() => {
				setTriggeredAnimation(true);
			}, 1000);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [position]);

	useEffect(() => {
		dispatch(setImageReady({ id, localId, ready: !initializing }));
	}, [initializing]);

	useEffect(() => {
		setTriggeredAnimation(false);
	}, [id]);

	useImageZoomPan({
		canvas,
		id,
		positions,
		layersToSync: [originalCanvas, brushCanvas]
	});

	useKeyBindings({ canvas });

	useSamInitializer({
		transactionId: id,
		fabricImage: canvasImg,
		latestId: latest?.id,
		isSegment
	});

	return (
		<Box sx={{ flex: 1, maxWidth: '100%' }} ref={canvasWrapperRef}>
			<Box
				sx={{
					position: 'relative'
				}}
			>
				{(hasLocalFiles || initializing) && !isActions && (
					<PreviewLoading tempBlob={previewImage} />
				)}
				<Box
					sx={{
						...((initializing || hasLocalFiles) && !isActions
							? {
									position: 'absolute',
									visibility: 'hidden'
								}
							: {})
					}}
				>
					<Card variant="standard" sx={{ position: 'relative' }}>
						<Box
							position="absolute"
							left={0}
							top={0}
							width="100%"
							maxWidth={compare ? '100%' : `${position}%`}
							overflow="hidden"
							zIndex={1}
							height="100%"
							sx={{
								transition: triggeredAnimation
									? 'max-width 0.25s ease'
									: 'max-width 0.75s ease-in-out',
								direction: 'ltr'
							}}
						>
							<canvas
								ref={originalCanvasRef}
								id={`originalCanvas-${currentImage.id}`}
							/>
						</Box>
						<Box position="relative" sx={{ background: 'white' }}>
							<CardMedia
								image=""
								sx={{
									width: '100%',
									height: '100%',
									backgroundRepeat: 'repeat',
									backgroundSize: '30px 30px',
									backgroundPosition:
										'0 0, 0 15px, 15px -15px, -15px 0',
									backgroundImage: getTransparencyImage()
								}}
							>
								<canvas
									ref={canvasRef}
									id={`processedCanvas-${currentImage.id}`}
								/>
							</CardMedia>
						</Box>
					</Card>
				</Box>

				<Card
					variant="standard"
					sx={{
						position: 'absolute',
						background: 'transparent',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						...(!isBrush || isCrop
							? {
									pointerEvents: 'none',
									zIndex: -1
								}
							: {})
					}}
				>
					<MagicBrushCanvas
						initializing={initializing}
						transformedCanvas={canvas}
						canvasImg={canvasImg}
						originalCanvasImg={originalCanvasImg}
						originalCanvas={originalCanvas}
						id={id}
						setBrushCanvas={setBrushCanvas}
					/>
					{(improving || removing) && isActions && <Loading />}
				</Card>
				<Card
					variant="standard"
					sx={{
						position: 'absolute',
						background: 'transparent',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						...(!isSegment || !isActions
							? {
									pointerEvents: 'none',
									zIndex: -2
								}
							: {})
					}}
				>
					<Box width="100%" height="100%">
						<Box position="relative" width="100%" height="100%">
							{image && (
								<>
									{(maskSvgData || fixedSvgData) && (
										<Box
											sx={{
												position: 'absolute',
												top: 0,
												left: 0,
												width: '100%',
												height: '100%'
											}}
											id={`samSvgMask-${currentImage.id}`}
										>
											<svg
												width="100%"
												height="100%"
												viewBox={`0 0 ${(maskSvgData || fixedSvgData)?.width} ${(maskSvgData || fixedSvgData)?.height}`}
												fill="none"
											>
												{maskSvgData?.pathData && !mdDown && (
													<path
														d={maskSvgData?.pathData}
														fill={SEGMENT_IMAGE_COLOR}
														opacity={0.5}
													/>
												)}

												{fixedSvgData && (
													<path
														d={fixedSvgData?.pathData}
														fill={SEGMENT_IMAGE_COLOR}
														opacity={0.7}
													/>
												)}
											</svg>
										</Box>
									)}

									<Box
										width="100%"
										height="100%"
										{...segmentBoxEvents}
										sx={{
											cursor: 'pointer',
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											height: '100%',
											zIndex: 2
										}}
									/>

									{(improving || removing) &&
										isActions &&
										isSegment && <Loading />}
								</>
							)}
						</Box>
					</Box>
				</Card>
			</Box>
		</Box>
	);
}
