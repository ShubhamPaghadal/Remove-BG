import { useEffect, useRef, useState } from 'react';
import { useShallowSelector } from '@/hooks';
import { v4 as uuid } from 'uuid';

import {
	addImage,
	addLocalFiles,
	clearLocal,
	restorePositions,
	saveInStack,
	setBlurWidth,
	setBackgroundColor,
	setBackgroundImg,
	setImagePositions,
	setImageSize,
	setSelectionView,
	setZoom,
	updateSettings,
	updateImageCroppedUrl
} from '@/store/editor';
import { Point, Canvas, Rect } from 'fabric';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import routes from '@/routes';
import { removeBackground } from '@/store/editor/thunks';
import { showError, vipsImageFree, debounce } from '@/utils';
import { getErrorParams } from '@/utils/transaction';
import { PLAUSIBLE_EVENTS, sendPlausible } from '@/utils/plausible';
import { showNoCredits } from '@/components/NoCreditsModal/utils';
import transactionModel from '@/models/transaction';
import { useVips } from '@/hooks/vips';

import {
	centerCrop,
	fabricImageToBuffer,
	fabricImageFromURL,
	bufferToUrl,
	extractCanvasImg,
	fetchImageAsArrayBuffer
} from './utils';

import {
	ALL_CANVAS_WRAPPER_ID,
	BASE_BG_ID,
	CANVAS_WIDTH_MAX,
	CANVAS_WIDTH_MIN,
	CUSTOM_FABRIC_EVENTS,
	DROPZONE_ERRORS,
	MAX_ZOOM,
	MIN_ZOOM
} from './constants';
import { getCropSelector, getVisibleZoneSelector } from './utils/selection';
import { setRotateUbication } from './utils/controls';

