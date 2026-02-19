import { useRef, useEffect, useState } from 'react';
import { Canvas, PencilBrush } from 'fabric';
import { useDispatch, useSelector } from 'react-redux';
import { applyBrush } from '@/store/editor/thunks';
import { showError } from '@/utils';
import { Box } from '@mui/material';
import { saveInStack } from '@/store/editor';

import {
	getDrawCursor,
	getImageUrl,
	pathToSvg,
	svgToPng,
	getBoundingBox,
	loadImage
} from './utils';
import { BRUSH_COLOR, CUSTOM_FABRIC_EVENTS } from './constants';
import { resizeListener, useImageZoomPan, useZoomListener } from './hooks';

export function MagicBrushCanvas({
	id,
	canvasImg,
	originalCanvasImg,
	originalCanvas,
	transformedCanvas,
	initializing,
	setBrushCanvas = () => {}
}) {
	const canvasRef = useRef(null);
	const dispatch = useDispatch();
	const {
		selectedImage,
		images = [],
		tab = 'erase',
		applyBrush: { loading } = {}
	} = useSelector(state => state.editor);

	const currentImage = images.find(item => item.id === selectedImage) || {};

	const { settings = {}, positions } = currentImage;
	const {
		brushSize,
		zoomLevel = 1,
		backgroundColor: currentBackgroundColor
	} = settings || {};

	const [canvas, setCanvas] = useState(null);
	const [path, setPath] = useState(null);
	const [drawingMode, setDrawingMode] = useState(true);

	const isEraser = tab === 'erase';
	const isRestore = tab === 'restore';

	resizeListener({ canvas, canvasReference: transformedCanvas });

	const clearDrawing = () => {
		canvas.getObjects().forEach(obj => {
			if (obj.type === 'path') {
				canvas.remove(obj);
			}
		});
		canvas.renderAll();
	};

	const toggleBackgroundImage = (canvasItem, payload = true) => {
		if (canvasItem?.backgroundImage) {
			canvasItem.backgroundImage.visible = payload;
			canvasItem.renderAll();
		}
	};

	const toggleBackgroundColor = (canvasItem, payload = true) => {
		if (canvasItem) {
			canvasItem.backgroundColor = payload ? currentBackgroundColor : null;
			canvasItem.renderAll();
		}
	};

	const toggleBackground = hide => {
		toggleBackgroundImage(transformedCanvas, !hide);
		toggleBackgroundColor(
			transformedCanvas,
			hide ? null : currentBackgroundColor
		);
	};

	const setCompareBackground = async () => {
		const originalImgCloned = await originalCanvasImg.clone();

		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;
		const imageWidth = originalImgCloned.width;
		const imageHeight = originalImgCloned.height;

		const scaleRatioWidth = canvasWidth / imageWidth;
		const scaleRatioHeight = canvasHeight / imageHeight;
		const scaleRatio = Math.max(scaleRatioWidth, scaleRatioHeight);

		originalImgCloned.set({
			selectable: false,
			scaleX: scaleRatio,
			scaleY: scaleRatio,
			opacity: 0.5
		});

		toggleBackground(isRestore);

		if (!canvas?.contextContainer) {
			// to avoid TypeError: Cannot read properties of null (reading 'clearRect')
			return;
		}

		canvas.backgroundImage = originalImgCloned;
		canvas.renderAll();
	};

	useEffect(() => {
		let fabricCanvas;

		if (!initializing && canvasRef?.current) {
			fabricCanvas = new Canvas(canvasRef.current, {
				isDrawingMode: true,
				width: transformedCanvas?.width,
				height: transformedCanvas?.height,
				backgroundColor: 'rgba(0,0,0,0)',
				scaleX: zoomLevel,
				scaleY: zoomLevel,
				selection: false,
				fireMiddleClick: true
			});

			if (transformedCanvas?.viewportTransform) {
				fabricCanvas.setViewportTransform([
					...transformedCanvas.viewportTransform
				]);
			}

			fabricCanvas.freeDrawingCursor = getDrawCursor(brushSize * zoomLevel);
			fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
			fabricCanvas.freeDrawingBrush.color = BRUSH_COLOR;

			fabricCanvas.on('path:created', evt => {
				evt.path.set({ selectable: false, hoverCursor: 'default' });
				setPath(evt.path);
			});

			setBrushCanvas?.(fabricCanvas);
			setCanvas(fabricCanvas);
		}

		return () => {
			fabricCanvas?.dispose?.();
		};
	}, [canvasRef, currentImage?.transformed, initializing]);

	const sendBrush = async () => {
		try {
			setDrawingMode(false);
			const url = getImageUrl(currentImage?.base?.path);
			const { width, height } = originalCanvasImg ?? (await loadImage(url));

			const scaleFactor = width / canvas.width;
			// Calculate bounding box as a hint to optimize targeted processing on the server.
			const boundingBox = getBoundingBox(path, scaleFactor);

			// clone path so we can leave the painted path on the canvas
			// with the original color
			const clonedPath = await path.clone();
			const backgroundColor = isEraser ? '#ffffff' : '#000000';
			clonedPath.set('stroke', isEraser ? '#000000' : '#ffffff');

			const svg = pathToSvg(clonedPath, {
				width: canvas.width,
				height: canvas.height,
				backgroundColor
			});

			const file = await svgToPng(svg, width, height, scaleFactor);

			await dispatch(
				applyBrush({ type: tab, id: selectedImage, file, boundingBox })
			).unwrap();

			dispatch(saveInStack({ sync: true }));
		} catch (err) {
			showError(err);
		} finally {
			setDrawingMode(true);
			clearDrawing();
			setPath(null);
		}
	};

	useImageZoomPan({
		canvas,
		id,
		positions,
		layersToSync: [originalCanvas, transformedCanvas]
	});

	useEffect(() => {
		if (canvas) {
			canvas.freeDrawingBrush.width = brushSize;
			canvas.freeDrawingCursor = getDrawCursor(brushSize * zoomLevel);
		}
	}, [canvas, brushSize, zoomLevel]);

	useZoomListener({ canvas, currentImage });

	useEffect(() => {
		if (path && drawingMode) {
			sendBrush();
		}
	}, [path, canvas]);

	useEffect(() => {
		if (canvas) {
			canvas.isDrawingMode = drawingMode && !loading;
		}
	}, [drawingMode, canvas, loading]);

	useEffect(() => {
		if (canvas && isRestore) {
			if (canvas.backgroundImage) {
				toggleBackgroundImage(canvas, true);

				return;
			}

			setCompareBackground();

			return;
		}

		toggleBackgroundImage(canvas, false);

		return () => {
			toggleBackgroundImage(canvas, false);
		};
	}, [tab, canvas, canvasImg]);

	useEffect(() => {
		const setRestoreBackground = () => {
			toggleBackground(isRestore);
		};

		setRestoreBackground();

		transformedCanvas?.on(
			CUSTOM_FABRIC_EVENTS.mainBackgroundAdded,
			setRestoreBackground
		);

		return () => {
			toggleBackground(false);
			transformedCanvas?.off(CUSTOM_FABRIC_EVENTS.mainBackgroundAdded);
		};
	}, [tab, transformedCanvas, isRestore, currentBackgroundColor]);

	const touchStartFn = evt => {
		if (evt?.touches?.length === 2) {
			setDrawingMode(false);
		}
	};
	const touchEndFn = () => {
		setTimeout(() => {
			setDrawingMode(true);
		}, 200);
	};

	const clearEvents = () => {
		if (canvas) {
			window.removeEventListener('touchstart', touchStartFn);
			window.removeEventListener('touchend', touchEndFn);
		}
	};

	useEffect(() => {
		if (canvas) {
			clearEvents();
			window.addEventListener('touchstart', touchStartFn);
			window.addEventListener('touchend', touchEndFn);
		}

		return () => {
			clearEvents();
		};
	}, [canvas]);

	return (
		<Box
			sx={{
				'&& > .canvas-container > .upper-canvas': {
					opacity: drawingMode ? 1 : 0
				}
			}}
		>
			<canvas
				id="brushCanvas"
				style={{ width: '100%', height: '100%' }}
				ref={canvasRef}
			/>
		</Box>
	);
}