export function delay(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

export function useColors() {
	return [
		'#FFFFFF',
		'#E25241',
		'#D73965',
		'#9037AA',
		'#6041B1',
		'#4154AF',
		'#4696EC',
		'#49A8EE',
		'#53BAD1',
		'#419488',
		'#67AC5C',
		'#98C05C',
		'#FDEA60',
		'#F6C244',
		'#F29C38',
		'#ED6337',
		'#74564A',
		'#9E9E9E',
		'#667D8A',
		'#000000'
	];
}

export function parseSettingsData(data, img, canvas) {
	const { angle, origin, scale } = data;

	const [x, y] = scale;
	const [left, top] = origin;

	const canvasScaleX = canvas.width / img.width;
	const canvasScaleY = canvas.height / img.height;

	const ratio = !Number.isNaN(Number(img.originalRatio))
		? img.originalRatio
		: 1;

	return {
		angle,
		scaleX: canvasScaleX * x,
		scaleY: canvasScaleY * y,
		left: left * ratio,
		top: top * ratio
	};
}

function getCropOffsets(canvas, canvasImg) {
	return {
		left: (canvasImg.width - canvas.width) / 2,
		top: (canvasImg.height - canvas.height) / 2
	};
}

const getLimits = (canvas, zoom) => {
	const canvasWidth = canvas.getWidth();
	const canvasHeight = canvas.getHeight();

	return {
		minLeft: 0,
		minTop: 0,
		maxLeft: canvasWidth * zoom - canvasWidth,
		maxTop: canvasHeight * zoom - canvasHeight
	};
};

const getCurrentPositions = canvas => {
	return {
		currentLeft: canvas.viewportTransform[4],
		currentTop: canvas.viewportTransform[5]
	};
};

const limitNextPositions = ({ top, left }, { canvas, zoom }) => {
	const limits = getLimits(canvas, zoom);

	return {
		nextLeft: Math.max(-limits.maxLeft, Math.min(limits.minLeft, left)),
		nextTop: Math.max(-limits.maxTop, Math.min(limits.minTop, top))
	};
};

const initialViewportTransform = [1, 0, 0, 1, 0, 0];

const restoreLayerPosition = layer => {
	layer.setViewportTransform(initialViewportTransform);
};

function getImageCursors(zoomLevel = 1) {
	return {
		hoverCursor: zoomLevel > 1 ? 'grab' : 'default',
		moveCursor: zoomLevel > 1 ? 'grabbing' : 'default'
	};
}

function getDataFromUrl(url) {
	const urlSplit = url.split('/');

	const filename = urlSplit[urlSplit.length - 1];
	const ext = filename.split('.').pop();

	return { filename, ext };
}

export function useGetDropError() {
	const { t } = useTranslation();

	return error => {
		const { code } = error || {};

		const dropErrors = {
			[DROPZONE_ERRORS.fileInvalidType]: {
				status: 415,
				data: {
					error: code,
					message: t('errors.imageExtension')
				}
			},
			[DROPZONE_ERRORS.tooManyFiles]: {
				status: 400,
				data: {
					error: code,
					message: t('errors.tooManyFiles')
				}
			},
			[DROPZONE_ERRORS.fileTooLarge]: {
				status: 413,
				data: {
					error: code,
					message: t('errors.imageTooLarge')
				}
			},
			generic: {
				status: 500,
				data: { error: 'generic', message: '' }
			}
		};

		return dropErrors?.[code] || dropErrors.generic;
	};
}

export function useUploadFileFn(redirect = true) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const loggedIn = useSelector(state => state.auth?.loggedIn);

	const getDropError = useGetDropError();

	const showPremiumModal = () => {
		showNoCredits({
			title: t('editor.bulkDisabledModal.title'),
			description: t('editor.bulkDisabledModal.description')
		});
	};

	const handleSingleError = error => {
		setTimeout(() => {
			showError(...getErrorParams(error, t, navigate));
		}, 200);

		if (redirect) {
			navigate(loggedIn ? routes.dashboard : routes.upload);
		}
	};

	const parseSettled = (responseArr = []) => {
		return responseArr.map(localFile => {
			if (localFile.status === 'rejected') {
				return { success: false, ...localFile?.reason };
			}

			return {
				success: true,
				...(localFile?.value || {})
			};
		});
	};

	const parseLocalFile = async file => {
		const hasErrors = file?.errors;
		const parsedFile = !hasErrors ? file : file?.file;

		let fileBlob = parsedFile;
		let { path: filename } = parsedFile;

		if (typeof parsedFile === 'string') {
			const content = await fetch(parsedFile);
			fileBlob = await content.blob();
			filename = getDataFromUrl(parsedFile)?.filename;
		}

		const blobUrl = URL.createObjectURL(fileBlob);

		const data = {
			id: uuid(),
			blob: blobUrl,
			filename,
			fileBlob,
			...(file?.errors ? { errors: file?.errors } : {})
		};

		return hasErrors ? Promise.reject(data) : Promise.resolve(data);
	};

	const getFirstRejectedError = rejectedFiles => {
		const firstRejected = rejectedFiles?.[0] || {};
		return firstRejected?.errors?.[0];
	};

	const bulkUpload = async (files, rejectedFiles) => {
		try {
			sendPlausible(PLAUSIBLE_EVENTS.upload);

			if (!loggedIn && [...files, ...rejectedFiles].length > 1) {
				return showPremiumModal();
			}

			const dropError = getFirstRejectedError(rejectedFiles);

			if (dropError?.code === DROPZONE_ERRORS.tooManyFiles) {
				return showError(dropError?.message);
			}

			let parsedLocalFiles = files.map(item => parseLocalFile(item));

			const localFiles = await Promise.allSettled(parsedLocalFiles);

			parsedLocalFiles = parseSettled(localFiles);

			const successItems = parsedLocalFiles.filter(item => item.success);
			const errorItems = parsedLocalFiles.filter(item => !item.success);

			dispatch(addLocalFiles(successItems));

			for (const errorItem of errorItems) {
				const itemDropError = errorItem?.errors?.[0];

				dispatch(
					addImage({
						id: errorItem.id,
						tempBlob: errorItem.blob,
						error: getDropError(itemDropError)
					})
				);
			}

			if (redirect) {
				navigate(routes.editor);
			}

			const filesUpload = successItems.map(
				async ({ id, fileBlob, blob, filename }) => {
					const file = await fileBlob?.arrayBuffer();

					return dispatch(
						removeBackground({
							localId: id,
							file,
							blobUrl: blob,
							filename
						})
					).unwrap();
				}
			);

			await Promise.all(filesUpload);
		} catch (error) {
			if (redirect) {
				navigate(loggedIn ? routes.dashboard : routes.upload);
			}
		} finally {
			dispatch(clearLocal());
		}
	};

	const uploadFile = async (input, rejectedFiles = []) => {
		try {
			sendPlausible(PLAUSIBLE_EVENTS.upload);

			if (!loggedIn && rejectedFiles.length > 1) {
				return showPremiumModal();
			}

			const dropError =
				input?.errors?.[0] || getFirstRejectedError(rejectedFiles);

			if (dropError?.code === DROPZONE_ERRORS.tooManyFiles) {
				return showError(dropError?.message);
			}

			if (dropError) {
				const errorObj = getDropError(dropError);

				return showError(...getErrorParams(errorObj, t, navigate));
			}

			const { id, blob, filename, fileBlob } = await parseLocalFile(input);

			dispatch(
				addLocalFiles([
					{
						id,
						blob,
						filename
					}
				])
			);

			if (redirect) {
				navigate(routes.editor);
			}

			const file = await fileBlob.arrayBuffer();

			await dispatch(
				removeBackground({
					file,
					blobUrl: blob,
					filename,
					localId: id
				})
			).unwrap();
		} catch (error) {
			handleSingleError(error);
		}
	};

	const getImageBlobFromProxy = async transactionId => {
		try {
			const proxyImage = await transactionModel.getProxyImg(transactionId);
			const imgBlob = await proxyImage.blob();

			return URL.createObjectURL(imgBlob);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn('Error getting proxy image: ', error);

			return null;
		}
	};

	const urlUploadFile = async imgUrl => {
		try {
			sendPlausible(PLAUSIBLE_EVENTS.upload);

			const transaction = await transactionModel.downloadImgFromUrl(imgUrl);

			const transactionId = transaction?.id;

			const blobUrl = await getImageBlobFromProxy(transactionId);

			if (blobUrl) {
				dispatch(
					addLocalFiles([
						{
							id: transactionId,
							blob: blobUrl
						}
					])
				);

				if (redirect) {
					navigate(routes.editor);
				}
			}

			await dispatch(
				removeBackground({ imgUrl, transactionId, localId: transactionId })
			).unwrap();

			if (!blobUrl && redirect) {
				navigate(routes.editor);
			}
		} catch (error) {
			handleSingleError(error);
		}
	};

	return {
		bulkUpload,
		uploadFile,
		urlUploadFile
	};
}

export function useZoomListener({ canvas, currentImage }) {
	const { settings = {} } = currentImage || {};

	const { zoomLevel = 1 } = settings;

	useEffect(() => {
		if (canvas && zoomLevel) {
			const center = {
				x: (canvas.width * zoomLevel) / 2,
				y: (canvas.height * zoomLevel) / 2
			};

			const { currentLeft, currentTop } = getCurrentPositions(canvas);

			const { nextLeft, nextTop } = limitNextPositions(
				{ top: currentTop, left: currentLeft },
				{ canvas, zoom: zoomLevel }
			);

			canvas.zoomToPoint(new Point(center.x, center.y), zoomLevel);
			canvas.absolutePan({ x: -nextLeft, y: -nextTop });
		}
	}, [zoomLevel, canvas]);
}

export function useBackgroundListeners({
	canvas,
	rendered,
	originalCanvasImg
}) {
	const dispatch = useDispatch();
	const [vipsImage, setVipsImage] = useState({});

	const {
		backgrounds = [],
		images = [],
		selectedImage
	} = useSelector(state => state.editor);

	const { initializeVips, vips, enabled: vipsEnabled } = useVips();

	const currentImage = images.find(item => item.id === selectedImage) || {};

	const { settings = {}, baseBackground = null } = currentImage;

	const {
		background,
		backgroundColor,
		customBackgrounds = [],
		activeBlur,
		blur
	} = settings;

	const removeBackgroundImage = () => {
		canvas.backgroundImage = null;
		canvas.renderAll();
	};

	const removeBackgroundColor = () => {
		canvas.backgroundColor = null;
		canvas.renderAll();
	};

	const preloadBackground = async (bg, signal) => {
		if (!bg) {
			return;
		}

		if (!vips && vipsEnabled) {
			return initializeVips();
		}

		if (!vips) {
			return;
		}

		let { path } =
			[...backgrounds, ...customBackgrounds, baseBackground].find(
				item => item?.id === bg
			) || {};

		path ||= baseBackground?.path || backgrounds?.[0].path;

		try {
			const blob = await fabricImageToBuffer(path, signal);
			if (signal.aborted) {
				return;
			}

			let im = vips.Image.newFromBuffer(blob);
			try {
				const icc = im.getBlob('icc-profile-data');
				if (icc.length) {
					// we need to import ICC profile to avoid .resize
					// creating the image with incorrect colors
					im = im.iccImport();
				}
			} catch {
				// we can ignore safely this message since
				// vips will fail if 'icc-profile-data' is not present
			}

			im.preventAutoDelete();
			setVipsImage({
				path,
				im,
				id: bg,
				alpha: im.hasAlpha()
			});
			dispatch(setBlurWidth(im.width));
		} catch (e) {
			if (e.name === 'AbortError') {
				return;
			}
			// eslint-disable-next-line no-console -- TODO: check error
			console.error(e);
			showError(e, { report: true });
		}
	};

	const addImageBackground = async () => {
		removeBackgroundColor();
		dispatch(setBackgroundColor(null));

		const { path, local } =
			[...backgrounds, ...customBackgrounds, baseBackground].find(
				item => item?.id === background
			) || {};

		if (!path && !activeBlur) {
			return removeBackgroundImage();
		}

		if (vipsEnabled && vipsImage?.id !== background) {
			// vips image is still loading
			return;
		}

		let url;
		let img;
		if (activeBlur && blur && vipsImage?.im) {
			let { im } = vipsImage;

			const resizeRatio = Math.max(
				canvas.width / im.width,
				canvas.height / im.height
			);

			// blur MUST be applied before all other operations
			// since the size of the image affects the blur result
			im = im.gaussblur(blur, { precision: 'approximate' });
			im = im.resize(resizeRatio);

			// Calculate the crop offsets
			const { left, top } = getCropOffsets(canvas, im);
			im = im.crop(left, top, canvas.width, canvas.height);

			// perf: output as .jpg for local background or if no alpha channel, ~50% faster
			const output = vipsImage.alpha && !local ? '.png' : '.jpg';
			const buffer = im.writeToBuffer(output);
			url = bufferToUrl(buffer);

			img = await fabricImageFromURL(url);
		} else {
			// if blur is not set, instead of cropping with vips
			// we can use faster crop with fabric
			img = await fabricImageFromURL(path);
			centerCrop(img, originalCanvasImg, canvas);
		}

		canvas.backgroundImage = img;
		canvas.renderAll();
		canvas.fire(CUSTOM_FABRIC_EVENTS.mainBackgroundAdded);
	};

	const addColorBackground = () => {
		removeBackgroundImage();
		dispatch(setBackgroundImg(null));

		canvas.backgroundColor = backgroundColor || null;
		canvas.renderAll();
		canvas.fire(CUSTOM_FABRIC_EVENTS.mainBackgroundAdded);
	};

	useEffect(() => {
		const im = vipsImage?.im;
		return () => {
			vipsImageFree(im);
			vips?.flushPendingDeletes();
		};
	}, [vipsImage, vips]);

	useEffect(() => {
		if (!vipsEnabled) {
			setVipsImage(null);
		}
	}, [vipsEnabled]);

	useEffect(() => {
		if (canvas && !background && !backgroundColor) {
			removeBackgroundImage();
		}
	}, [background, vips, vipsEnabled, baseBackground]);

	useEffect(() => {
		const abortController = new AbortController();

		if (background === BASE_BG_ID && !baseBackground) {
			return;
		}

		preloadBackground(background, abortController.signal);

		return () => {
			abortController.abort();
		};
	}, [background, vips, vipsEnabled, baseBackground]);

	useEffect(() => {
		if (canvas && !backgroundColor && !background) {
			removeBackgroundColor();
		}
	}, [backgroundColor]);

	useEffect(() => {
		if (canvas && rendered && background && originalCanvasImg) {
			addImageBackground();
		}
	}, [
		blur,
		activeBlur,
		background,
		canvas,
		rendered,
		vipsImage,
		originalCanvasImg
	]);

	useEffect(() => {
		if (canvas && rendered && backgroundColor) {
			addColorBackground();
		}
	}, [backgroundColor, canvas, rendered]);

	useEffect(() => {
		if (activeBlur && !background && baseBackground) {
			dispatch(setBackgroundImg(BASE_BG_ID));
		}
	}, [activeBlur, baseBackground]);
}

export const getCanvasContainerWidth = () => {
	const wrapperRef = document.getElementById(ALL_CANVAS_WRAPPER_ID);

	return wrapperRef?.clientWidth;
};

export function resizeListener({ canvas, canvasReference, main }) {
	const dispatch = useDispatch();
	const {
		images = [],
		selectedImage,
		section
	} = useSelector(state => state.editor);
	const settingsRef = useRef(null);

	const currentImage = images.find(item => item.id === selectedImage) || {};

	const { settings = {} } = currentImage || {};

	const isBrush = section === 'actions';

	const { scale = [1, 1], origin = [0, 0], angle = 0 } = settings;

	useEffect(() => {
		settingsRef.current = { scale, origin, angle };
	}, [settings]);

	function resizeCanvas() {
		if (!canvas) return;

		const baseCanvas = canvasReference || canvas;
		const zoom = canvas.getZoom();

		const [renderedImg] = baseCanvas.getObjects('image');
		const imageWidth = renderedImg?.width;
		const imageHeight = renderedImg?.height;
		const imageRatio = imageHeight / imageWidth;

		const containerWidth = getCanvasContainerWidth();

		const newWidthMin = Math.min(
			imageWidth,
			containerWidth,
			CANVAS_WIDTH_MAX
		);

		const newCanvasWidth = Math.max(newWidthMin, CANVAS_WIDTH_MIN);
		const newCanvasHeight = newCanvasWidth * imageRatio;

		canvas.setDimensions({
			width: newCanvasWidth,
			height: newCanvasHeight
		});

		if (canvas.backgroundImage) {
			const bgResizeRatio = Math.max(
				canvas.width / canvas.backgroundImage.width,
				canvas.height / canvas.backgroundImage.height
			);

			canvas.backgroundImage.set({
				scaleX: bgResizeRatio,
				scaleY: bgResizeRatio
			});
		}

		if (zoom > MIN_ZOOM) {
			dispatch(setZoom(MIN_ZOOM));
		}

		restoreLayerPosition(canvas);
		dispatch(restorePositions());

		if (renderedImg && !canvasReference) {
			if (main && !isBrush) {
				const parsedData = parseSettingsData(
					settingsRef.current,
					renderedImg,
					baseCanvas
				);

				renderedImg.set({
					scaleX: parsedData.scaleX,
					scaleY: parsedData.scaleY,
					left: parsedData.left,
					top: parsedData.top
				});

				const objects = baseCanvas.getObjects();

				for (const obj of objects) {
					if (obj !== renderedImg && !obj.fixedSize) {
						obj.scaleX = parsedData.scaleX;
						obj.scaleY = parsedData.scaleY;

						obj.syncWithImage?.();
					}

					obj.setCoords();
				}
			} else {
				renderedImg.scaleToWidth(newCanvasWidth);
				renderedImg.scaleToHeight(newCanvasHeight);
			}
		}

		canvas.renderAll();
	}

	useEffect(() => {
		window.addEventListener('resize', resizeCanvas);

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, [canvas, canvasReference]);
}

export function useInitFabricImg({
	type,
	imgUrl,
	canvasRef,
	customControls,
	customControlCallbacks,
	editionMode = false,
	imgSetSettings = {},
	addedImgCallback = () => {},
	main = false,
	referenceImage = null,
	metadata = null
}) {
	const initRef = useRef(false);
	const [canvas, setCanvas] = useState(null);
	const [selectionLayer, setSelectionLayer] = useState(null);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [canvasImg, setCanvasImg] = useState(null);
	const [rendered, setRendered] = useState(false);
	const dispatch = useDispatch();

	resizeListener({ canvas, main });

	useEffect(() => {
		if (initRef.current) {
			return;
		}

		initRef.current = true;
		setRendered(false);
		const fabricCanvas = new Canvas(canvasRef.current, {
			selection: false,
			fireMiddleClick: true
		});

		if (type) {
			window[type] = fabricCanvas;
		}
		setCanvas(fabricCanvas);
	}, []);

	useEffect(() => {
		if (canvasRef?.current && canvas && imgUrl && (referenceImage || !main)) {
			(async () => {
				setRendered(false);
				setImageLoaded(false);
				setSelectionLayer(null);

				const [img] = await Promise.all([
					fabricImageFromURL(imgUrl),
					// wait to track the rendered state,
					// otherwise in iOS the state is not updated
					delay(100)
				]);

				canvas.clear();

				const containerWidth = getCanvasContainerWidth();

				const maxContainerWidth = Math.min(
					containerWidth,
					CANVAS_WIDTH_MAX
				);

				const canvasWidth = Math.min(img.width, maxContainerWidth);
				const aspectRatio = img.width / img.height;
				const canvasHeight = canvasWidth / aspectRatio;

				const imageWidth = img.width;
				const imageHeight = img.height;

				const originalWidth = metadata?.width || referenceImage?.width;
				const originalHeight = metadata?.height || referenceImage?.height;

				if (originalWidth && originalHeight) {
					dispatch(
						setImageSize({
							width: originalWidth,
							height: originalHeight
						})
					);
				}

				const scaleRatioWidth = canvasWidth / imageWidth;
				const scaleRatioHeight = imageHeight / canvasHeight;
				const scaleRatio = Math.min(scaleRatioWidth, scaleRatioHeight);

				canvas.setWidth(canvasWidth);
				canvas.setHeight(canvasHeight);

				const currentZoom = canvas.getZoom();

				img.set({
					selectable: false,
					...getImageCursors(currentZoom),
					hasControls: false,
					scaleX: scaleRatio || 1,
					scaleY: scaleRatio || 1,
					top: 0,
					left: 0,
					initialScaleRatio: scaleRatio || 1,
					canvasWidth
				});

				let customSelectionLayer = null;
				let tooltip = null;

				img.on('added', function () {
					setCanvasImg(img);
					setImageLoaded(true);

					if (customControls) {
						const originalRatio = img.canvasWidth / originalWidth;

						img.originalWidth = originalWidth;
						img.originalRatio = originalRatio;

						const { rotationTooltip, customSelector } =
							getVisibleZoneSelector({
								img,
								canvas,
								callbacks: customControlCallbacks
							});

						customSelectionLayer = customSelector;
						tooltip = rotationTooltip;

						const {
							left: csLeft = 0,
							top: csTop = 0,
							width,
							height,
							scaleX,
							scaleY
						} = customSelector || {};

						const left = csLeft / originalRatio;
						const top = csTop / originalRatio;

						if (!imgSetSettings?.crop) {
							// Full crop position
							const crop = {
								left,
								top,
								width: (width * scaleX) / originalRatio,
								height: (height * scaleY) / originalRatio
							};

							const cropSettings = {
								crop,
								coords: [left, top]
							};

							img.cropSettings = cropSettings;
						}
					}
				});

				canvas.add(img);

				setSelectionLayer(customSelectionLayer);

				img.customSelectionLayer = customSelectionLayer;

				if (customSelectionLayer) {
					canvas.add(customSelectionLayer);
					canvas.add(tooltip);
				}

				canvas.renderAll();

				setRendered(true);
				addedImgCallback?.();
			})();
		}
	}, [canvasRef, imgUrl, canvas, referenceImage]);

	useEffect(() => {
		if (canvas && canvasImg && imageLoaded) {
			const initialSettings = editionMode
				? { ...imgSetSettings }
				: {
						scale: [1, 1],
						origin: [0, 0],
						angle: 0
					};

			const parsedImgSetSettings = parseSettingsData(
				initialSettings,
				canvasImg,
				canvas
			);

			canvasImg.set({ ...parsedImgSetSettings });
			canvasImg.customSelectionLayer?.syncWithImage?.();

			if (!editionMode) {
				canvas.discardActiveObject();
			}

			canvas.requestRenderAll();
		}
	}, [canvas, canvasImg, imageLoaded, imgSetSettings]);

	useEffect(() => {
		const handleSelect = () => {
			dispatch(setSelectionView(true));

			if (canvas?.getZoom?.() !== 1) {
				dispatch(setZoom(1));
			}
		};

		const handleDeselect = () => {
			dispatch(setSelectionView(false));
		};

		if (selectionLayer) {
			selectionLayer.on('selected', handleSelect);
			selectionLayer.on('deselected', handleDeselect);
		}

		return () => {
			if (selectionLayer) {
				selectionLayer.off('selected', handleSelect);
				selectionLayer.off('deselected', handleDeselect);
			}
		};
	}, [selectionLayer, dispatch]);

	return {
		canvas,
		imageLoaded,
		canvasImg,
		rendered
	};
}

export function useAvailableCredits() {
	const { data, loading, success } = useSelector(
		state => state.editor.fetchCredits
	);
	let availableCredits = null;
	let value = null;

	if (success) {
		availableCredits = data.existing - data.used;
		value = !data.existing && !availableCredits ? 0 : availableCredits;
	}

	return { loading, success, value, availableCredits };
}

export function useParseTouchEvents() {
	const touchInitialDistance = useRef(null);
	const touchInitialCoords = useRef(null);

	const clear = () => {
		touchInitialDistance.current = null;
		touchInitialCoords.current = null;
	};

	const parseData = eventParams => {
		const touch1 = eventParams?.e?.touches?.[0];
		const touch2 = eventParams?.e?.touches?.[1];

		const centerX = (touch1.clientX + touch2.clientX) / 2;
		const centerY = (touch1.clientY + touch2.clientY) / 2;

		const initialDistance = touchInitialDistance.current;

		const newDistance = Math.hypot(
			touch1.clientX - touch2.clientX,
			touch1.clientY - touch2.clientY
		);

		if (!touchInitialCoords?.current) {
			touchInitialCoords.current = {
				x: touch1.clientX,
				y: touch1.clientY
			};
		}

		if (!initialDistance) {
			touchInitialDistance.current = newDistance;
		}

		const { x, y } = touchInitialCoords?.current || {};

		const movementX = touch1.clientX - x;
		const movementY = touch1.clientY - y;

		touchInitialCoords.current = { x: touch1.clientX, y: touch1.clientY };

		/* const distance = newDistance - touchInitialDistance.current; */

		const scale = newDistance / touchInitialDistance.current;

		touchInitialDistance.current = newDistance;

		return {
			movementX,
			movementY,
			// distance,
			centerX,
			centerY,
			touch1,
			touch2,
			scale
		};
	};

	const isDoubleTouchEvent = eventParams => {
		return !!(eventParams?.e.touches?.length === 2);
	};

	return {
		parseData,
		clear,
		isDoubleTouchEvent
	};
}

export function useImageZoomPan({ id, canvas = null, layersToSync }) {
	const dispatch = useDispatch();
	const { selectionView = false } = useSelector(state => state.editor);

	const isPanning = useRef(false);

	const { clear, parseData, isDoubleTouchEvent } = useParseTouchEvents();

	const debouncedUpdatePositions = debounce((payload = {}) => {
		dispatch(setImagePositions(payload));
	}, 200);

	const debouncedUpdateZoom = debounce(zoom => {
		dispatch(setZoom(zoom));
	}, 0);

	const syncronizedAction = (fnName, params = []) => {
		if (!fnName) return;

		canvas?.[fnName]?.(...params);

		if (layersToSync?.length) {
			for (const layer of layersToSync) {
				if (!layer) continue;

				layer?.[fnName]?.(...params);
			}
		}
	};

	const handleMouseDown = params => {
		if (params?.e?.button === 1) {
			isPanning.current = true;
			const canvasImg = extractCanvasImg(canvas);

			if (canvasImg) {
				canvasImg.set({
					hoverCursor: 'grabbing',
					moveCursor: 'grabbing'
				});
			}
		}
	};

	const handleMouseUp = () => {
		clear();
		isPanning.current = false;

		const canvasImg = extractCanvasImg(canvas);

		if (canvasImg) {
			canvasImg.set({
				hoverCursor: 'default',
				moveCursor: 'default'
			});
		}
	};

	const handlePinchToZoom = params => {
		const { movementX, movementY, scale, centerX, centerY } =
			parseData(params);

		const lastZoom = canvas.getZoom();

		const zoomFactor = Math.max(
			MIN_ZOOM,
			Math.min(MAX_ZOOM, lastZoom * scale)
		);

		const { currentLeft, currentTop } = getCurrentPositions(canvas);

		const limits = getLimits(canvas, zoomFactor);

		const { minTop, maxTop, minLeft, maxLeft } = limits;

		const absoluteMovementX = currentLeft + movementX;
		const absoluteMovementY = currentTop + movementY;

		const nextLeft =
			absoluteMovementX > -maxLeft && absoluteMovementX < minLeft
				? movementX
				: 0;

		const nextTop =
			absoluteMovementY > -maxTop && absoluteMovementY < -minTop
				? movementY
				: 0;

		const pointer = new Point(centerX, centerY);

		syncronizedAction('zoomToPoint', [pointer, zoomFactor]);
		syncronizedAction('relativePan', [{ x: nextLeft, y: nextTop }]);

		debouncedUpdateZoom(zoomFactor);
	};

	const handleMouseMove = params => {
		const zoom = canvas.getZoom();

		if (selectionView) {
			if (zoom > 1) {
				dispatch(setZoom(1));
			}

			return;
		}

		if (isDoubleTouchEvent(params)) {
			const activeObject = canvas.getActiveObject();

			if (activeObject) {
				canvas.discardActiveObject();
			}

			return handlePinchToZoom(params);
		}

		if (!isPanning?.current) return;

		const { movementX, movementY } = params.e || {
			movementX: 0,
			movementY: 0
		};

		const { currentLeft, currentTop } = getCurrentPositions(canvas);

		const { nextLeft, nextTop } = limitNextPositions(
			{ top: currentTop + movementY, left: currentLeft + movementX },
			{ canvas, zoom }
		);

		syncronizedAction('absolutePan', [{ x: -nextLeft, y: -nextTop }]);

		debouncedUpdatePositions({ left: nextLeft, top: nextTop });
	};

	const handleWheel = params => {
		params.e.preventDefault();
		params.e.stopPropagation();
		const { deltaY = 0, deltaX = 0 } = params?.e || {};

		let zoom = canvas.getZoom();

		if (selectionView) {
			if (zoom > 1) {
				dispatch(setZoom(1));
			}

			return;
		}

		if (params?.e?.ctrlKey) {
			zoom -= deltaY / 1000;

			zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

			const pointer = canvas.getPointer(params.e);

			dispatch(setZoom(zoom));

			syncronizedAction('zoomToPoint', [pointer, zoom]);

			return;
		}

		const { minTop, maxTop, maxLeft, minLeft } = getLimits(canvas, zoom);

		const { currentTop, currentLeft } = getCurrentPositions(canvas);

		const movementY = deltaY / 10;
		const movementX = deltaX / 10;

		const absoluteMovementY = currentTop - movementY;
		const absoluteMovementX = currentLeft - movementX;

		const nextTop =
			absoluteMovementY > -maxTop && absoluteMovementY < minTop
				? -movementY
				: 0;

		const nextLeft =
			absoluteMovementX > -maxLeft && absoluteMovementX < -minLeft
				? -movementX
				: 0;

		syncronizedAction('relativePan', [{ x: nextLeft, y: nextTop }]);
	};

	const clearEvents = () => {
		if (canvas) {
			canvas.off('mouse:down', handleMouseDown);
			canvas.off('mouse:up', handleMouseUp);
			canvas.off('mouse:move', handleMouseMove);
			canvas.off('mouse:wheel', handleWheel);
		}
	};

	useEffect(() => {
		if (canvas) {
			// window.FabricPoint = Point;
			clearEvents();
			canvas.on('mouse:down', handleMouseDown);
			canvas.on('mouse:up', handleMouseUp);
			canvas.on('mouse:move', handleMouseMove);
			canvas.on('mouse:wheel', handleWheel);
		}

		return () => {
			clearEvents();
		};
	}, [canvas, layersToSync]);

	// Restore position
	useEffect(() => {
		dispatch(restorePositions());

		syncronizedAction('setViewportTransform', [initialViewportTransform]);
	}, [id]);
}

export function useImageEditionCallbacks() {
	const dispatch = useDispatch();

	const { images = [], selectedImage } = useShallowSelector(
		state => state.editor
	);

	const currentImage = images.find(item => item.id === selectedImage) || {};

	const { settings = {} } = currentImage;
	const {
		coords: stateCoords = null,
		crop: stateCrop = null,
		scale: stateScale = [1, 1],
		angle: stateAngle = 0
	} = settings || {};

	const debouncedUpdateSettings = debounce(data => {
		dispatch(updateSettings(data));
		dispatch(saveInStack());
	}, 100);

	const getFullPosition = ({ left, top, coords }, data) => {
		const { img } = data;

		if (coords) {
			// get most left coord
			left = Math.min(coords.bl.x, coords.br.x, coords.tl.x, coords.tr.x);

			// get most top coord
			top = Math.min(coords.bl.y, coords.br.y, coords.tl.y, coords.tr.y);
		}

		return {
			fullLeft: left / img.originalRatio,
			fullTop: top / img.originalRatio
		};
	};

	const parseFullImageWidthData = data => {
		const { img } = data;
		const { angle = 0, left = 0, top = 0, scaleX: x, scaleY: y } = img;

		// Full image scale
		const scaleX = (img.width * x) / img.canvas.width;
		const scaleY = (img.height * y) / img.canvas.height;

		// Full image position
		const { fullLeft, fullTop } = getFullPosition({ left, top }, data);

		// Full coords position
		const { fullLeft: fullCoordsLeft, fullTop: fullCoordsTop } =
			getFullPosition(
				{
					left: img.customSelectionLayer.left,
					top: img.customSelectionLayer.top,
					coords: img.customSelectionLayer.oCoords
				},
				data
			);

		return {
			angle,
			origin: [fullLeft, fullTop],
			coords: [fullCoordsLeft, fullCoordsTop],
			scale: [scaleX, scaleY],
			...(img.cropSettings ? { crop: img.cropSettings?.crop } : {})
		};
	};

	const onMove = data => {
		const params = parseFullImageWidthData(data);

		debouncedUpdateSettings(params);
	};

	const onRotate = data => {
		onMove(data);
	};

	const onScale = data => {
		onMove(data);
	};

	function calculateNewCoords({ oldLeft, oldTop }) {
		// TODO: calculate new coords, accounting for rotation to download
		const newLeft = oldLeft;
		const newTop = oldTop;

		return [newLeft, newTop];
	}

	const onCrop = data => {
		const { img, customSelector } = data;

		const left = customSelector.left / img.originalRatio;
		const top = customSelector.top / img.originalRatio;
		const width =
			(customSelector.width * customSelector.scaleX) / img.originalRatio;
		const height =
			(customSelector.height * customSelector.scaleY) / img.originalRatio;

		const { width: oldWidth = width, height: oldHeight = height } =
			stateCrop || {};

		const { fullLeft: fullCoordsLeft, fullTop: fullCoordsTop } =
			getFullPosition(
				{
					left: customSelector.left,
					top: customSelector.top,
					coords: customSelector.oCoords
				},
				data
			);

		const params = {
			crop: { left, top, width, height },
			coords: [fullCoordsLeft, fullCoordsTop]
		};

		if (stateCoords) {
			const [oldLeft, oldTop] = stateCoords || [];
			const [oldScaleX, oldScaleY] = stateScale || [];

			const newCoordsParams = {
				oldLeft,
				oldTop,
				stateAngle,
				oldWidth,
				oldHeight,
				width,
				height,
				oldScaleX,
				oldScaleY
			};

			params.coords = calculateNewCoords(newCoordsParams);
		}

		debouncedUpdateSettings(params);
	};

	return {
		onRotate,
		onMove,
		onScale,
		onCrop
	};
}

const KEYS = {
	up: 'ArrowUp',
	down: 'ArrowDown',
	left: 'ArrowLeft',
	right: 'ArrowRight',
	numpadAdd: '+',
	numpadSubstract: '-'
};

const MOVEMENT_STEP = 1;
const MOVEMENT_STEP_FAST = 10;

export function useKeyBindings({ canvas }) {
	const hideControls = obj => {
		obj.setControlsVisibility({
			mtr: false,
			tl: false,
			tr: false,
			bl: false,
			br: false
		});

		canvas.requestRenderAll();
	};

	const showControls = obj => {
		obj.setControlsVisibility({
			mtr: true,
			tl: true,
			tr: true,
			bl: true,
			br: true
		});

		canvas.requestRenderAll();
	};

	const debouncedRotationUbication = debounce(obj => {
		setRotateUbication?.(canvas, obj);
	}, 200);

	const debouncedActions = debounce(obj => {
		showControls(obj);
		obj.closeTooltips?.();
	}, 200);

	const transformCallback = obj => {
		debouncedActions(obj);

		canvas.requestRenderAll();
	};

	const scale = (obj, { movement = 0 }) => {
		hideControls(obj);

		const newScale = obj.scaleX + movement / 100;

		obj.scaleX = newScale;
		obj.scaleY = newScale;

		obj.fire('scaling', { transform: { action: 'scale' } });

		transformCallback(obj);
	};

	const move = (obj, { movementX = 0, movementY = 0 }) => {
		hideControls(obj);

		obj.set({
			top: obj.top + movementY,
			left: obj.left + movementX
		});

		obj.fire('moving');

		transformCallback(obj);
	};

	const rotate = (obj, { movement = 0 }) => {
		hideControls(obj);

		let newAngle = obj.angle + movement;

		const min = 0;
		const max = 359;

		if (newAngle > max) {
			newAngle = min;
		}

		if (newAngle < min) {
			newAngle = max;
		}

		obj.rotate(newAngle);

		obj.fire('rotating');

		transformCallback(obj);
	};

	const handleKeyDown = event => {
		const activeObj = canvas.getActiveObject();
		const keysToListen = Object.values(KEYS);

		if (!activeObj || !keysToListen.includes(event.key)) return;

		event.preventDefault();

		const movementStep = event.shiftKey ? MOVEMENT_STEP_FAST : MOVEMENT_STEP;

		if (event.ctrlKey) {
			if (event.key === KEYS.left) {
				rotate(activeObj, { movement: -movementStep });
			}

			if (event.key === KEYS.right) {
				rotate(activeObj, { movement: movementStep });
			}

			return;
		}

		if (event.key === KEYS.up) {
			move(activeObj, { movementY: -movementStep });
		}
		if (event.key === KEYS.down) {
			move(activeObj, { movementY: movementStep });
		}
		if (event.key === KEYS.left) {
			move(activeObj, { movementX: -movementStep });
		}
		if (event.key === KEYS.right) {
			move(activeObj, { movementX: movementStep });
		}

		if (event.key === KEYS.numpadAdd) {
			scale(activeObj, { movement: movementStep });
		}
		if (event.key === KEYS.numpadSubstract) {
			scale(activeObj, { movement: -movementStep });
		}
	};

	const handleKeyUp = event => {
		const activeObj = canvas.getActiveObject();
		const keysToListen = Object.values(KEYS);

		if (!activeObj || !keysToListen.includes(event.key)) return;

		event.preventDefault();

		debouncedRotationUbication(activeObj);
	};

	const clearEvents = () => {
		document.removeEventListener('keydown', handleKeyDown);
		document.removeEventListener('keyup', handleKeyUp);
	};

	useEffect(() => {
		if (canvas) {
			clearEvents();
			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('keyup', handleKeyUp);
		}

		return () => {
			clearEvents();
		};
	}, [canvas]);
}

let croppedImages = {};
let croppingImages = {};

export function useCropSelector({ canvas, canvasImg, imageUrl, callbacks }) {
	const dispatch = useDispatch();

	const [cropSelector, setCropSelector] = useState(null);
	const { initializeVips, vips, enabled: vipsEnabled } = useVips();
	const {
		section,
		tab = 'erase',
		images = [],
		selectedImage
	} = useShallowSelector(state => state.editor);

	const currentImage = images.find(item => item.id === selectedImage) || {};

	const { settings = {} } = currentImage;
	const { crop, scale = [1, 1] } = settings || {};

	const { onCrop = () => {} } = callbacks || {};

	const isBrush = section === 'actions';
	const isCrop = isBrush && tab === 'trim';

	const applyCrop = async (selector, divisor = true) => {
		const x = selector.left / (divisor ? canvasImg.scaleX : 1);
		const y = selector.top / (divisor ? canvasImg.scaleY : 1);
		const sWidth =
			(selector.width * selector.scaleX) / (divisor ? canvasImg.scaleX : 1);
		const sHeight =
			(selector.height * selector.scaleY) / (divisor ? canvasImg.scaleY : 1);

		if (!vips && vipsEnabled) {
			return initializeVips();
		}

		if (!vips) {
			return;
		}

		const imageData = await fetchImageAsArrayBuffer(imageUrl);

		const params = [x, y, sWidth, sHeight];

		const vipsImage = vips.Image.newFromBuffer(imageData);

		const croppedVipsImage = vipsImage.extractArea(...params);
		// eslint-disable-next-line new-cap
		const transparentBackground = new vips.Image.black(
			canvasImg.width,
			canvasImg.height,
			{ bands: 4 }
		);

		const result = transparentBackground.insert(croppedVipsImage, x, y);

		croppedImages[selectedImage] = true;

		const output = '.png';
		const buffer = result.writeToBuffer(output);
		const newBlob = new Blob([buffer], { type: 'image/png' });
		const dataUrl = URL.createObjectURL(newBlob);

		dispatch(updateImageCroppedUrl(dataUrl));
	};

	useEffect(() => {
		if (!vips && vipsEnabled) {
			initializeVips();
		}
	}, [vips, vipsEnabled]);

	useEffect(() => {
		let timeout = null;

		if (
			(isCrop && cropSelector && canvasImg?.clipPath) ||
			!canvas ||
			!canvasImg
		)
			return;

		if (isCrop) {
			const { cropSelector: selector } = getCropSelector({
				img: canvasImg,
				canvas
			});

			canvasImg?.customSelectionLayer.set({
				selectable: false,
				visible: false
			});

			let oldScaleX = selector.scaleX;
			let oldScaleY = selector.scaleY;
			let oldCenterPoint = selector.getCenterPoint();

			canvas.add(selector);
			setCropSelector(selector);

			selector.on('scaling', () => {
				selector.setCoords();

				canvasImg.set({
					clipPath: new Rect({
						width: selector.width,
						height: selector.height,
						top: selector.top,
						left: selector.left,
						scaleX: selector.scaleX,
						scaleY: selector.scaleY,
						absolutePositioned: true
					})
				});

				canvas.renderAll();
			});

			selector.on('mouseup', event => {
				const { transform } = event || {};
				const { action } = transform || {};

				const cropAction =
					oldScaleX < selector.scaleX || oldScaleY < selector.scaleY
						? 'restore'
						: 'erase';

				oldScaleX = selector.scaleX;
				oldScaleY = selector.scaleY;

				selector.setCoords();

				if (['scaleX', 'scaleY'].includes(action)) {
					applyCrop(selector, cropAction);
					onCrop?.(
						{ img: canvasImg, customSelector: selector, oldCenterPoint },
						cropAction
					);

					oldCenterPoint = selector.getCenterPoint();
				}
			});

			timeout = setTimeout(() => {
				canvas.setActiveObject(selector);
				canvas.renderAll();
			}, 100);

			return;
		}

		if (cropSelector && !isCrop) {
			clearTimeout(timeout);
			canvas.remove(cropSelector);
			setCropSelector(null);

			canvasImg?.customSelectionLayer?.set?.({
				selectable: true,
				visible: true
			});
			canvasImg.clipPath = null;
			canvas?.renderAll?.();
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [isCrop, canvasImg]);

	useEffect(() => {
		if (settings && !crop && selectedImage) {
			croppingImages[selectedImage] = true;
			croppedImages[selectedImage] = true;

			return;
		}

		if (
			selectedImage &&
			!croppingImages[selectedImage] &&
			canvasImg &&
			!canvasImg.cropping &&
			crop &&
			Object.keys(crop).length
		) {
			if (!vips && vipsEnabled) {
				initializeVips();
				return;
			}

			if (!vips) {
				return;
			}

			const [scaleX, scaleY] = scale;

			canvasImg.cropping = true;
			croppingImages[selectedImage] = true;

			applyCrop(
				new Rect({
					left: crop.left * canvasImg.originalRatio * scaleX,
					top: crop.top * canvasImg.originalRatio * scaleY,
					width: crop.width * canvasImg.originalRatio * scaleX,
					height: crop.height * canvasImg.originalRatio * scaleY
				})
			);
		}
	}, [canvasImg, settings, selectedImage, vips]);

	useEffect(() => {
		return () => {
			croppingImages = {};
			croppedImages = {};
		};
	}, []);

	return {
		croppedImg: croppedImages[selectedImage]
	};
}
